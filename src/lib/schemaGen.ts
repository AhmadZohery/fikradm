/**
 * Auto-generate JSON-LD schemas (Organization, Article, Service, BreadcrumbList, FAQPage).
 * Pure functions — safe on client + server. Used by SEOPanel preview and public routes.
 */

const SITE = "https://fikradm.lovable.app";
const ORG_NAME = "Fikra DM";

export type BreadcrumbItem = { name: string; url: string };
export type FaqItem = { q: string; a: string };

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE,
    logo: `${SITE}/logo.png`,
    sameAs: [] as string[],
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE}${it.url}`,
    })),
  };
}

export function articleSchema(o: {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  authorRole?: string;
  datePublished?: string;
  dateModified?: string;
  lastReviewed?: string;
  keywords?: string[];
  ymyl?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": o.ymyl ? "MedicalWebPage" : "Article",
    headline: o.title,
    description: o.description,
    image: o.image ? [o.image] : undefined,
    author: o.author ? { "@type": "Person", name: o.author, jobTitle: o.authorRole } : undefined,
    publisher: { "@type": "Organization", name: ORG_NAME, logo: { "@type": "ImageObject", url: `${SITE}/logo.png` } },
    datePublished: o.datePublished,
    dateModified: o.dateModified || o.datePublished,
    lastReviewed: o.lastReviewed,
    mainEntityOfPage: { "@type": "WebPage", "@id": o.url },
    keywords: o.keywords?.join(", "),
  };
}

export function serviceSchema(o: {
  name: string;
  description: string;
  url: string;
  image?: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: o.name,
    description: o.description,
    url: o.url,
    image: o.image,
    provider: { "@type": "Organization", name: ORG_NAME, url: SITE },
    areaServed: o.areaServed || "Worldwide",
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/* --------- Heuristics for AEO/AIO/EEAT/Readability ---------- */

export function slugify(s: string) {
  return (s || "")
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

/** Flesch-style approximation that works for Arabic + English. */
export function readabilityScore(text: string): { score: number; level: string; words: number; sentences: number } {
  const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = clean ? clean.split(/\s+/).length : 0;
  const sentences = (clean.match(/[.!?؟،]+/g)?.length || 1);
  const avg = words / sentences;
  // Lower avg sentence length => easier. Map 8→90, 30→30.
  const score = Math.max(0, Math.min(100, Math.round(110 - avg * 2.5)));
  const level =
    score >= 80 ? "سهل جداً" : score >= 65 ? "سهل" : score >= 50 ? "متوسط" : score >= 35 ? "صعب" : "صعب جداً";
  return { score, level, words, sentences };
}

export type EEATSignals = {
  hasAuthor: boolean;
  hasAuthorBio: boolean;
  hasLastReviewed: boolean;
  hasSources: boolean;
  hasInternalLinks: boolean;
  hasFaq: boolean;
};

export function scoreEEAT(s: EEATSignals): number {
  const w = [s.hasAuthor, s.hasAuthorBio, s.hasLastReviewed, s.hasSources, s.hasInternalLinks, s.hasFaq];
  return Math.round((w.filter(Boolean).length / w.length) * 100);
}

const YMYL_KEYWORDS = [
  "صحة","علاج","دواء","مرض","مالي","استثمار","قانون","ضرائب","تأمين","قرض",
  "health","medical","finance","invest","legal","tax","loan","insurance","medicine",
];

export function detectYMYL(text: string): boolean {
  const t = (text || "").toLowerCase();
  return YMYL_KEYWORDS.some((k) => t.includes(k));
}