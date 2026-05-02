import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/useLocale";
import { CheckCircle2, MapPin, Phone, ArrowRight, Sparkles } from "lucide-react";
import { findCity, findService, CITIES, SERVICES } from "@/content/cities";
import {
  buildSeoMeta,
  buildSeoLinks,
  jsonLdScript,
  breadcrumbLd,
  serviceLd,
  SITE_ORIGIN,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  absUrl,
} from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/locations/$city/$service")({
  beforeLoad: ({ params }) => {
    if (!findCity(params.city) || !findService(params.service)) throw notFound();
  },
  head: ({ params }) => {
    const city = findCity(params.city);
    const service = findService(params.service);
    if (!city || !service) return { meta: [{ title: "Not found" }] };
    const loc: "ar" | "en" = (params.locale ?? "ar") === "en" ? "en" : "ar";
    const path = `/${loc}/locations/${city.slug.en}/${service.slug}`;

    const title =
      loc === "ar"
        ? `${service.name.ar} في ${city.name.ar} | ${SITE_NAME}`
        : `${service.name.en} in ${city.name.en} | ${SITE_NAME}`;
    const description =
      loc === "ar"
        ? `وكالة ${service.name.ar} في ${city.name.ar}: ${service.shortDesc.ar} ✓ استشارة مجانية ✓ نتائج خلال 90 يوم.`
        : `${service.name.en} agency in ${city.name.en}: ${service.shortDesc.en} ✓ Free consultation ✓ Results in 90 days.`;

    const localBusinessNode = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_ORIGIN}${path}#localbusiness`,
      name: loc === "ar"
        ? `${SITE_NAME} — ${service.name.ar} في ${city.name.ar}`
        : `${SITE_NAME} — ${service.name.en} in ${city.name.en}`,
      image: DEFAULT_OG_IMAGE,
      url: absUrl(path),
      telephone: city.phone,
      priceRange: "$$",
      currenciesAccepted: city.currency,
      address: {
        "@type": "PostalAddress",
        addressLocality: city.name.en,
        addressRegion: city.region.en,
        addressCountry: city.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.latitude,
        longitude: city.longitude,
      },
      areaServed: {
        "@type": "City",
        name: city.name.en,
        containedInPlace: { "@type": "Country", name: city.country.en },
      },
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name[loc],
          serviceType: service.serviceType,
        },
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
    };

    const breadcrumbItems = [
      { name: loc === "ar" ? "الرئيسية" : "Home", url: `/${loc}` },
      { name: loc === "ar" ? "المواقع" : "Locations", url: `/${loc}/locations` },
      { name: city.name[loc], url: `/${loc}/locations/${city.slug.en}` },
      { name: service.name[loc], url: path },
    ];

    return {
      meta: buildSeoMeta({ title, description, path, locale: loc }),
      links: buildSeoLinks({ path, locale: loc }),
      scripts: [
        jsonLdScript(localBusinessNode),
        jsonLdScript(
          serviceLd({
            name: service.name[loc],
            description: description,
            url: path,
            serviceType: service.serviceType,
          }),
        ),
        jsonLdScript(breadcrumbLd(breadcrumbItems)),
      ],
    };
  },
  component: CityServicePage,
});

function CityServicePage() {
  const { locale, buildHref } = useLocale();
  const { city: citySlug, service: serviceSlug } = Route.useParams();
  const city = findCity(citySlug)!;
  const service = findService(serviceSlug)!;
  const loc = locale === "en" ? "en" : "ar";
  const isAr = loc === "ar";

  const otherCities = CITIES.filter((c) => c.key !== city.key).slice(0, 6);
  const otherServices = SERVICES.filter((s) => s.key !== service.key);

  return (
    <SiteLayout>
      <Breadcrumbs
        trail={[
          { label: isAr ? "المواقع" : "Locations", href: "/locations" },
          { label: city.name[loc], href: `/locations/${city.slug.en}` },
          { label: service.name[loc] },
        ]}
      />

      {/* Hero */}
      <section className="section bg-gradient-hero">
        <div className="container-app">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <MapPin className="h-3 w-3" /> {city.name[loc]}, {city.country[loc]}
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              {isAr
                ? <>{service.name.ar} في <span className="text-primary">{city.name.ar}</span></>
                : <>{service.name.en} in <span className="text-primary">{city.name.en}</span></>}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{city.tagline[loc]}</p>
            <p className="mt-3 max-w-2xl text-base text-foreground/80">{service.shortDesc[loc]}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={buildHref(locale, "/contact")}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-primary px-7 text-sm font-bold text-primary-foreground shadow-elegant transition hover:scale-105"
              >
                {isAr ? "استشارة مجانية" : "Free Consultation"}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <a
                href={`tel:${city.phone}`}
                dir="ltr"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background px-7 text-sm font-bold text-foreground hover:bg-accent"
              >
                <Phone className="h-4 w-4" /> {city.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container-app">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((b, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:shadow-elegant">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-foreground">{b[loc]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Local market insight */}
      <section className="section bg-surface/40">
        <div className="container-app max-w-3xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
              <Sparkles className="h-3 w-3" /> {isAr ? "رؤية محلية" : "Local insight"}
            </div>
            <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
              {isAr ? `لماذا ${service.name.ar} في ${city.name.ar}؟` : `Why ${service.name.en} in ${city.name.en}?`}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">{city.marketInsight[loc]}</p>
          </Reveal>
        </div>
      </section>

      {/* Cross-links: other services in same city */}
      <section className="section">
        <div className="container-app">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            {isAr ? `خدمات أخرى في ${city.name.ar}` : `Other services in ${city.name.en}`}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherServices.map((s) => (
              <Link
                key={s.key}
                to={buildHref(locale, `/locations/${city.slug.en}/${s.slug}`)}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-elegant"
              >
                <div className="text-sm font-bold text-foreground group-hover:text-primary">{s.name[loc]}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.shortDesc[loc]}</div>
              </Link>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-extrabold md:text-3xl">
            {isAr ? `${service.name.ar} في مدن أخرى` : `${service.name.en} in other cities`}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherCities.map((c) => (
              <Link
                key={c.key}
                to={buildHref(locale, `/locations/${c.slug.en}/${service.slug}`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                <MapPin className="h-3 w-3" /> {c.name[loc]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteLayout>
  );
}
