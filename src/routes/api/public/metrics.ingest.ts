import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Lightweight in-worker Prometheus aggregator.
 *
 * POST /api/public/metrics/ingest  { type, payload }   — increments counters
 * GET  /api/public/metrics/ingest                       — Prometheus exposition
 *
 * Auth: if `METRICS_TOKEN` is set, header `X-Metrics-Token` must match for GET.
 * POST is open (browser-origin) but only stores aggregate counters — no PII.
 *
 * Storage: per-worker memory (resets on cold start). Acceptable for short-term
 * scraping; for long-term history wire to a database or an external metrics
 * collector (Grafana Cloud / Datadog).
 */

type Counter = { value: number; labels: Record<string, string> };
const counters: Counter[] = [];
const durations: number[] = [];

function bump(name: string, labels: Record<string, string>, delta = 1) {
  const found = counters.find(
    (c) => (c as any).__name === name && JSON.stringify(c.labels) === JSON.stringify(labels),
  );
  if (found) found.value += delta;
  else { const c: any = { __name: name, value: delta, labels }; counters.push(c); }
}

const IngestSchema = z.object({
  type: z.enum(["cache_invalidation", "publish_guard"]),
  payload: z.record(z.unknown()),
});

function renderProm(): string {
  const lines: string[] = [];
  const byName = new Map<string, Counter[]>();
  for (const c of counters) {
    const name = (c as any).__name as string;
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name)!.push(c);
  }
  for (const [name, arr] of byName) {
    lines.push(`# TYPE ${name} counter`);
    for (const c of arr) {
      const lbl = Object.entries(c.labels).map(([k, v]) => `${k}="${String(v).replace(/"/g, "")}"`).join(",");
      lines.push(`${name}{${lbl}} ${c.value}`);
    }
  }
  if (durations.length) {
    const sorted = [...durations].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    lines.push(`# TYPE fikra_cache_invalidation_duration_ms summary`);
    lines.push(`fikra_cache_invalidation_duration_ms{quantile="0.5"} ${p50}`);
    lines.push(`fikra_cache_invalidation_duration_ms{quantile="0.95"} ${p95}`);
    lines.push(`fikra_cache_invalidation_duration_ms_count ${durations.length}`);
  }
  return lines.join("\n") + "\n";
}

export const Route = createFileRoute("/api/public/metrics/ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const json = await request.json();
          const { type, payload } = IngestSchema.parse(json);
          const p = payload as Record<string, unknown>;
          const kind = String(p.kind ?? "unknown");
          if (type === "cache_invalidation") {
            const ok = p.ok === true;
            bump("fikra_cache_invalidation_total", { kind, status: ok ? "ok" : "error" });
            if (typeof p.retries === "number") bump("fikra_cache_invalidation_retries_total", { kind }, p.retries);
            if (typeof p.durationMs === "number") {
              durations.push(p.durationMs);
              if (durations.length > 1000) durations.splice(0, durations.length - 1000);
            }
          } else if (type === "publish_guard") {
            const phase = String(p.phase ?? "attempted");
            bump("fikra_publish_guard_total", { kind, phase });
          }
          return new Response("ok", { status: 204 });
        } catch {
          return new Response("bad request", { status: 400 });
        }
      },
      GET: async ({ request }) => {
        const token = process.env.METRICS_TOKEN;
        if (token) {
          const hdr = request.headers.get("x-metrics-token");
          if (hdr !== token) return new Response("forbidden", { status: 403 });
        }
        return new Response(renderProm(), {
          status: 200,
          headers: { "Content-Type": "text/plain; version=0.0.4" },
        });
      },
    },
  },
});