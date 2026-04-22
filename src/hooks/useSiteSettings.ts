import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Settings keys we use across the site.
 * Matches the rows seeded in the `site_settings` table.
 */
export type ContactSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  address_ar?: string;
  address_en?: string;
  working_hours_ar?: string;
  working_hours_en?: string;
};

export type AnnouncementMessage = {
  icon: string;
  ar: string;
  en: string;
  cta_ar?: string;
  cta_en?: string;
  href?: string;
};

export type AnnouncementSettings = {
  enabled: boolean;
  messages: AnnouncementMessage[];
};

export type NavLink = { ar: string; en: string; href: string };
export type NavigationSettings = {
  header: NavLink[];
  footer_columns?: { title_ar: string; title_en: string; links: NavLink[] }[];
};

export type BrandSettings = {
  logo_url?: string;
  logo_text_ar?: string;
  logo_text_en?: string;
  tagline_ar?: string;
  tagline_en?: string;
  social?: Record<string, string>;
};

type SettingsMap = {
  contact?: ContactSettings;
  announcement?: AnnouncementSettings;
  navigation?: NavigationSettings;
  brand?: BrandSettings;
  [k: string]: unknown;
};

// Module-level cache so multiple components share one fetch.
let cache: SettingsMap | null = null;
let inflight: Promise<SettingsMap> | null = null;
const listeners = new Set<(s: SettingsMap) => void>();

async function fetchAll(): Promise<SettingsMap> {
  const { data, error } = await supabase.from("site_settings").select("key, data");
  if (error || !data) return {};
  const out: SettingsMap = {};
  for (const row of data) {
    out[row.key] = row.data as unknown;
  }
  return out;
}

function ensureLoaded(): Promise<SettingsMap> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetchAll().then((s) => {
    cache = s;
    inflight = null;
    listeners.forEach((l) => l(s));
    return s;
  });
  return inflight;
}

/** Force reload — call after admin saves. */
export async function refreshSiteSettings() {
  cache = null;
  inflight = null;
  const s = await ensureLoaded();
  listeners.forEach((l) => l(s));
  return s;
}

/**
 * Read a single settings section, with an inline default fallback so the
 * UI keeps working even before the row is fetched (no flash, SSR-safe).
 */
export function useSiteSetting<K extends keyof SettingsMap>(
  key: K,
  fallback: NonNullable<SettingsMap[K]>,
): NonNullable<SettingsMap[K]> {
  const [value, setValue] = useState<NonNullable<SettingsMap[K]>>(
    (cache?.[key] as NonNullable<SettingsMap[K]>) ?? fallback,
  );

  useEffect(() => {
    let alive = true;
    const onUpdate = (s: SettingsMap) => {
      if (!alive) return;
      setValue((s[key] as NonNullable<SettingsMap[K]>) ?? fallback);
    };
    listeners.add(onUpdate);
    ensureLoaded().then(onUpdate);
    return () => {
      alive = false;
      listeners.delete(onUpdate);
    };
    // fallback intentionally excluded — comparing object identity would refire
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return value;
}