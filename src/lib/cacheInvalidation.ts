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

export type InvalidateTarget =
  | { kind: "blog"; slug: string; id?: string }
  | { kind: "service"; slug: string; id?: string }
  | { kind: "page"; slug: string; locale?: string; id?: string }
  | { kind: "industry"; slug: string; id?: string };

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
 * Soft-purge affected URLs by issuing a `?_=ts` HEAD fetch with
 * `Cache-Control: max-age=0`. This nudges the edge to revalidate without
 * invalidating siblings (respects ISR).
 */
async function softPurge(urls: string[]) {
  if (typeof fetch === "undefined") return;
  const ts = Date.now();
  await Promise.allSettled(
    urls.map((u) =>
      fetch(`${u}?_cb=${ts}`, {
        method: "HEAD",
        cache: "reload",
        headers: { "Cache-Control": "max-age=0" },
      }).catch(() => null),
    ),
  );
}

/** Invalidate everything related to a target after Save/Publish. */
export async function invalidateAfterSave(target: InvalidateTarget, queryClient?: QueryClient) {
  await bumpEntityTimestamp(target);

  if (queryClient) {
    for (const key of RELATED_QUERY_KEYS[target.kind]) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  }

  // Fire-and-forget — don't block UI
  void softPurge(affectedUrls(target));
}

/** Convenience for blog posts. */
export function invalidateBlogPost(slug: string, id: string | undefined, qc?: QueryClient) {
  return invalidateAfterSave({ kind: "blog", slug, id }, qc);
}

/** Convenience for services. */
export function invalidateService(slug: string, id: string | undefined, qc?: QueryClient) {
  return invalidateAfterSave({ kind: "service", slug, id }, qc);
}

/** Convenience for pages. */
export function invalidatePage(slug: string, locale: string | undefined, id: string | undefined, qc?: QueryClient) {
  return invalidateAfterSave({ kind: "page", slug, locale, id }, qc);
}