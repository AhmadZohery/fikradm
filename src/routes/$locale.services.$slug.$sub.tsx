import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PricingPlans } from "@/components/site/PricingPlans";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { findService, findSubService, getSubServicesFor } from "@/content/data";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/$locale/services/$slug/$sub")({
  beforeLoad: ({ params }) => {
    if (!findSubService(params.slug, params.sub)) throw notFound();
  },
  head: ({ params }) => {
    const s = findSubService(params.slug, params.sub);
    if (!s) return { meta: [{ title: "Not found" }] };
    const loc = params.locale === "en" ? "en" : "ar";
    return {
      meta: [
        { title: s.metaTitle[loc] },
        { name: "description", content: s.metaDescription[loc] },
        { property: "og:title", content: s.metaTitle[loc] },
        { property: "og:description", content: s.metaDescription[loc] },
        { property: "og:image", content: s.image },
        { property: "og:type", content: "website" },
        { name: "twitter:image", content: s.image },
      ],
      links: [
        { rel: "canonical", href: `https://fikra-dm.com/${params.locale}/services/${params.slug}/${s.slug}` },
        { rel: "alternate", hrefLang: "ar", href: `https://fikra-dm.com/ar/services/${params.slug}/${s.slug}` },
        { rel: "alternate", hrefLang: "en", href: `https://fikra-dm.com/en/services/${params.slug}/${s.slug}` },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-app section text-center">
        <h1 className="text-3xl font-bold">Not found</h1>
        <Link to="/$locale/services" params={{ locale: "ar" }} className="mt-4 inline-block text-primary">
          العودة للخدمات
        </Link>
      </div>
    </SiteLayout>
  ),
  component: SubServicePage,
});

function SubServicePage() {
  const { slug, sub, locale } = Route.useParams();
  const parent = findService(slug)!;
  const s = findSubService(slug, sub)!;
  const loc = locale === "en" ? "en" : "ar";
  const siblings = getSubServicesFor(slug).filter((x) => x.slug !== sub);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title[loc],
    description: s.metaDescription[loc],
    serviceType: parent.title[loc],
    provider: { "@type": "Organization", name: "Fikra Digital Marketing" },
    offers: s.plans.map((p) => ({
      "@type": "Offer",
      name: p.name[loc],
      price: p.priceSar,
      priceCurrency: "SAR",
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: loc === "ar" ? "خدماتنا" : "Services", item: `https://fikra-dm.com/${locale}/services` },
      { "@type": "ListItem", position: 2, name: parent.title[loc], item: `https://fikra-dm.com/${locale}/services/${slug}` },
      { "@type": "ListItem", position: 3, name: s.title[loc] },
    ],
  };

  return (
    <SiteLayout>
      <Breadcrumbs trail={[
        { label: loc === "ar" ? "خدماتنا" : "Services", href: "/services" },
        { label: parent.title[loc], href: `/services/${slug}` },
        { label: s.shortLabel[loc] },
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-app grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <Link
              to="/$locale/services/$slug"
              params={{ locale, slug }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              {parent.title[loc]}
            </Link>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">{s.title[loc]}</h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">{s.intro[loc]}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {s.highlights[loc].map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{h}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/$locale/contact"
                params={{ locale }}
                className="inline-flex h-11 items-center rounded-full bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
              >
                {loc === "ar" ? "احجز استشارتك المجانية" : "Book a Free Consultation"}
              </Link>
              <a
                href="#pricing"
                className="inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                {loc === "ar" ? "شاهد الباقات" : "View Plans"}
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
            <img src={s.image} alt={s.title[loc]} className="aspect-[4/3] w-full object-cover" loading="eager" />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container-app">
          <h2 className="text-3xl font-extrabold md:text-4xl">{loc === "ar" ? "كيف نعمل" : "How we work"}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {s.process.map((p, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 text-base font-bold">{p.step[loc]}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.detail[loc]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section bg-surface">
        <div className="container-app">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-7">
            <h3 className="text-xl font-bold">{loc === "ar" ? "ماذا تستلم؟" : "What you get"}</h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {s.deliverables[loc].map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div id="pricing">
        <PricingPlans plans={s.plans} />
      </div>

      <FaqSection items={s.faqs} />

      {/* Related sub-services */}
      {siblings.length > 0 && (
        <section className="section">
          <div className="container-app">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold md:text-3xl">
                {loc === "ar" ? "خدمات قد تهمك" : "You may also like"}
              </h2>
              <Link
                to="/$locale/services/$slug"
                params={{ locale, slug }}
                className="hidden text-sm font-semibold text-primary hover:underline sm:inline"
              >
                {loc === "ar" ? `كل خدمات ${parent.title[loc]}` : `All ${parent.title[loc]} services`}
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {siblings.map((x) => (
                <Link
                  key={x.slug}
                  to="/$locale/services/$slug/$sub"
                  params={{ locale, slug, sub: x.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-elegant"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={x.image}
                      alt={x.title[loc]}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold">{x.title[loc]}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{x.intro[loc]}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      {loc === "ar" ? "اعرف المزيد" : "Learn more"}
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </SiteLayout>
  );
}
