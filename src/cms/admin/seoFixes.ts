/**
 * Smart auto-fixes for SEO Audit. Each function returns a suggested
 * value derived from the page row + first text block. Apply via
 * Supabase update.
 */

import type { PageRow } from "./seoAudit";

const POWER_AR = ["أفضل", "احصل", "اكتشف", "دليل", "مجاني"];

function firstText(blocks: unknown): string {
  try {
    const arr = Array.isArray(blocks) ? blocks : [];
    for (const b of arr) {
      const data = (b as { data?: Record<string, unknown> })?.data ?? {};
      const v =
        (data.heading as string) ||
        (data.title as string) ||
        (data.subtitle as string) ||
        (data.body as string) ||
        "";
      if (v) return String(v).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }
  } catch {
    /* noop */
  }
  return "";
}

export function suggestMetaTitle(row: PageRow): string {
  const base = (row.title || "").trim();
  const power = POWER_AR.find((p) => !base.includes(p)) ?? "";
  const suffix = " | فكرة";
  let out = base;
  if (power && (base + " " + power + suffix).length <= 60) {
    out = `${power} ${base}`;
  }
  if ((out + suffix).length <= 60) out += suffix;
  return out.slice(0, 60);
}

export function suggestMetaDescription(row: PageRow): string {
  const text = firstText(row.blocks) || row.title;
  const cta = " اطلب عرض سعر مجاني الآن.";
  const max = 158;
  let body = text.slice(0, max - cta.length).trim();
  // Avoid cutting in the middle of a word
  const lastSpace = body.lastIndexOf(" ");
  if (lastSpace > 80) body = body.slice(0, lastSpace);
  return (body + cta).slice(0, max);
}

const SITE_ORIGIN = "https://fikradm.lovable.app";

export function suggestCanonical(row: PageRow): string {
  const path = row.slug === "home" ? "" : `/${row.slug}`;
  return `${SITE_ORIGIN}/${row.locale}${path}`;
}

export type SchemaTemplate = Record<string, unknown>;

export function suggestSchema(row: PageRow): SchemaTemplate {
  const url = suggestCanonical(row);
  const base = {
    "@context": "https://schema.org",
    name: row.meta_title || row.title,
    url,
    inLanguage: row.locale === "ar" ? "ar" : "en",
  };
  switch (row.page_type) {
    case "service":
    case "service_sub":
      return {
        ...base,
        "@type": "Service",
        provider: { "@type": "Organization", name: "فكرة" },
        areaServed: ["SA", "AE", "EG"],
        description: row.meta_description ?? "",
      };
    case "industry":
    case "industry_sub":
      return { ...base, "@type": "WebPage", about: row.title };
    case "location":
      return {
        ...base,
        "@type": "LocalBusiness",
        address: { "@type": "PostalAddress", addressCountry: "SA" },
      };
    case "case_studies":
      return { ...base, "@type": "CollectionPage" };
    case "about":
    case "contact":
    case "home":
    default:
      return { ...base, "@type": "WebPage" };
  }
}

export type FixId =
  | "meta_title"
  | "meta_description"
  | "canonical"
  | "schema"
  | "noindex_off"
  | "noindex_on";

export type SuggestedFix = {
  id: FixId;
  field: keyof PageRow | "no_index";
  current: unknown;
  suggested: unknown;
  label: string;
};

export function buildFixes(row: PageRow): SuggestedFix[] {
  const fixes: SuggestedFix[] = [];
  const t = (row.meta_title ?? "").trim();
  if (!t || t.length < 30 || t.length > 60) {
    fixes.push({
      id: "meta_title",
      field: "meta_title",
      current: row.meta_title,
      suggested: suggestMetaTitle(row),
      label: "توليد Meta Title بطول مثالي",
    });
  }
  const d = (row.meta_description ?? "").trim();
  if (!d || d.length < 70 || d.length > 160) {
    fixes.push({
      id: "meta_description",
      field: "meta_description",
      current: row.meta_description,
      suggested: suggestMetaDescription(row),
      label: "توليد Meta Description مع CTA",
    });
  }
  if (!row.canonical_url) {
    fixes.push({
      id: "canonical",
      field: "canonical_url",
      current: row.canonical_url,
      suggested: suggestCanonical(row),
      label: "ضبط Canonical URL تلقائياً",
    });
  }
  const hasSchema = !!row.json_ld && Object.keys((row.json_ld as object) ?? {}).length > 0;
  if (!hasSchema) {
    fixes.push({
      id: "schema",
      field: "json_ld",
      current: row.json_ld,
      suggested: suggestSchema(row),
      label: `إضافة Schema (${row.page_type})`,
    });
  }
  if (row.no_index && row.status === "published") {
    fixes.push({
      id: "noindex_off",
      field: "no_index",
      current: true,
      suggested: false,
      label: "إزالة noindex (الصفحة منشورة)",
    });
  }
  return fixes;
}
