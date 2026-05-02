import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n/useLocale";
import { CITIES, SERVICES, type City, type ServiceMeta } from "@/content/cities";
import { getAllPostsSorted } from "@/content/blog";
import { Network, ArrowUpRight } from "lucide-react";

/**
 * Context-aware internal-links grid.
 *
 * Given a current city and/or service, produces three groups of relevant links:
 *   1. Other services in the same city
 *   2. The same service in other cities
 *   3. Most relevant blog posts (matched by service keywords)
 *
 * Drop into any service page, city page, or blog post for instant
 * "you may also like" interlinking with descriptive anchor text.
 */
export function AutoInternalLinks(props: {
  city?: City;
  service?: ServiceMeta;
  /** Limit per group. */
  limit?: number;
}) {
  const { city, service, limit = 4 } = props;
  const { locale, buildHref } = useLocale();
  const loc: "ar" | "en" = locale === "en" ? "en" : "ar";
  const isAr = loc === "ar";

  // Group 1: same city, other services
  const sameCityServices: { href: string; anchor: string }[] = city
    ? SERVICES.filter((s) => !service || s.key !== service.key)
        .slice(0, limit)
        .map((s) => ({
          href: `/locations/${city.slug.en}/${s.slug}`,
          anchor: isAr
            ? `${s.name.ar} في ${city.name.ar}`
            : `${s.name.en} in ${city.name.en}`,
        }))
    : [];

  // Group 2: same service, other cities
  const otherCityService: { href: string; anchor: string }[] = service
    ? CITIES.filter((c) => !city || c.key !== city.key)
        .slice(0, limit)
        .map((c) => ({
          href: `/locations/${c.slug.en}/${service.slug}`,
          anchor: isAr
            ? `${service.name.ar} في ${c.name.ar}`
            : `${service.name.en} in ${c.name.en}`,
        }))
    : [];

  // Group 3: blog posts matched by service category mapping
  const serviceToCategory: Record<string, string> = {
    seo: "seo",
    "performance-marketing": "performance",
    creative: "creative",
    "web-development": "web",
    "social-media": "creative",
  };
  const targetCat = service ? serviceToCategory[service.key] : undefined;
  const relevantPosts = getAllPostsSorted()
    .filter((p) => (targetCat ? p.categorySlug === targetCat : true))
    .slice(0, limit)
    .map((p) => ({
      href: `/blog/${p.slug}`,
      anchor: p.title[loc],
    }));

  if (
    sameCityServices.length === 0 &&
    otherCityService.length === 0 &&
    relevantPosts.length === 0
  ) {
    return null;
  }

  return (
    <section className="section">
      <div className="container-app">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Network className="h-4 w-4" />
          {isAr ? "روابط ذات صلة" : "Related links"}
        </div>
        <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
          {isAr ? "اكتشف أكثر — اقرأ، استكشف، تواصل" : "Explore more — read, browse, connect"}
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {sameCityServices.length > 0 && (
            <Group
              title={isAr ? `خدمات أخرى في ${city!.name.ar}` : `Other services in ${city!.name.en}`}
              items={sameCityServices}
              buildHref={(h) => buildHref(locale, h)}
            />
          )}
          {otherCityService.length > 0 && (
            <Group
              title={
                isAr
                  ? `${service!.name.ar} في مدن أخرى`
                  : `${service!.name.en} in other cities`
              }
              items={otherCityService}
              buildHref={(h) => buildHref(locale, h)}
            />
          )}
          {relevantPosts.length > 0 && (
            <Group
              title={isAr ? "من المدونة" : "From the blog"}
              items={relevantPosts}
              buildHref={(h) => buildHref(locale, h)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Group({
  title,
  items,
  buildHref,
}: {
  title: string;
  items: { href: string; anchor: string }[];
  buildHref: (h: string) => string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h3 className="mb-3 text-sm font-bold text-foreground">{title}</h3>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              to={buildHref(it.href)}
              className="group flex items-start justify-between gap-3 rounded-lg px-3 py-2 text-sm text-foreground/80 transition hover:bg-primary/5 hover:text-primary"
            >
              <span className="line-clamp-2">{it.anchor}</span>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
