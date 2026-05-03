import type { BlogPost } from "@/content/blog";

export type DynamicFaqItem = { q: { ar: string; en: string }; a: { ar: string; en: string } };

/**
 * If a post has no manually authored FAQ, derive a contextual FAQ from
 * its section headings + section summaries + TL;DR. This guarantees every
 * post emits FAQPage schema and shows an FAQ block.
 */
export function getEffectiveFaq(post: BlogPost): { items: { q: BlogPost["title"]; a: BlogPost["title"] }[]; auto: boolean } {
  if (post.faq && post.faq.length > 0) return { items: post.faq, auto: false };

  const items: DynamicFaqItem[] = [];

  // From section summaries — turn heading into question, summary into answer
  for (const section of post.body) {
    if (!section.summary) continue;
    const qAr = ensureQuestion(section.heading.ar, "ar");
    const qEn = ensureQuestion(section.heading.en, "en");
    items.push({
      q: { ar: qAr, en: qEn },
      a: { ar: section.summary.ar, en: section.summary.en },
    });
    if (items.length >= 6) break;
  }

  // Top up from TL;DR if needed
  if (items.length < 4 && post.tldr) {
    const arPts = post.tldr.ar;
    const enPts = post.tldr.en;
    const need = Math.min(4 - items.length, arPts.length, enPts.length);
    for (let i = 0; i < need; i++) {
      items.push({
        q: {
          ar: `نقطة سريعة #${items.length + 1}؟`,
          en: `Quick takeaway #${items.length + 1}?`,
        },
        a: { ar: arPts[i], en: enPts[i] },
      });
    }
  }

  return { items, auto: items.length > 0 };
}

function ensureQuestion(heading: string, lang: "ar" | "en"): string {
  const h = heading.trim();
  if (!h) return h;
  const last = h.slice(-1);
  if (last === "؟" || last === "?") return h;
  return lang === "ar" ? `${h}؟` : `${h}?`;
}