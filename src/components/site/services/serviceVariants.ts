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

/**
 * All services share the unified violet brand identity.
 * Differences come from the LAYOUT (hero variant + huge word + content presentation),
 * NOT from accent color. This keeps the brand consistent across the entire site.
 */
export const SERVICE_VARIANTS: Record<string, ServiceVariant> = {
  seo: {
    accent: "violet",
    hero: "data",
    hugeWord: { ar: "سيو", en: "SEO" },
    decoration: "metrics",
  },
  performance: {
    accent: "violet",
    hero: "funnel",
    hugeWord: { ar: "أداء", en: "ADS" },
    decoration: "pulse",
  },
  creative: {
    accent: "violet",
    hero: "gallery",
    hugeWord: { ar: "إبداع", en: "CREATIVE" },
    decoration: "swatches",
  },
  web: {
    accent: "violet",
    hero: "code",
    hugeWord: { ar: "تطوير", en: "WEB" },
    decoration: "terminal",
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
