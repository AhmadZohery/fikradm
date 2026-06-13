import { createFileRoute } from "@tanstack/react-router";
import { services, industries } from "@/content/data";
import { getAllPostsSorted } from "@/content/blog";
import { CITIES, SERVICES } from "@/content/cities";
import { SITE_ORIGIN } from "@/lib/seo";

function buildLlmsTxt(): string {
  const lines: string[] = [];
  lines.push("# Fikra Digital Marketing (فكرة للتسويق الرقمي)");
  lines.push("");
  lines.push(
    "> A Saudi digital marketing agency serving the GCC and Egypt — SEO, performance marketing, creative production, and web development. We work with agreed KPIs and transparent recurring reports, not guaranteed outcomes.",
  );
  lines.push("");
  lines.push("Fikra is a bilingual (Arabic / English) agency. Every page is available under `/ar/...` and `/en/...`. The links below default to Arabic — swap `/ar/` for `/en/` for the English version.");
  lines.push("");

  lines.push("## Core pages");
  lines.push(`- [Home](${SITE_ORIGIN}/ar): Overview of services, industries, and results.`);
  lines.push(`- [About](${SITE_ORIGIN}/ar/about): Story, team, and licensing.`);
  lines.push(`- [Services](${SITE_ORIGIN}/ar/services): Full catalogue of marketing services.`);
  lines.push(`- [Industries](${SITE_ORIGIN}/ar/industries): Vertical-specific playbooks.`);
  lines.push(`- [Locations](${SITE_ORIGIN}/ar/locations): City × service landing pages.`);
  lines.push(`- [Case studies](${SITE_ORIGIN}/ar/case-studies): Client results and proof of work.`);
  lines.push(`- [Blog](${SITE_ORIGIN}/ar/blog): Strategy and execution articles.`);
  lines.push(`- [Team & licensing](${SITE_ORIGIN}/ar/team-and-licensing): Credentials.`);
  lines.push(`- [Contact](${SITE_ORIGIN}/ar/contact): Get in touch.`);
  lines.push("");

  lines.push("## Services");
  for (const s of services) {
    lines.push(`- [${s.title.en}](${SITE_ORIGIN}/ar/services/${s.slug}): ${s.metaDescription.en}`);
  }
  lines.push("");

  lines.push("## Industries");
  for (const i of industries) {
    lines.push(`- [${i.title.en}](${SITE_ORIGIN}/ar/industries/${i.slug}): ${i.metaDescription.en}`);
  }
  lines.push("");

  lines.push("## Locations");
  for (const c of CITIES) {
    for (const s of SERVICES) {
      lines.push(`- [${s.name.en} in ${c.name.en}](${SITE_ORIGIN}/ar/locations/${c.slug.en}/${s.slug})`);
    }
  }
  lines.push("");

  lines.push("## Optional");
  const posts = getAllPostsSorted().slice(0, 20);
  for (const p of posts) {
    lines.push(`- [${p.title.en ?? p.title.ar}](${SITE_ORIGIN}/ar/blog/${p.slug})`);
  }
  lines.push("");

  return lines.join("\n");
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(buildLlmsTxt(), {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=86400, s-maxage=86400",
          },
        });
      },
    },
  },
});