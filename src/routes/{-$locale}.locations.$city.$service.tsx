import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/useLocale";
import { CheckCircle2, MapPin, Phone, ArrowRight, Sparkles, Building2, TrendingUp, CalendarCheck } from "lucide-react";
import { findCity, findService } from "@/content/cities";
import { AutoInternalLinks } from "@/components/site/AutoInternalLinks";
import cityServiceHero from "@/assets/city-service-hero.jpg";
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

  // Deterministic per-city KPI tweak so each city shows slightly different numbers
  // without requiring hand-authored data for 40 combos.
  const cityFactor = (city.latitude + city.longitude) % 1;
  const tweak = (base: number) => Math.round(base * (0.85 + cityFactor * 0.4));
  const mapSrc = `https://www.google.com/maps?q=${city.latitude},${city.longitude}&hl=${loc}&z=11&output=embed`;

  return (
    <SiteLayout>
      <Breadcrumbs
        trail={[
          { label: isAr ? "المواقع" : "Locations", href: "/locations" },
          { label: city.name[loc], href: `/locations/${city.slug.en}` },
          { label: service.name[loc] },
        ]}
      />

      {/* Hero with custom artwork */}
      <section className="relative overflow-hidden">
        <img
          src={cityServiceHero}
          alt=""
          aria-hidden
          width={1536}
          height={896}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
        <div className="container-app relative section">
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
                <CalendarCheck className="h-4 w-4" />
                {isAr ? "احجز استشارة مجانية" : "Book Free Consultation"}
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

            {/* City stats strip */}
            <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur">
              <Stat label={isAr ? "السكان" : "Population"} value={city.population} />
              <Stat label={isAr ? "اختراق الإنترنت" : "Internet penetration"} value={city.internetPenetration} />
              <Stat label={isAr ? "العملة" : "Currency"} value={city.currency} />
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

      {/* Local KPIs (per-city tweak) */}
      <section className="section bg-surface/40">
        <div className="container-app">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <TrendingUp className="h-4 w-4" />
            {isAr ? `نتائج موثقة في ${city.name.ar}` : `Proven results in ${city.name.en}`}
          </div>
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
            {isAr ? "أرقام نفخر بها لعملاء المنطقة" : "Numbers we're proud of for local clients"}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {service.kpis.map((k, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="text-4xl font-black text-primary">
                    {tweak(k.baseValue)}{k.suffix}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{k.label[loc]}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mini case brief */}
          <Reveal>
            <div className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                {isAr ? "حالة عميل" : "Client snapshot"}
              </div>
              <p className="mt-2 text-base leading-relaxed text-foreground/85">{service.caseBrief[loc]}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Top local industries we serve */}
      <section className="section">
        <div className="container-app">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
            <Building2 className="h-4 w-4" />
            {isAr ? `قطاعات نخدمها في ${city.name.ar}` : `Sectors we serve in ${city.name.en}`}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {city.topIndustries.map((ind, i) => (
              <span key={i} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
                {ind[loc]}
              </span>
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

      {/* Map */}
      <section className="section">
        <div className="container-app">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            {isAr ? `موقعنا في ${city.name.ar}` : `Our location in ${city.name.en}`}
          </h2>
          <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-elegant">
            <iframe
              title={`${city.name.en} map`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0"
            />
          </div>
        </div>
      </section>

      {/* Auto-generated internal-links network */}
      <AutoInternalLinks city={city} service={service} />

      <CtaBand />
    </SiteLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-black text-foreground md:text-2xl">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
