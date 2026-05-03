/**
 * Validates Article + FAQ Schema.org completeness for a blog post.
 * Returns a list of warnings/errors that admins can act on.
 */

export type SchemaIssue = {
  level: "error" | "warning" | "info";
  field: string;
  message: string;
};

export type ValidatablePost = {
  slug: string;
  title_ar?: string;
  title_en?: string;
  meta_title_ar?: string;
  meta_title_en?: string;
  meta_description_ar?: string;
  meta_description_en?: string;
  cover_image_url?: string | null;
  author_ar?: string;
  author_en?: string;
  published_at?: string | null;
  last_reviewed?: string | null;
  tldr_ar?: string[];
  tldr_en?: string[];
  faq?: { q: string; a: string }[];
  author_bio_ar?: string;
  author_bio_en?: string;
  sources?: { url: string }[];
  keywords_ar?: string[];
  keywords_en?: string[];
};

export function validatePostSchema(p: ValidatablePost): SchemaIssue[] {
  const issues: SchemaIssue[] = [];
  const req = (cond: boolean, field: string, message: string) => {
    if (!cond) issues.push({ level: "error", field, message });
  };
  const warn = (cond: boolean, field: string, message: string) => {
    if (!cond) issues.push({ level: "warning", field, message });
  };

  // Article schema essentials
  req(!!p.title_ar && !!p.title_en, "title", "العنوان مطلوب باللغتين (Article.headline)");
  req(!!p.meta_description_ar && !!p.meta_description_en, "meta_description", "الوصف Meta مطلوب باللغتين (Article.description)");
  req(!!p.cover_image_url, "cover_image_url", "صورة الغلاف مطلوبة لـ Article.image");
  req(!!p.author_ar && !!p.author_en, "author", "اسم الكاتب مطلوب (Article.author)");
  req(!!p.published_at, "published_at", "تاريخ النشر مطلوب (Article.datePublished)");

  // EEAT recommended
  warn(!!p.last_reviewed, "last_reviewed", "أضف تاريخ آخر مراجعة لرفع EEAT (Article.dateModified)");
  warn(!!(p.author_bio_ar && p.author_bio_en), "author_bio", "أضف نبذة الكاتب لتعزيز EEAT (author.description)");
  warn((p.tldr_ar?.length ?? 0) >= 3 && (p.tldr_en?.length ?? 0) >= 3, "tldr", "أضف 3+ نقاط TL;DR لـ AEO/AIO");
  warn((p.sources?.length ?? 0) > 0, "sources", "أضف مرجعًا واحدًا على الأقل (Article.citation)");

  // FAQ schema
  const faqCount = p.faq?.length ?? 0;
  if (faqCount > 0) {
    const incomplete = p.faq!.some((f) => !f.q?.trim() || !f.a?.trim());
    if (incomplete) {
      issues.push({ level: "error", field: "faq", message: "بعض أسئلة FAQ ناقصة (سؤال أو إجابة فارغة)" });
    }
    if (faqCount < 3) {
      issues.push({ level: "warning", field: "faq", message: `FAQ يحتاج 3+ أسئلة لتحسين Rich Results (الحالي: ${faqCount})` });
    }
  } else {
    issues.push({ level: "info", field: "faq", message: "لا يوجد FAQ — سيُولّد تلقائيًا من TL;DR إن وجد" });
  }

  // SEO length checks
  const mtAr = (p.meta_title_ar ?? p.title_ar ?? "").length;
  const mtEn = (p.meta_title_en ?? p.title_en ?? "").length;
  if (mtAr > 60) issues.push({ level: "warning", field: "meta_title_ar", message: `Meta Title (AR) طويل: ${mtAr}/60` });
  if (mtEn > 60) issues.push({ level: "warning", field: "meta_title_en", message: `Meta Title (EN) طويل: ${mtEn}/60` });
  const mdAr = (p.meta_description_ar ?? "").length;
  const mdEn = (p.meta_description_en ?? "").length;
  if (mdAr > 0 && (mdAr < 70 || mdAr > 160)) issues.push({ level: "warning", field: "meta_description_ar", message: `Meta Description (AR) خارج 70-160: ${mdAr}` });
  if (mdEn > 0 && (mdEn < 70 || mdEn > 160)) issues.push({ level: "warning", field: "meta_description_en", message: `Meta Description (EN) خارج 70-160: ${mdEn}` });

  return issues;
}

export function summarizeIssues(issues: SchemaIssue[]) {
  return {
    errors: issues.filter((i) => i.level === "error").length,
    warnings: issues.filter((i) => i.level === "warning").length,
    infos: issues.filter((i) => i.level === "info").length,
  };
}