import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { useLocale } from "@/i18n/useLocale";
import { CITIES, SERVICES } from "@/content/cities";
import { MapPin } from "lucide-react";
import { buildSeoMeta, buildSeoLinks, jsonLdScript, breadcrumbLd, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/locations/")({
  head: ({ params }) => {
    const loc: "ar" | "en" = (params.locale ?? "ar") === "en" ? "en" : "ar";
    const path = `/${loc}/locations`;
    const title = loc === "ar"
      ? `خدماتنا حسب المدينة | ${SITE_NAME}`
      : `Our Services by City | ${SITE_NAME}`;
    const description = loc === "ar"
      ? "اكتشف خدمات التسويق الرقمي في الرياض، جدة، دبي، أبوظبي، القاهرة، الكويت، والدوحة."
      : "Explore our digital marketing services in Riyadh, Jeddah, Dubai, Abu Dhabi, Cairo, Kuwait, and Doha.";
    return {
      meta: buildSeoMeta({ title, description, path, locale: loc }),
      links: buildSeoLinks({ path, locale: loc }),
      scripts: [
        jsonLdScript(breadcrumbLd([
          { name: loc === "ar" ? "الرئيسية" : "Home", url: `/${loc}` },
          { name: loc === "ar" ? "المواقع" : "Locations", url: path },
        ])),
      ],
    };
  },
  component: LocationsIndex,
});

function LocationsIndex() {
  const { locale, buildHref } = useLocale();
  const loc = locale === "en" ? "en" : "ar";
  const isAr = loc === "ar";

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "المواقع" : "Locations" }]} />
      <section className="section bg-gradient-hero">
        <div className="container-app text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">
            {isAr ? "خدماتنا في كل مدينة" : "Our services, in your city"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {isAr
              ? "صفحات هبوط محلية لكل خدمة في كل مدينة — بياناتك الجغرافية مهمة لمحركات البحث."
              : "Local landing pages per service per city — your geo-context matters for search engines."}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-app space-y-12">
          {CITIES.map((c) => (
            <div key={c.key} className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-extrabold md:text-3xl">
                  <MapPin className="me-2 inline h-5 w-5 text-primary" />
                  {c.name[loc]}
                  <span className="ms-3 text-sm font-medium text-muted-foreground">{c.country[loc]}</span>
                </h2>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-foreground/75">{c.tagline[loc]}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {SERVICES.map((s) => (
                  <Link
                    key={s.key}
                    to={buildHref(locale, `/locations/${c.slug.en}/${s.slug}`)}
                    className="group rounded-xl border border-border bg-background p-4 transition hover:border-primary hover:bg-primary/5"
                  >
                    <div className="text-sm font-bold text-foreground group-hover:text-primary">{s.name[loc]}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </SiteLayout>
  );
}
