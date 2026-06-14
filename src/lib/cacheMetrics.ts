/**
 * In-memory + localStorage debug metrics for cache invalidation AND publish guard
 * events, joined by a shared `correlationId` so admins can trace one
 * Save/Publish action through every downstream cache/purge/block event.
 *
 * Trade-off: per-browser persistence (last 100 of each). Server-side
 * aggregation lives in `metricsExporter.ts` (Sentry breadcrumb + optional
 * Prometheus endpoint) for fleet-wide visibility.
 */

export type EntityKind = "blog" | "service" | "page" | "industry";
export type Phase = "save" | "publish" | "manual" | "auto";

export type PurgeResult = {
  url: string;
  ok: boolean;
  status?: number;
  /** Cache status from CDN: cf-cache-status / x-vercel-cache / age — best-effort. */
  cacheHint?: string;
  attempts: number;
  error?: string;
};

export type CacheInvalidationEvent = {
  id: string;
  at: string;
  correlationId?: string;
  phase?: Phase;
  kind: EntityKind;
  slug: string;
  urlsPurged: string[];
  queryKeysInvalidated: string[];
  durationMs: number;
  retries: number;
  purgeResults?: PurgeResult[];
  /** Aggregated ISR/CDN hint (most common header value across URLs). */
  isrHint?: string;
  ok: boolean;
  error?: string;
};

export type PublishGuardEvent = {
  id: string;
  at: string;
  correlationId: string;
  phase: "attempted" | "blocked" | "allowed" | "forced";
  kind: EntityKind;
  slug: string;
  score: number;
  blockerReasons: string[];
  warningReasons: string[];
};

const KEYS = {
  invalidations: "fikra:cache:invalidations:v2",
  publish: "fikra:publish:guard-events:v1",
};
const MAX = 200;

type Listener<T> = (events: T[]) => void;
const invListeners = new Set<Listener<CacheInvalidationEvent>>();
const pubListeners = new Set<Listener<PublishGuardEvent>>();

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function save<T>(key: string, events: T[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(events.slice(0, MAX))); } catch { /* quota */ }
}

/** Generate a short, time-ordered correlation id (sortable). */
export function newCorrelationId(prefix = "cid"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function recordInvalidation(e: Omit<CacheInvalidationEvent, "id" | "at">): CacheInvalidationEvent {
  const event: CacheInvalidationEvent = {
    ...e,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
  };
  const next = [event, ...load<CacheInvalidationEvent>(KEYS.invalidations)].slice(0, MAX);
  save(KEYS.invalidations, next);
  // eslint-disable-next-line no-console
  console.info(
    `[cache:invalidate cid=${event.correlationId ?? "-"}] ${event.kind}/${event.slug} → ${event.urlsPurged.length} URLs (retries=${event.retries}) in ${event.durationMs}ms${event.ok ? "" : ` ERR: ${event.error}`}`,
  );
  invListeners.forEach((l) => l(next));
  // Fire-and-forget Sentry/Prometheus
  void exportEvent("cache_invalidation", event as unknown as Record<string, unknown>);
  return event;
}

export function recordPublishGuard(e: Omit<PublishGuardEvent, "id" | "at">): PublishGuardEvent {
  const event: PublishGuardEvent = {
    ...e,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
  };
  const next = [event, ...load<PublishGuardEvent>(KEYS.publish)].slice(0, MAX);
  save(KEYS.publish, next);
  // eslint-disable-next-line no-console
  console.info(`[publish:${event.phase} cid=${event.correlationId}] ${event.kind}/${event.slug} score=${event.score}`);
  pubListeners.forEach((l) => l(next));
  void exportEvent("publish_guard", event as unknown as Record<string, unknown>);
  return event;
}

export const getInvalidationEvents = () => load<CacheInvalidationEvent>(KEYS.invalidations);
export const getPublishEvents = () => load<PublishGuardEvent>(KEYS.publish);

export function clearInvalidationEvents() { save(KEYS.invalidations, []); invListeners.forEach((l) => l([])); }
export function clearPublishEvents() { save(KEYS.publish, []); pubListeners.forEach((l) => l([])); }

export function subscribeInvalidations(l: Listener<CacheInvalidationEvent>) {
  invListeners.add(l); return () => { invListeners.delete(l); };
}
export function subscribePublishEvents(l: Listener<PublishGuardEvent>) {
  pubListeners.add(l); return () => { pubListeners.delete(l); };
}

export function invalidationStats(events: CacheInvalidationEvent[]) {
  if (events.length === 0) {
    return { total: 0, avgDurationMs: 0, p95DurationMs: 0, urlsPurged: 0, errors: 0, retries: 0, byKind: {} as Record<string, number>, byPhase: {} as Record<string, number> };
  }
  const durations = events.map((e) => e.durationMs).sort((a, b) => a - b);
  const p95 = durations[Math.floor(durations.length * 0.95)] ?? durations[durations.length - 1];
  const byKind: Record<string, number> = {};
  const byPhase: Record<string, number> = {};
  let urls = 0, errors = 0, retries = 0;
  for (const e of events) {
    byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
    if (e.phase) byPhase[e.phase] = (byPhase[e.phase] ?? 0) + 1;
    urls += e.urlsPurged.length;
    retries += e.retries ?? 0;
    if (!e.ok) errors++;
  }
  return {
    total: events.length,
    avgDurationMs: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
    p95DurationMs: p95,
    urlsPurged: urls,
    errors,
    retries,
    byKind,
    byPhase,
  };
}

/** Lazy import to avoid SSR / circular issues. */
async function exportEvent(type: "cache_invalidation" | "publish_guard", payload: Record<string, unknown>) {
  try {
    const mod = await import("./metricsExporter");
    mod.exportMetric(type, payload);
  } catch { /* exporter optional */ }
}