/**
 * Publish-time quality gate. Aggregates Readability, EEAT/SXO,
 * YMYL, and Schema completeness checks into a single verdict.
 *
 * Returns:
 *  - blockers: must be fixed before publishing (hard fail)
 *  - warnings: should be reviewed but can be force-published
 *  - score:    0-100 overall content quality
 */
import { readabilityScore, scoreEEAT, detectYMYL, type EEATSignals } from "./schemaGen";
import { validatePostSchema, type ValidatablePost } from "./schemaValidator";

export type GuardIssue = { level: "error" | "warning"; field: string; message: string };
export type GuardResult = {
  ok: boolean;
  score: number;
  blockers: GuardIssue[];
  warnings: GuardIssue[];
  readability: { ar: number; en: number };
  eeat: number;
  ymyl: boolean;
};

export type GuardInput = ValidatablePost & {
  body_html_ar?: string;
  body_html_en?: string;
  body_text_ar?: string;
  body_text_en?: string;
  internal_links_count?: number;
};

const MIN_READABILITY = 40;
const MIN_EEAT = 50;

function stripHtml(s?: string) {
  return (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function evaluatePublishGuard(p: GuardInput): GuardResult {
  const blockers: GuardIssue[] = [];
  const warnings: GuardIssue[] = [];

  const textAr = p.body_text_ar ?? stripHtml(p.body_html_ar);
  const textEn = p.body_text_en ?? stripHtml(p.body_html_en);

  // 1) Schema completeness
  const schemaIssues = validatePostSchema(p);
  for (const it of schemaIssues) {
    if (it.level === "error") blockers.push({ level: "error", field: it.field, message: it.message });
    else if (it.level === "warning") warnings.push({ level: "warning", field: it.field, message: it.message });
  }

  // 2) Readability
  const rAr = textAr ? readabilityScore(textAr).score : 0;
  const rEn = textEn ? readabilityScore(textEn).score : 0;
  if (textAr && rAr < MIN_READABILITY) warnings.push({ level: "warning", field: "readability_ar", message: `قابلية القراءة (AR) منخفضة: ${rAr}/100 (الحد ${MIN_READABILITY})` });
  if (textEn && rEn < MIN_READABILITY) warnings.push({ level: "warning", field: "readability_en", message: `Readability (EN) low: ${rEn}/100 (min ${MIN_READABILITY})` });

  // 3) EEAT / SXO signals
  const eeatSignals: EEATSignals = {
    hasAuthor: !!(p.author_ar || p.author_en),
    hasAuthorBio: !!(p.author_bio_ar || p.author_bio_en),
    hasLastReviewed: !!p.last_reviewed,
    hasSources: (p.sources?.length ?? 0) > 0,
    hasInternalLinks: (p.internal_links_count ?? 0) > 0,
    hasFaq: (p.faq?.length ?? 0) >= 3,
  };
  const eeat = scoreEEAT(eeatSignals);
  if (eeat < MIN_EEAT) warnings.push({ level: "warning", field: "eeat", message: `EEAT score ${eeat}/100 — أضف bio/مصادر/FAQ/تاريخ مراجعة` });

  // 4) YMYL — block publish without author bio + sources
  const ymyl = detectYMYL(`${textAr} ${textEn} ${p.title_ar ?? ""} ${p.title_en ?? ""}`);
  if (ymyl) {
    if (!eeatSignals.hasAuthorBio) blockers.push({ level: "error", field: "ymyl_author_bio", message: "محتوى YMYL: نبذة الكاتب إلزامية" });
    if (!eeatSignals.hasSources) blockers.push({ level: "error", field: "ymyl_sources", message: "محتوى YMYL: مرجع موثوق واحد على الأقل" });
    if (!eeatSignals.hasLastReviewed) warnings.push({ level: "warning", field: "ymyl_last_reviewed", message: "محتوى YMYL: يفضّل وجود تاريخ آخر مراجعة" });
  }

  // Composite score
  const readabilityAvg = textAr && textEn ? (rAr + rEn) / 2 : rAr || rEn || 60;
  const schemaCompleteness = Math.max(0, 100 - schemaIssues.filter((i) => i.level !== "info").length * 10);
  const score = Math.round(readabilityAvg * 0.3 + eeat * 0.35 + schemaCompleteness * 0.35);

  return {
    ok: blockers.length === 0,
    score,
    blockers,
    warnings,
    readability: { ar: rAr, en: rEn },
    eeat,
    ymyl,
  };
}

/** Friendly summary for toast/UI. */
export function summarizeGuard(r: GuardResult): string {
  if (r.ok && r.warnings.length === 0) return `جاهز للنشر — جودة ${r.score}/100`;
  if (r.ok) return `يمكن النشر مع ${r.warnings.length} تحذير — جودة ${r.score}/100`;
  return `لا يمكن النشر: ${r.blockers.length} عناصر إلزامية ناقصة`;
}