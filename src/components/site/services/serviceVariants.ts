/**
 * Service variant configuration — accent color, hero style, and signature animation per service.
 * Inspired by Consultio Marketing 2 effects, but each service has its own personality.
 */

export type ServiceVariant = {
  accent: "violet" | "emerald" | "magenta" | "orange" | "cyan" | "purple-hot" | "ocher";
  hero: "data" | "grid" | "funnel" | "code" | "gallery" | "magazine";
  hugeWord: { ar: string; en: string };
  decoration: "metrics" | "phone" | "pulse" | "terminal" | "swatches" | "spread";
};

export const SERVICE_VARIANTS: Record<string, ServiceVariant> = {
  seo: {
    accent: "emerald",
    hero: "data",
    hugeWord: { ar: "سيو", en: "SEO" },
    decoration: "metrics",
  },
  performance: {
    accent: "orange",
    hero: "funnel",
    hugeWord: { ar: "أداء", en: "ADS" },
    decoration: "pulse",
  },
  creative: {
    accent: "purple-hot",
    hero: "gallery",
    hugeWord: { ar: "إبداع", en: "CREATIVE" },
    decoration: "swatches",
  },
  web: {
    accent: "cyan",
    hero: "code",
    hugeWord: { ar: "تطوير", en: "WEB" },
    decoration: "terminal",
  },
  social: {
    accent: "magenta",
    hero: "grid",
    hugeWord: { ar: "سوشيال", en: "SOCIAL" },
    decoration: "phone",
  },
  content: {
    accent: "ocher",
    hero: "magazine",
    hugeWord: { ar: "محتوى", en: "CONTENT" },
    decoration: "spread",
  },
};

export function getServiceVariant(slug: string): ServiceVariant {
  return SERVICE_VARIANTS[slug] ?? {
    accent: "violet",
    hero: "data",
    hugeWord: { ar: "خدمة", en: "SERVICE" },
    decoration: "metrics",
  };
}
