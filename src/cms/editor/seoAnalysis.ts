/**
 * Lightweight on-page SEO scorer. Inputs are the editable SEO fields plus
 * the focus keyword. Returns a 0-100 score plus actionable checks.
 */

export type SeoFields = {
  meta_title: string;
  meta_description: string;
  slug: string;
  focus_keyword: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  no_index?: boolean;
};

export type SeoCheck = {
  id: string;
  label: string;
  status: "good" | "warn" | "bad";
  hint?: string;
};

export type SeoReport = {
  score: number;
  checks: SeoCheck[];
};

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

function includesCi(haystack: string, needle: string) {
  if (!needle) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function analyzeSeo(f: SeoFields): SeoReport {
  const checks: SeoCheck[] = [];
  const kw = (f.focus_keyword || "").trim();

  // Title length
  const tlen = (f.meta_title || "").length;
  checks.push({
    id: "title_length",
    label: `طول الـ Title (${tlen})`,
    status: tlen === 0 ? "bad" : tlen < TITLE_MIN ? "warn" : tlen > TITLE_MAX ? "warn" : "good",
    hint: `${TITLE_MIN}–${TITLE_MAX} حرف`,
  });

  // Description length
  const dlen = (f.meta_description || "").length;
  checks.push({
    id: "desc_length",
    label: `طول الـ Description (${dlen})`,
    status: dlen === 0 ? "bad" : dlen < DESC_MIN ? "warn" : dlen > DESC_MAX ? "warn" : "good",
    hint: `${DESC_MIN}–${DESC_MAX} حرف`,
  });

  // Slug
  const slugOk = /^[a-z0-9-]+$/.test(f.slug || "");
  checks.push({
    id: "slug",
    label: "الـ Slug نظيف",
    status: !f.slug ? "bad" : slugOk ? "good" : "warn",
    hint: "حروف صغيرة وأرقام وشَرْطَة فقط",
  });

  // Focus keyword presence
  if (kw) {
    checks.push({
      id: "kw_in_title",
      label: "الكلمة المفتاحية في الـ Title",
      status: includesCi(f.meta_title || "", kw) ? "good" : "warn",
    });
    checks.push({
      id: "kw_in_desc",
      label: "الكلمة المفتاحية في الـ Description",
      status: includesCi(f.meta_description || "", kw) ? "good" : "warn",
    });
    checks.push({
      id: "kw_in_slug",
      label: "الكلمة المفتاحية في الـ URL",
      status: includesCi(f.slug || "", kw.replace(/\s+/g, "-")) ? "good" : "warn",
    });
  } else {
    checks.push({
      id: "kw_missing",
      label: "حدد كلمة مفتاحية أساسية",
      status: "warn",
    });
  }

  // OG image
  checks.push({
    id: "og_image",
    label: "صورة OG للمشاركة الاجتماعية",
    status: f.og_image_url ? "good" : "warn",
    hint: "1200×630 يفضل",
  });

  // Indexing warning
  if (f.no_index) {
    checks.push({
      id: "noindex",
      label: "الصفحة محظورة من الفهرسة (noindex)",
      status: "warn",
      hint: "محركات البحث مش هتعرضها",
    });
  }

  // Score: good=1, warn=0.5, bad=0
  const totals = checks.reduce((s, c) => s + (c.status === "good" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
  const score = Math.round((totals / checks.length) * 100);
  return { score, checks };
}
