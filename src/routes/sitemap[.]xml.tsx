import { createFileRoute } from "@tanstack/react-router";
import { services, industries, subServices, subIndustries } from "@/content/data";
import { getAllPostsSorted, blogCategories } from "@/content/blog";
import { CITIES, SERVICES } from "@/content/cities";
import { SITE_ORIGIN } from "@/lib/seo";

const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/industries",
  "/case-studies",
  "/blog",
  "/contact",
  "/team-and-licensing",
  "/locations",
];

type SitemapEntry = {
  path: string; // path WITHOUT locale prefix, e.g. "/about"
  lastmod?: string;
  priority?: number;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
};

function buildEntries(): SitemapEntry[] {
  const today = new Date().toISOString().slice(0, 10);
  const entries: SitemapEntry[] = [];

  for (const path of STATIC_PATHS) {
    entries.push({
      path,
      lastmod: today,
      priority: path === "/" ? 1.0 : 0.8,
      changefreq: path === "/" ? "weekly" : "monthly",
    });
  }

  // Services
  for (const s of services) {
    entries.push({ path: `/services/${s.slug}`, lastmod: today, priority: 0.9, changefreq: "monthly" });
  }
  for (const ss of subServices) {
    entries.push({ path: `/services/${ss.parentSlug}/${ss.slug}`, lastmod: today, priority: 0.7, changefreq: "monthly" });
  }

  // Industries
  for (const i of industries) {
    entries.push({ path: `/industries/${i.slug}`, lastmod: today, priority: 0.8, changefreq: "monthly" });
  }
  for (const si of subIndustries) {
    entries.push({ path: `/industries/${si.parentSlug}/${si.slug}`, lastmod: today, priority: 0.6, changefreq: "monthly" });
  }

  // Locations: city × service combinations
  for (const c of CITIES) {
    for (const s of SERVICES) {
      entries.push({
        path: `/locations/${c.slug.en}/${s.slug}`,
        lastmod: today,
        priority: 0.7,
        changefreq: "monthly",
      });
    }
  }

  // Blog index already in static; categories
  for (const cat of blogCategories) {
    entries.push({ path: `/blog/category/${cat.slug}`, lastmod: today, priority: 0.5, changefreq: "weekly" });
  }

  // Blog posts
  for (const p of getAllPostsSorted()) {
    entries.push({
      path: `/blog/${p.slug}`,
      lastmod: (p.publishedAt || today).slice(0, 10),
      priority: 0.7,
      changefreq: "monthly",
    });
  }

  return entries;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;");
}

function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries.map((e) => {
    const arUrl = `${SITE_ORIGIN}/ar${e.path === "/" ? "" : e.path}`;
    const enUrl = `${SITE_ORIGIN}/en${e.path === "/" ? "" : e.path}`;
    // Emit one <url> per locale, with full hreflang alternates so Google
    // understands the language pair without duplicate content.
    return [arUrl, enUrl]
      .map(
        (loc) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${e.lastmod ?? new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${e.changefreq ?? "monthly"}</changefreq>
    <priority>${(e.priority ?? 0.5).toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(arUrl)}"/>
  </url>`,
      )
      .join("\n");
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = buildSitemapXml(buildEntries());
        return new Response(xml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});