import { services, industries, getSubServicesFor, getSubIndustriesFor } from "@/content/data";
import { blogPosts } from "@/content/blog";
import type { Locale } from "@/i18n/types";

export type SearchHit = {
  type: "service" | "sub-service" | "industry" | "sub-industry" | "blog" | "page";
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
  image?: string;
};

const STATIC_PAGES = (loc: "ar" | "en"): SearchHit[] => {
  const t = loc === "ar"
    ? [
        { title: "الرئيسية", href: "/" },
        { title: "من نحن", href: "/about" },
        { title: "الخدمات", href: "/services" },
        { title: "الصناعات", href: "/industries" },
        { title: "دراسات الحالة", href: "/case-studies" },
        { title: "المدونة", href: "/blog" },
        { title: "تواصل معنا", href: "/contact" },
      ]
    : [
        { title: "Home", href: "/" },
        { title: "About", href: "/about" },
        { title: "Services", href: "/services" },
        { title: "Industries", href: "/industries" },
        { title: "Case Studies", href: "/case-studies" },
        { title: "Blog", href: "/blog" },
        { title: "Contact", href: "/contact" },
      ];
  return t.map((p) => ({
    type: "page" as const,
    title: p.title,
    href: p.href,
    keywords: p.title.toLowerCase(),
  }));
};

export function buildIndex(locale: Locale): SearchHit[] {
  const loc = locale === "en" ? "en" : "ar";
  const hits: SearchHit[] = [];

  for (const svc of services) {
    hits.push({
      type: "service",
      title: svc.title[loc],
      subtitle: svc.intro[loc],
      href: `/services/${svc.slug}`,
      keywords: `${svc.title.ar} ${svc.title.en} ${svc.intro[loc]}`.toLowerCase(),
      image: svc.image,
    });
    for (const sub of getSubServicesFor(svc.slug)) {
      hits.push({
        type: "sub-service",
        title: sub.shortLabel[loc],
        subtitle: `${svc.title[loc]} • ${sub.intro[loc]}`,
        href: `/services/${svc.slug}/${sub.slug}`,
        keywords: `${sub.shortLabel.ar} ${sub.shortLabel.en} ${sub.intro[loc]}`.toLowerCase(),
      });
    }
  }

  for (const ind of industries) {
    hits.push({
      type: "industry",
      title: ind.title[loc],
      subtitle: ind.intro[loc],
      href: `/industries/${ind.slug}`,
      keywords: `${ind.title.ar} ${ind.title.en} ${ind.intro[loc]}`.toLowerCase(),
      image: ind.image,
    });
    for (const sub of getSubIndustriesFor(ind.slug)) {
      hits.push({
        type: "sub-industry",
        title: sub.shortLabel[loc],
        subtitle: `${ind.title[loc]} • ${sub.intro[loc]}`,
        href: `/industries/${ind.slug}/${sub.slug}`,
        keywords: `${sub.shortLabel.ar} ${sub.shortLabel.en} ${sub.intro[loc]}`.toLowerCase(),
      });
    }
  }

  for (const post of blogPosts) {
    hits.push({
      type: "blog",
      title: post.title[loc],
      subtitle: post.excerpt[loc],
      href: `/blog/${post.slug}`,
      keywords: `${post.title.ar} ${post.title.en} ${post.excerpt[loc]} ${(post.keywords[loc] ?? []).join(" ")}`.toLowerCase(),
      image: post.image,
    });
  }

  hits.push(...STATIC_PAGES(loc));
  return hits;
}

export function searchIndex(index: SearchHit[], query: string, limit = 30): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = index
    .map((h) => {
      let score = 0;
      const hay = (h.title + " " + (h.subtitle ?? "") + " " + h.keywords).toLowerCase();
      for (const t of tokens) {
        if (h.title.toLowerCase().includes(t)) score += 5;
        if (hay.includes(t)) score += 2;
      }
      return { h, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.h);
  return scored;
}