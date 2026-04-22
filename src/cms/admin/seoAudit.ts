import { supabase } from "@/integrations/supabase/client";

export type AuditLevel = "good" | "warn" | "bad";
export type AuditCheck = { id: string; label: string; level: AuditLevel; hint?: string };
export type PageAudit = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  page_type: string;
  url: string;
  score: number;
  checks: AuditCheck[];
  ctrSignal: AuditLevel; // High CTR friendliness (title power, desc CTA, schema)
};

const SITE_ORIGIN = "https://fikradm.lovable.app";

const POWER_WORDS_AR = ["أفضل", "مجاني", "حصري", "جديد", "سريع", "أرخص", "خصم", "مضمون", "احصل", "اكتشف"];
const POWER_WORDS_EN = ["best", "free", "exclusive", "new", "fast", "cheapest", "guaranteed", "get", "discover", "save"];

function lvl(arr: AuditLevel[]): AuditLevel {
  if (arr.includes("bad")) return "bad";
  if (arr.includes("warn")) return "warn";
  return "good";
}

function score(checks: AuditCheck[]): number {
  if (!checks.length) return 0;
  const totals = checks.reduce(
    (s, c) => s + (c.level === "good" ? 1 : c.level === "warn" ? 0.5 : 0),
    0,
  );
  return Math.round((totals / checks.length) * 100);
}

export type PageRow = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  page_type: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  keywords: string[] | null;
  no_index: boolean;
  json_ld: unknown;
  blocks: unknown;
};

export function auditPage(row: PageRow): PageAudit {
  const url = `${SITE_ORIGIN}/${row.locale}${row.slug === "home" ? "" : `/${row.slug}`}`;
  const checks: AuditCheck[] = [];
  const title = (row.meta_title ?? "").trim();
  const desc = (row.meta_description ?? "").trim();

  // Title
  checks.push({
    id: "title_present",
    label: "وجود Meta Title",
    level: title ? "good" : "bad",
  });
  checks.push({
    id: "title_length",
    label: `طول Title (${title.length})`,
    level: title.length === 0 ? "bad" : title.length < 30 || title.length > 60 ? "warn" : "good",
    hint: "30-60 حرف",
  });

  // Description
  checks.push({
    id: "desc_present",
    label: "وجود Meta Description",
    level: desc ? "good" : "bad",
  });
  checks.push({
    id: "desc_length",
    label: `طول Description (${desc.length})`,
    level: desc.length === 0 ? "bad" : desc.length < 70 || desc.length > 160 ? "warn" : "good",
    hint: "70-160 حرف",
  });

  // Slug
  const slugOk = /^[a-z0-9/-]+$/.test(row.slug || "") || row.slug === "home";
  checks.push({ id: "slug", label: "Slug نظيف", level: slugOk ? "good" : "warn" });

  // Canonical
  checks.push({
    id: "canonical",
    label: "Canonical URL",
    level: row.canonical_url ? "good" : "warn",
    hint: "اتركه فارغاً يستخدم الافتراضي",
  });

  // Robots / no-index
  checks.push({
    id: "robots",
    label: row.no_index ? "محظور من الفهرسة" : "قابل للفهرسة",
    level: row.no_index ? (row.status === "published" ? "warn" : "good") : "good",
    hint: row.no_index ? "noindex" : undefined,
  });

  // OG image (Schema/social coverage)
  checks.push({
    id: "og_image",
    label: "صورة OG/Twitter",
    level: row.og_image_url ? "good" : "warn",
    hint: "1200×630",
  });

  // Keywords
  checks.push({
    id: "keywords",
    label: `كلمات مفتاحية (${row.keywords?.length ?? 0})`,
    level: row.keywords && row.keywords.length > 0 ? "good" : "warn",
  });

  // Internal links inside blocks
  const blocksStr = JSON.stringify(row.blocks ?? []);
  const internalLinks = (blocksStr.match(/"href"\s*:\s*"\/(?!http)/g) ?? []).length;
  checks.push({
    id: "internal_links",
    label: `روابط داخلية (${internalLinks})`,
    level: internalLinks >= 2 ? "good" : internalLinks === 1 ? "warn" : "bad",
    hint: "≥2 رابط داخلي",
  });

  // Schema coverage
  const hasSchema = !!row.json_ld && Object.keys(row.json_ld as object).length > 0;
  checks.push({
    id: "schema",
    label: "JSON-LD Schema",
    level: hasSchema ? "good" : "warn",
    hint: row.page_type ? `نوع: ${row.page_type}` : undefined,
  });

  // High CTR signal: power word in title + description has CTA-ish verb
  const titleLower = title.toLowerCase();
  const hasPower =
    POWER_WORDS_AR.some((w) => title.includes(w)) ||
    POWER_WORDS_EN.some((w) => titleLower.includes(w));
  const hasCta = /(احصل|اطلب|تواصل|ابدأ|سجل|get|start|try|learn|discover|book)/i.test(desc);
  checks.push({
    id: "ctr_power",
    label: hasPower ? "الـ Title يحتوي كلمة جذب" : "أضف كلمة جذب للـ Title",
    level: hasPower ? "good" : "warn",
    hint: "أمثلة: أفضل، مجاني، احصل، best, free…",
  });
  checks.push({
    id: "ctr_cta",
    label: hasCta ? "الـ Description بها CTA" : "أضف CTA في الـ Description",
    level: hasCta ? "good" : "warn",
  });

  const ctrSignal = lvl([
    hasPower ? "good" : "warn",
    hasCta ? "good" : "warn",
    hasSchema ? "good" : "warn",
  ]);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    locale: row.locale,
    status: row.status,
    page_type: row.page_type,
    url,
    score: score(checks),
    checks,
    ctrSignal,
  };
}

export async function loadPageAudits(): Promise<PageAudit[]> {
  const { data, error } = await supabase
    .from("pages")
    .select(
      "id, title, slug, locale, status, page_type, meta_title, meta_description, og_image_url, canonical_url, keywords, no_index, json_ld, blocks",
    )
    .order("title");
  if (error) throw error;
  return ((data ?? []) as unknown as PageRow[]).map(auditPage);
}