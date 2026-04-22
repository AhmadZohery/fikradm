/**
 * Auto-generates JSON-LD schema based on page type. Admins can override the
 * generated value, but a sensible default is always offered to maximise SEO.
 */

export type JsonLdPageType =
  | "home"
  | "about"
  | "contact"
  | "service"
  | "service_sub"
  | "industry"
  | "industry_sub"
  | "location"
  | "case_studies"
  | "blog"
  | "blog_post"
  | "custom";

export type JsonLdContext = {
  pageType: JsonLdPageType;
  url: string;
  title: string;
  description: string;
  image?: string;
  locale?: string;
  siteName?: string;
  organization?: {
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
  };
};

const DEFAULT_ORG: { name: string; url: string; logo?: string; sameAs?: string[] } = {
  name: "فكرة",
  url: "https://fikradm.lovable.app",
  logo: "https://fikradm.lovable.app/logo.png",
};

export function generateJsonLd(ctx: JsonLdContext): Record<string, unknown> {
  const org = ctx.organization ?? DEFAULT_ORG;
  const inLanguage = ctx.locale === "en" ? "en" : "ar";
  const base = {
    "@context": "https://schema.org",
    inLanguage,
    url: ctx.url,
    name: ctx.title,
    description: ctx.description,
    ...(ctx.image ? { image: ctx.image } : {}),
  };

  switch (ctx.pageType) {
    case "home":
      return {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${org.url}#org`,
            name: org.name,
            url: org.url,
            ...(org.logo ? { logo: org.logo } : {}),
            ...(org.sameAs ? { sameAs: org.sameAs } : {}),
          },
          {
            "@type": "WebSite",
            "@id": `${org.url}#website`,
            url: org.url,
            name: ctx.title || org.name,
            inLanguage,
            publisher: { "@id": `${org.url}#org` },
            potentialAction: {
              "@type": "SearchAction",
              target: `${org.url}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ],
      };
    case "about":
      return { ...base, "@type": "AboutPage" };
    case "contact":
      return { ...base, "@type": "ContactPage" };
    case "service":
    case "service_sub":
      return {
        ...base,
        "@type": "Service",
        provider: { "@type": "Organization", name: org.name, url: org.url },
        areaServed: ["SA", "AE"],
      };
    case "industry":
    case "industry_sub":
      return { ...base, "@type": "CollectionPage" };
    case "location":
      return {
        ...base,
        "@type": "LocalBusiness",
        address: { "@type": "PostalAddress", addressCountry: "SA" },
      };
    case "case_studies":
      return { ...base, "@type": "CollectionPage" };
    case "blog":
      return { ...base, "@type": "Blog", publisher: { "@type": "Organization", name: org.name, url: org.url } };
    case "blog_post":
      return {
        ...base,
        "@type": "BlogPosting",
        headline: ctx.title,
        publisher: {
          "@type": "Organization",
          name: org.name,
          ...(org.logo ? { logo: { "@type": "ImageObject", url: org.logo } } : {}),
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": ctx.url },
      };
    default:
      return { ...base, "@type": "WebPage" };
  }
}

export function safeStringifyJsonLd(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{}";
  }
}

export function safeParseJsonLd(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  if (!text.trim()) return { ok: true, value: null };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "JSON غير صالح" };
  }
}