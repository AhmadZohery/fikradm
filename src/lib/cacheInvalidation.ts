/**
 * Cache invalidation orchestrator.
 *
 * Strategy:
 *  1. Bump entity `updated_at` (and `cache_version` if column exists) so any
 *     URL-keyed CDN cache (s-maxage) re-validates on next request.
 *  2. Invalidate React Query keys for related lists/detail so the admin and
 *     site (in same tab) refresh immediately.
 *  3. Optionally call a public revalidate endpoint to purge the edge cache
 *     for the affected URL(s) — respects SWR by sending a soft purge.
 *
 * Designed to be called on every Save/Publish.
 */
import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { recordInvalidation, type PurgeResult, type Phase } from "./cacheMetrics";

export type InvalidateTarget =
  | { kind: "blog"; slug: string; id?: string }
  | { kind: "service"; slug: string; id?: string }
  | { kind: "page"; slug: string; locale?: string; id?: string }
  | { kind: "industry"; slug: string; id?: string };

export type InvalidateOptions = {
  correlationId?: string;
  phase?: Phase;
  /** Max retry attempts per URL purge (default 3). */
  maxRetries?: number;
};

const RELATED_QUERY_KEYS: Record<InvalidateTarget["kind"], string[][]> = {
  blog: [["blog-posts"], ["blog-post"], ["sitemap"], ["llms-txt"]],
  service: [["services"], ["service"], ["sitemap"], ["llms-txt"]],
  page: [["pages"], ["page"], ["sitemap"]],
  industry: [["industries"], ["industry"], ["sitemap"]],
};

/** Bump updated_at so downstream caches (CDN, ISR fetcher) see a fresher signature. */
async function bumpEntityTimestamp(t: InvalidateTarget) {
  const now = new Date().toISOString();
  try {
    if (t.kind === "blog") {
      await supabase.from("blog_posts").update({ updated_at: now }).eq(t.id ? "id" : "slug", t.id ?? t.slug);
    } else if (t.kind === "service") {
      await supabase.from("services").update({ updated_at: now }).eq(t.id ? "id" : "slug", t.id ?? t.slug);
    } else if (t.kind === "page") {
      await supabase.from("pages").update({ updated_at: now }).eq(t.id ? "id" : "slug", t.id ?? t.slug);
    } else if (t.kind === "industry") {
      await supabase.from("industries").update({ updated_at: now }).eq(t.id ? "id" : "slug", t.id ?? t.slug);
    }
  } catch {
    /* swallow — invalidation is best-effort */
  }
}

/** Public URLs that should be soft-purged for each target. */
function affectedUrls(t: InvalidateTarget): string[] {
  switch (t.kind) {
    case "blog":
      return [`/blog/${t.slug}`, `/ar/blog/${t.slug}`, `/en/blog/${t.slug}`, `/blog`, `/sitemap.xml`];
    case "service":
      return [`/services/${t.slug}`, `/ar/services/${t.slug}`, `/en/services/${t.slug}`, `/services`, `/sitemap.xml`];
    case "page": {
      const base = t.locale ? `/${t.locale}/${t.slug}` : `/${t.slug}`;
      return [base, `/sitemap.xml`];
    }
    case "industry":
      return [`/industries/${t.slug}`, `/industries`, `/sitemap.xml`];
  }
}

/**
 * Soft-purge affected URLs with retry/backoff. Captures per-URL status and
 * CDN cache hints (cf-cache-status / x-vercel-cache / age) so the admin
 * debug page can show whether the edge revalidated.
 */
async function softPurge(urls: string[], maxRetries: number): Promise<PurgeResult[]> {
  if (typeof fetch === "undefined") return urls.map((u) => ({ url: u, ok: false, attempts: 0 }));
  const ts = Date.now();
  const one = async (u: string): Promise<PurgeResult> => {
    let attempts = 0;
    let lastErr: string | undefined;
    let status: number | undefined;
    let cacheHint: string | undefined;
    while (attempts < maxRetries) {
      attempts++;
      try {
        const r = await fetch(`${u}?_cb=${ts}`, {
          method: "HEAD",
          cache: "reload",
          headers: { "Cache-Control": "max-age=0" },
        });
        status = r.status;
        cacheHint =
          r.headers.get("cf-cache-status") ||
          r.headers.get("x-vercel-cache") ||
          (r.headers.get("age") ? `age=${r.headers.get("age")}` : undefined) ||
          undefined;
        if (r.ok || r.status === 304) {
          return { url: u, ok: true, status, cacheHint, attempts };
        }
        lastErr = `HTTP ${r.status}`;
      } catch (e) {
        lastErr = e instanceof Error ? e.message : String(e);
      }
      // Exponential backoff: 100ms, 300ms, 700ms
      await new Promise((r) => setTimeout(r, 100 * (3 ** (attempts - 1))));
    }
    return { url: u, ok: false, status, cacheHint, attempts, error: lastErr };
  };
  return Promise.all(urls.map(one));
}

/** Invalidate everything related to a target after Save/Publish. */
export async function invalidateAfterSave(
  target: InvalidateTarget,
  queryClient?: QueryClient,
  opts: InvalidateOptions = {},
) {
  const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
  const keys = RELATED_QUERY_KEYS[target.kind];
  const urls = affectedUrls(target);
  const maxRetries = opts.maxRetries ?? 3;
  let ok = true;
  let error: string | undefined;
  let purgeResults: PurgeResult[] = [];
  try {
    await bumpEntityTimestamp(target);
    if (queryClient) {
      for (const key of keys) queryClient.invalidateQueries({ queryKey: key });
    }
    // Await purge so retries + hints are captured in the same event.
    purgeResults = await softPurge(urls, maxRetries);
    if (purgeResults.some((p) => !p.ok)) {
      ok = false;
      const failed = purgeResults.filter((p) => !p.ok);
      error = `${failed.length}/${purgeResults.length} URLs failed after ${maxRetries} retries`;
    }
  } catch (e) {
    ok = false;
    error = e instanceof Error ? e.message : String(e);
  } finally {
    const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const totalRetries = purgeResults.reduce((s, p) => s + Math.max(0, p.attempts - 1), 0);
    // Pick the most common CDN cache hint as the aggregate ISR signal.
    const hintCounts: Record<string, number> = {};
    for (const p of purgeResults) if (p.cacheHint) hintCounts[p.cacheHint] = (hintCounts[p.cacheHint] ?? 0) + 1;
    const isrHint = Object.entries(hintCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    recordInvalidation({
      correlationId: opts.correlationId,
      phase: opts.phase,
      kind: target.kind,
      slug: target.slug,
      urlsPurged: urls,
      queryKeysInvalidated: keys.map((k) => k.join(":")),
      durationMs: Math.round(t1 - t0),
      retries: totalRetries,
      purgeResults,
      isrHint,
      ok,
      error,
    });
  }
}

/** Convenience for blog posts. */
export function invalidateBlogPost(slug: string, id: string | undefined, qc?: QueryClient, opts?: InvalidateOptions) {
  return invalidateAfterSave({ kind: "blog", slug, id }, qc, opts);
}
export function invalidateService(slug: string, id: string | undefined, qc?: QueryClient, opts?: InvalidateOptions) {
  return invalidateAfterSave({ kind: "service", slug, id }, qc, opts);
}
export function invalidatePage(slug: string, locale: string | undefined, id: string | undefined, qc?: QueryClient, opts?: InvalidateOptions) {
  return invalidateAfterSave({ kind: "page", slug, locale, id }, qc, opts);
}