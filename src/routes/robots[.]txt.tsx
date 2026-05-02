import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/seo";

const ROBOTS = `# Fikra Digital Marketing — robots.txt
User-agent: *
Allow: /

# Block admin & API surfaces
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /*?*preview=

# Allow main locales explicitly
Allow: /ar/
Allow: /en/

# Crawl-delay for noisy bots (optional, ignored by Google)
Crawl-delay: 1

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(ROBOTS, {
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