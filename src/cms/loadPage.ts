import { supabase } from "@/integrations/supabase/client";
import type { BlockInstance } from "./blocks/registry";

export type CmsPage = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  status: "draft" | "published" | "archived";
  blocks: BlockInstance[];
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  keywords: string[] | null;
  no_index: boolean;
};

/**
 * Fetch a published page by slug + locale. Returns null on miss/error so the
 * caller can fall back to static content. Loaders run on both client and server,
 * so this uses the public anon client (RLS allows reading published pages).
 */
export async function fetchPage(slug: string, locale: string): Promise<CmsPage | null> {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select(
        "id, slug, locale, title, status, blocks, meta_title, meta_description, og_image_url, canonical_url, keywords, no_index",
      )
      .eq("slug", slug)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return null;
    return {
      ...data,
      blocks: Array.isArray(data.blocks) ? (data.blocks as unknown as BlockInstance[]) : [],
    };
  } catch (e) {
    if (import.meta.env.DEV) console.warn("[CMS] fetchPage failed", e);
    return null;
  }
}
