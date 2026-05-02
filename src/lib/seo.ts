/**
 * Shared SEO helpers for building consistent <head> meta + JSON-LD across routes.
 * Centralizes site origin, OG/Twitter defaults, and structured data generators.
 */

export const SITE_ORIGIN = "https://fikradm.lovable.app";
export const SITE_NAME = "Fikra Digital Marketing";
export const SITE_NAME_AR = "فكرة للتسويق الرقمي";
export const TWITTER_HANDLE = "@FikraDM";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-cover.jpg`;

export type Locale = "ar" | "en";

export type SeoMetaInput = {
  title: string;
  description: string;
  path: string; // e.g. "/about" or "/ar/services"
  locale?: Locale;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function absUrl(path: string): string {
  if (!path) return SITE_ORIGIN;
  if (path.startsWith("http")) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build a comprehensive meta tag set covering basic SEO + OG + Twitter cards.
 * Returns an array compatible with TanStack Router head().meta.
 */
export function buildSeoMeta(input: SeoMetaInput): Array<Record<string, string>> {
  const locale: Locale = input.locale ?? "ar";
  const url = absUrl(input.path);
  const image = input.image ? absUrl(input.image) : DEFAULT_OG_IMAGE;
  const type = input.type ?? "website";
  const ogLocale = locale === "ar" ? "ar_SA" : "en_US";
  const altLocale = locale === "ar" ? "en_US" : "ar_SA";

  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },

    // Open Graph
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: ogLocale },
    { property: "og:locale:alternate", content: altLocale },
    { property: "og:site_name", content: SITE_NAME },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];

  if (input.publishedTime) {
    meta.push({ property: "article:published_time", content: input.publishedTime });
  }
  if (input.modifiedTime) {
    meta.push({ property: "article:modified_time", content: input.modifiedTime });
  }
  if (input.noIndex) {
    meta.push({ name: "robots", content: "noindex,nofollow" });
  } else {
    meta.push({ name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" });
  }

  return meta;
}

/**
 * Build alternate + canonical link tags for a route.
 */
export function buildSeoLinks(input: { path: string; locale?: Locale; canonical?: string }) {
  const locale: Locale = input.locale ?? "ar";
  // Strip locale prefix from path so we can build alternates.
  const cleanPath = input.path.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
  return [
    { rel: "canonical", href: input.canonical ?? absUrl(`/${locale}${cleanPath === "/" ? "" : cleanPath}`) },
    { rel: "alternate", hrefLang: "ar", href: absUrl(`/ar${cleanPath === "/" ? "" : cleanPath}`) },
    { rel: "alternate", hrefLang: "en", href: absUrl(`/en${cleanPath === "/" ? "" : cleanPath}`) },
    { rel: "alternate", hrefLang: "x-default", href: absUrl(`/ar${cleanPath === "/" ? "" : cleanPath}`) },
  ];
}

/* ---------- JSON-LD generators ---------- */

const ORG_NODE = {
  "@type": "Organization",
  "@id": `${SITE_ORIGIN}#org`,
  name: SITE_NAME,
  alternateName: SITE_NAME_AR,
  url: SITE_ORIGIN,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_ORIGIN}/logo.png`,
    width: 512,
    height: 512,
  },
  sameAs: [
    "https://twitter.com/FikraDM",
    "https://www.linkedin.com/company/fikra-dm",
    "https://www.instagram.com/fikra.dm",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
      availableLanguage: ["ar", "en"],
    },
  ],
};

export function organizationLd() {
  return ORG_NODE;
}

export function localBusinessLd(opts?: { city?: string; country?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_ORIGIN}#localbusiness`,
    name: SITE_NAME,
    image: DEFAULT_OG_IMAGE,
    url: SITE_ORIGIN,
    telephone: "+966-50-000-0000",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: opts?.city ?? "Riyadh",
      addressCountry: opts?.country ?? "SA",
    },
    areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
  };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.url),
    })),
  };
}

export function serviceLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absUrl(opts.url),
    ...(opts.image ? { image: absUrl(opts.image) } : {}),
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    provider: ORG_NODE,
    areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
  };
}

export function articleLd(opts: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(opts.url) },
    ...(opts.image ? { image: absUrl(opts.image) } : { image: DEFAULT_OG_IMAGE }),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    author: opts.authorName
      ? { "@type": "Person", name: opts.authorName }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: ORG_NODE,
  };
}

export function faqLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

/**
 * Wrap a JSON-LD object as a TanStack head() scripts entry.
 */
export function jsonLdScript(value: unknown) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(value),
  };
}