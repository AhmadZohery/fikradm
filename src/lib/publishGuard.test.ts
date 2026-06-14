import { describe, it, expect } from "vitest";
import { evaluatePublishGuard } from "./publishGuard";

const basePost = {
  slug: "demo-post",
  title_ar: "عنوان تجريبي عن التسويق الرقمي وأثره",
  title_en: "A demo article about digital marketing impact",
  meta_title_ar: "عنوان ميتا تجريبي للمقال",
  meta_title_en: "Demo meta title for the article",
  meta_description_ar: "وصف ميتا تجريبي طوله بين سبعين ومائة وستين حرفًا لاختبار قواعد السيو الأساسية للمقال.",
  meta_description_en: "A demo meta description with a length between seventy and one hundred sixty characters for SEO basics.",
  cover_image_url: "https://example.com/cover.jpg",
  author_ar: "كاتب تجريبي",
  author_en: "Demo Author",
  published_at: new Date().toISOString(),
  last_reviewed: new Date().toISOString(),
  author_bio_ar: "نبذة عن الكاتب",
  author_bio_en: "About the author",
  faq: [
    { q: "س1؟", a: "ج1" },
    { q: "س2؟", a: "ج2" },
    { q: "س3؟", a: "ج3" },
  ],
  sources: [{ url: "https://example.com/ref" }],
  body_html_ar: "<p>محتوى قصير وسهل القراءة عن التسويق. جمل قصيرة. واضحة. مفيدة.</p>",
  body_html_en: "<p>Short readable content. Clear sentences. Useful tips.</p>",
  internal_links_count: 3,
};

describe("evaluatePublishGuard", () => {
  it("allows publishing when all required fields are present", () => {
    const r = evaluatePublishGuard(basePost as any);
    expect(r.ok).toBe(true);
    expect(r.blockers).toHaveLength(0);
    expect(r.score).toBeGreaterThanOrEqual(60);
  });

  it("blocks publishing when title is missing", () => {
    const r = evaluatePublishGuard({ ...basePost, title_ar: "", title_en: "" } as any);
    expect(r.ok).toBe(false);
    expect(r.blockers.some((b) => b.field === "title")).toBe(true);
  });

  it("blocks publishing when cover image is missing", () => {
    const r = evaluatePublishGuard({ ...basePost, cover_image_url: null } as any);
    expect(r.ok).toBe(false);
    expect(r.blockers.some((b) => b.field === "cover_image_url")).toBe(true);
  });

  it("blocks publishing when published_at is missing", () => {
    const r = evaluatePublishGuard({ ...basePost, published_at: null } as any);
    expect(r.ok).toBe(false);
    expect(r.blockers.some((b) => b.field === "published_at")).toBe(true);
  });

  it("blocks YMYL content without author bio or sources", () => {
    const r = evaluatePublishGuard({
      ...basePost,
      title_ar: "نصائح طبية حول علاج مرض السكري",
      body_html_ar: "<p>محتوى طبي عن العلاج والدواء والصحة.</p>",
      author_bio_ar: "",
      author_bio_en: "",
      sources: [],
    } as any);
    expect(r.ymyl).toBe(true);
    expect(r.ok).toBe(false);
    expect(r.blockers.some((b) => b.field === "ymyl_author_bio")).toBe(true);
    expect(r.blockers.some((b) => b.field === "ymyl_sources")).toBe(true);
  });

  it("warns on low readability but does not block", () => {
    const longSentence = Array.from({ length: 80 }).map((_, i) => `word${i}`).join(" ");
    const r = evaluatePublishGuard({
      ...basePost,
      body_html_en: `<p>${longSentence}</p>`,
      body_html_ar: `<p>${longSentence}</p>`,
    } as any);
    expect(r.ok).toBe(true);
    expect(r.warnings.some((w) => w.field.startsWith("readability_"))).toBe(true);
  });

  it("warns on schema completeness gaps (no last_reviewed)", () => {
    const r = evaluatePublishGuard({ ...basePost, last_reviewed: null } as any);
    expect(r.warnings.some((w) => w.field === "last_reviewed")).toBe(true);
  });

  it("warns on insufficient FAQ count for AEO", () => {
    const r = evaluatePublishGuard({ ...basePost, faq: [{ q: "س1؟", a: "ج1" }] } as any);
    expect(r.warnings.some((w) => w.field === "faq")).toBe(true);
  });

  it("returns warning when meta description is out of 70-160 range", () => {
    const r = evaluatePublishGuard({
      ...basePost,
      meta_description_en: "too short",
    } as any);
    expect(r.warnings.some((w) => w.field === "meta_description_en")).toBe(true);
  });

  it("score reflects EEAT signals", () => {
    const strong = evaluatePublishGuard(basePost as any);
    const weak = evaluatePublishGuard({
      ...basePost,
      author_bio_ar: "",
      author_bio_en: "",
      sources: [],
      internal_links_count: 0,
      faq: [],
      last_reviewed: null,
    } as any);
    expect(strong.eeat).toBeGreaterThan(weak.eeat);
    expect(strong.score).toBeGreaterThan(weak.score);
  });
});