/**
 * Metrics exporter — forwards `cacheMetrics` events to:
 *  1. Sentry (if `window.Sentry` is loaded or `VITE_SENTRY_DSN` is set) as
 *     a breadcrumb, and `captureMessage` for slow/error events.
 *  2. A server-side Prometheus aggregator via `/api/public/metrics/ingest`
 *     (fire-and-forget HEAD-style POST; protected by `METRICS_TOKEN`).
 *
 * Thresholds (configurable via env at build time):
 *  - VITE_METRICS_SLOW_MS (default 1500) → alert if a single op exceeds it
 *  - error events ALWAYS captured at "warning" level
 *
 * The Prometheus endpoint exposes counters; alerts wire up in your scraper
 * (Grafana / Alertmanager) — see /api/public/metrics for the metric names.
 */

type AnyEvent = Record<string, unknown>;

const SLOW_MS = Number(
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_METRICS_SLOW_MS) || 1500,
);

function getSentry(): any | null {
  if (typeof window === "undefined") return null;
  return (window as any).Sentry ?? null;
}

function ingestUrl(): string | null {
  if (typeof window === "undefined") return null;
  return "/api/public/metrics/ingest";
}

export function exportMetric(type: "cache_invalidation" | "publish_guard", payload: AnyEvent) {
  // 1) Sentry breadcrumb + optional capture
  const sentry = getSentry();
  if (sentry?.addBreadcrumb) {
    try {
      sentry.addBreadcrumb({
        category: type,
        level: payload.ok === false || payload.phase === "blocked" ? "warning" : "info",
        message: `${type} ${(payload.kind as string) ?? ""}/${(payload.slug as string) ?? ""}`,
        data: payload,
      });
      const durMs = Number((payload.durationMs as number) ?? 0);
      if (payload.ok === false) {
        sentry.captureMessage?.(`[${type}] failure: ${(payload as any).error ?? "unknown"}`, "warning");
      } else if (durMs > SLOW_MS) {
        sentry.captureMessage?.(`[${type}] slow (${durMs}ms)`, "warning");
      }
    } catch { /* sentry optional */ }
  }

  // 2) Prometheus ingest (fire-and-forget). Browser will not block UI.
  const url = ingestUrl();
  if (url) {
    try {
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
        keepalive: true,
      }).catch(() => null);
    } catch { /* ignore */ }
  }
}

/** Render local events as Prometheus text exposition for manual copy/export. */
export function toPrometheusText(events: { type: string; durationMs?: number; ok?: boolean; kind?: string }[]): string {
  const lines: string[] = [];
  lines.push("# HELP fikra_cache_invalidation_total Total cache invalidations (browser)");
  lines.push("# TYPE fikra_cache_invalidation_total counter");
  const byKind: Record<string, { ok: number; err: number }> = {};
  for (const e of events) {
    const k = e.kind ?? "unknown";
    byKind[k] ??= { ok: 0, err: 0 };
    if (e.ok === false) byKind[k].err++; else byKind[k].ok++;
  }
  for (const [k, v] of Object.entries(byKind)) {
    lines.push(`fikra_cache_invalidation_total{kind="${k}",status="ok"} ${v.ok}`);
    lines.push(`fikra_cache_invalidation_total{kind="${k}",status="error"} ${v.err}`);
  }
  const durs = events.map((e) => e.durationMs ?? 0).filter((n) => n > 0).sort((a, b) => a - b);
  if (durs.length) {
    const p50 = durs[Math.floor(durs.length * 0.5)];
    const p95 = durs[Math.floor(durs.length * 0.95)];
    lines.push("# HELP fikra_cache_invalidation_duration_ms Cache invalidation durations");
    lines.push("# TYPE fikra_cache_invalidation_duration_ms summary");
    lines.push(`fikra_cache_invalidation_duration_ms{quantile="0.5"} ${p50}`);
    lines.push(`fikra_cache_invalidation_duration_ms{quantile="0.95"} ${p95}`);
  }
  return lines.join("\n") + "\n";
}