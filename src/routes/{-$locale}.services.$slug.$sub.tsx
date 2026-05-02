import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PricingPlans } from "@/components/site/PricingPlans";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { findService, findSubService, getSubServicesFor } from "@/content/data";
import { ServiceVariantHero } from "@/components/site/services/ServiceVariantHero";
import { ServiceMarketSignals } from "@/components/site/services/ServiceMarketSignals";
import { ServiceApproach } from "@/components/site/services/ServiceApproach";
import { ServiceResults } from "@/components/site/services/ServiceResults";
import { ServiceShowcase } from "@/components/site/services/ServiceShowcase";
import { getServiceVariant } from "@/components/site/services/serviceVariants";
import { SectionEyebrow } from "@/components/site/cinematic/SectionEyebrow";
import { Check, ArrowUpRight } from "lucide-react";
import {
  buildSeoMeta,
  buildSeoLinks,
  jsonLdScript,
  breadcrumbLd as breadcrumbLdGen,
  organizationLd,
  absUrl,
} from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/services/$slug/$sub")({
  beforeLoad: ({ params }) => {
    if (!findSubService(params.slug, params.sub)) throw notFound();
  },
  head: ({ params }) => {
    const s = findSubService(params.slug, params.sub);
    if (!s) return { meta: [{ title: "Not found" }] };
    const loc: "ar" | "en" = (params.locale ?? "ar") === "en" ? "en" : "ar";
    const isAr = loc === "ar";
    const parent = findService(params.slug);
    const baseTitle = s.metaTitle[loc];
    const ctaSuffix = isAr ? "• استشارة مجانية" : "• Free Consultation";
    const title = baseTitle.length < 50 ? `${baseTitle} ${ctaSuffix}` : baseTitle;
    const baseDesc = s.metaDescription[loc];
    const descSuffix = isAr
      ? " ✓ نتائج خلال 90 يوم ✓ وكالة سعودية مرخّصة. احجز جلستك الآن."
      : " ✓ Results in 90 days ✓ Licensed Saudi agency. Book your call now.";
    const description = (baseDesc + descSuffix).slice(0, 158);
    const path = `/${loc}/services/${params.slug}/${s.slug}`;
    const breadcrumbItems = [
      { name: isAr ? "الرئيسية" : "Home", url: `/${loc}` },
      { name: isAr ? "خدماتنا" : "Services", url: `/${loc}/services` },
      ...(parent ? [{ name: parent.title[loc], url: `/${loc}/services/${params.slug}` }] : []),
      { name: s.title[loc], url: path },
    ];
    return {
      meta: buildSeoMeta({ title, description, path, locale: loc, image: s.image }),
      links: buildSeoLinks({ path, locale: loc }),
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title[loc],
          description: s.metaDescription[loc],
          url: absUrl(path),
          image: absUrl(s.image),
          serviceType: parent?.title.en ?? "Digital Marketing",
          provider: organizationLd(),
          areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
          ...(s.plans.length > 0
            ? {
                offers: {
                  "@type": "AggregateOffer",
                  priceCurrency: "SAR",
                  lowPrice: Math.min(...s.plans.map((p) => p.priceSar)),
                  highPrice: Math.max(...s.plans.map((p) => p.priceSar)),
                  offerCount: s.plans.length,
                },
              }
            : {}),
        }),
        jsonLdScript(breadcrumbLdGen(breadcrumbItems)),
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-app section text-center">
        <h1 className="text-3xl font-bold">Not found</h1>
        <Link to="/{-$locale}/services" params={{ locale: undefined }} className="mt-4 inline-block text-primary">
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
  const variant = getServiceVariant(slug);
  const isAr = loc === "ar";
  const siblings = getSubServicesFor(slug).filter((x) => x.slug !== sub);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title[loc],
    description: s.metaDescription[loc],
    serviceType: parent.title[loc],
    provider: { "@type": "Organization", name: "Fikra Digital Marketing" },
    offers: s.plans.map((p) => ({ "@type": "Offer", name: p.name[loc], price: p.priceSar, priceCurrency: "SAR" })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isAr ? "خدماتنا" : "Services", item: `https://fikra-dm.com/${locale}/services` },
      { "@type": "ListItem", position: 2, name: parent.title[loc], item: `https://fikra-dm.com/${locale}/services/${slug}` },
      { "@type": "ListItem", position: 3, name: s.title[loc] },
    ],
  };

  return (
    <SiteLayout>
      <div data-accent={variant.accent}>
        <Breadcrumbs
          trail={[
            { label: isAr ? "خدماتنا" : "Services", href: "/services" },
            { label: parent.title[loc], href: `/services/${slug}` },
            { label: s.shortLabel[loc] },
          ]}
        />

        <ServiceVariantHero service={s} parent={parent} variantOverride={slug} isSubService />

        {/* 2. Showcase — service-specific visuals */}
        <ServiceShowcase slug={slug} />

        {/* 3. Why now — market signals */}
        <ServiceMarketSignals slug={slug} />

        {/* 3. Approach pillars */}
        <ServiceApproach slug={slug} />

        {/* 4. Process */}
        <section className="section bg-surface-soft">
          <div className="container-app">
            <div className="mb-10 max-w-2xl">
              <SectionEyebrow>{isAr ? "خطوات العمل" : "Workflow"}</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                {isAr ? "كيف ننفذ هذه الخدمة" : "How we deliver this"}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {s.process.map((p, i) => (
                <div key={i} className="card-elevated rounded-3xl p-7">
                  <div className="relative mb-4">
                    <span className="text-6xl font-black opacity-10" style={{ color: "var(--svc)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="absolute end-0 top-0 grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white shadow-soft"
                      style={{ background: "var(--svc)" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-ink">{p.step[loc]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.detail[loc]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Results */}
        <ServiceResults slug={slug} />

        {/* 6. Deliverables */}
        <section className="section">
          <div className="container-app">
            <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 shadow-card">
              <SectionEyebrow>{isAr ? "ماذا تستلم" : "Deliverables"}</SectionEyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-ink">{isAr ? "كل ما تحصل عليه" : "Everything you get"}</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {s.deliverables[loc].map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                      style={{ background: "var(--svc-soft)", color: "var(--svc-deep)" }}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <FaqSection items={s.faqs} />

        {/* 8. Pricing */}
        <div id="pricing">
          <PricingPlans plans={s.plans} />
        </div>

        {/* 9. CTA */}
        <CtaBand />

        {/* 10. Related (last) */}
        {siblings.length > 0 && (
          <section className="section bg-surface-soft">
            <div className="container-app">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <SectionEyebrow>{isAr ? "خدمات ذات صلة" : "Related services"}</SectionEyebrow>
                  <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
                    {isAr ? "خدمات قد تهمك" : "You may also like"}
                  </h2>
                </div>
                <Link
                  to="/{-$locale}/services/$slug"
                  params={{ locale, slug }}
                  className="hidden text-sm font-semibold sm:inline"
                  style={{ color: "var(--svc)" }}
                >
                  {isAr ? `كل خدمات ${parent.title[loc]}` : `All ${parent.title[loc]}`}
                </Link>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {siblings.map((x) => (
                  <Link
                    key={x.slug}
                    to="/{-$locale}/services/$slug/$sub"
                    params={{ locale, slug, sub: x.slug }}
                    className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-svc"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <img src={x.image} alt={x.title[loc]} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                      <span
                        className="absolute end-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                        style={{ background: "var(--svc)" }}
                      >
                        {parent.title[loc]}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-ink">{x.title[loc]}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{x.intro[loc]}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--svc)" }}>
                        {isAr ? "اعرف المزيد" : "Learn more"}
                        <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-90" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      </div>
    </SiteLayout>
  );
}
