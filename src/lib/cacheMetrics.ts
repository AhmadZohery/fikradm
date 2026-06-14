/**
 * In-memory metrics ring buffer for cache invalidation events.
 *
 * Lightweight, client-side observability for `invalidateAfterSave`:
 *  - record({ kind, slug, urls, queryKeys, durationMs, ok })
 *  - getEvents() / subscribe() for the Admin debug page
 *  - clear()
 *
 * Persisted to localStorage (last 100) so the debug page survives reloads
 * without needing a server table. Trade-off: per-browser only — acceptable
 * for admin diagnostics. Move to a `cache_invalidation_log` table if you
 * need fleet-wide history.
 */

export type CacheInvalidationEvent = {
  id: string;
  at: string; // ISO
  kind: "blog" | "service" | "page" | "industry";
  slug: string;
  urlsPurged: string[];
  queryKeysInvalidated: string[];
  durationMs: number;
  ok: boolean;
  error?: string;
};

const KEY = "fikra:cache:invalidations:v1";
const MAX = 100;

type Listener = (events: CacheInvalidationEvent[]) => void;
const listeners = new Set<Listener>();

function load(): CacheInvalidationEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CacheInvalidationEvent[]) : [];
  } catch {
    return [];
  }
}

function save(events: CacheInvalidationEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(events.slice(0, MAX)));
  } catch {
    /* quota — ignore */
  }
}

export function recordInvalidation(e: Omit<CacheInvalidationEvent, "id" | "at">): CacheInvalidationEvent {
  const event: CacheInvalidationEvent = {
    ...e,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
  };
  const next = [event, ...load()].slice(0, MAX);
  save(next);
  // Console for live debugging
  // eslint-disable-next-line no-console
  console.info(
    `[cache:invalidate] ${event.kind}/${event.slug} → ${event.urlsPurged.length} URLs, ${event.queryKeysInvalidated.length} keys in ${event.durationMs}ms${event.ok ? "" : ` (ERROR: ${event.error})`}`,
  );
  listeners.forEach((l) => l(next));
  return event;
}

export function getInvalidationEvents(): CacheInvalidationEvent[] {
  return load();
}

export function clearInvalidationEvents() {
  save([]);
  listeners.forEach((l) => l([]));
}

export function subscribeInvalidations(l: Listener): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function invalidationStats(events: CacheInvalidationEvent[]) {
  if (events.length === 0) {
    return { total: 0, avgDurationMs: 0, p95DurationMs: 0, urlsPurged: 0, errors: 0, byKind: {} as Record<string, number> };
  }
  const durations = events.map((e) => e.durationMs).sort((a, b) => a - b);
  const p95 = durations[Math.floor(durations.length * 0.95)] ?? durations[durations.length - 1];
  const byKind: Record<string, number> = {};
  let urls = 0;
  let errors = 0;
  for (const e of events) {
    byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
    urls += e.urlsPurged.length;
    if (!e.ok) errors++;
  }
  return {
    total: events.length,
    avgDurationMs: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
    p95DurationMs: p95,
    urlsPurged: urls,
    errors,
    byKind,
  };
}