import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PricingPlans } from "@/components/site/PricingPlans";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { SubServicesGrid } from "@/components/site/SubServicesGrid";
import { findService } from "@/content/data";
import { ServiceVariantHero } from "@/components/site/services/ServiceVariantHero";
import { ServiceMarketSignals } from "@/components/site/services/ServiceMarketSignals";
import { ServiceApproach } from "@/components/site/services/ServiceApproach";
import { ServiceResults } from "@/components/site/services/ServiceResults";
import { getServiceVariant } from "@/components/site/services/serviceVariants";
import { SectionEyebrow } from "@/components/site/cinematic/SectionEyebrow";
import { Check, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/$locale/services/$slug/")({
  beforeLoad: ({ params }) => {
    if (!findService(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const s = findService(params.slug);
    if (!s) return { meta: [{ title: "Not found" }] };
    const loc = params.locale === "en" ? "en" : "ar";
    return {
      meta: [
        { title: s.metaTitle[loc] },
        { name: "description", content: s.metaDescription[loc] },
        { property: "og:title", content: s.metaTitle[loc] },
        { property: "og:description", content: s.metaDescription[loc] },
        { property: "og:image", content: s.image },
      ],
      links: [
        { rel: "canonical", href: `https://fikra-dm.com/${params.locale}/services/${s.slug}` },
        { rel: "alternate", hrefLang: "ar", href: `https://fikra-dm.com/ar/services/${s.slug}` },
        { rel: "alternate", hrefLang: "en", href: `https://fikra-dm.com/en/services/${s.slug}` },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug, locale } = Route.useParams();
  const s = findService(slug)!;
  const loc = locale === "en" ? "en" : "ar";
  const variant = getServiceVariant(slug);
  const isAr = loc === "ar";

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title[loc],
    description: s.metaDescription[loc],
    provider: { "@type": "Organization", name: "Fikra Digital Marketing" },
    offers: s.plans.map((p) => ({ "@type": "Offer", name: p.name[loc], price: p.priceSar, priceCurrency: "SAR" })),
  };

  return (
    <SiteLayout>
      <div data-accent={variant.accent}>
        <Breadcrumbs trail={[{ label: isAr ? "خدماتنا" : "Services", href: "/services" }, { label: s.title[loc] }]} />

        {/* 1. HERO — captures attention with service personality */}
        <ServiceVariantHero service={s} />

        {/* 2. WHY NOW — market signals create urgency */}
        <ServiceMarketSignals slug={slug} />

        {/* 3. WHAT WE DO DIFFERENTLY — pillars */}
        <ServiceApproach slug={slug} />

        {/* 4. PROCESS — methodology */}
        <section className="section bg-surface-soft">
          <div className="container-app">
            <div className="mb-10 max-w-2xl">
              <SectionEyebrow>{isAr ? "منهجية العمل" : "Our methodology"}</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                {isAr ? "كيف ننفذ هذه الخدمة خطوة بخطوة" : "How we deliver, step by step"}
              </h2>
            </div>
            <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        {/* 5. RESULTS — proof of work */}
        <ServiceResults slug={slug} />

        {/* 6. DELIVERABLES + AUDIENCE */}
        <section className="section">
          <div className="container-app grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
              <SectionEyebrow>{isAr ? "ماذا تستلم" : "Deliverables"}</SectionEyebrow>
              <h3 className="mt-3 text-2xl font-extrabold text-ink">
                {isAr ? "كل ما تحصل عليه" : "Everything you receive"}
              </h3>
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
            <div
              className="relative overflow-hidden rounded-3xl p-8 text-white shadow-elegant"
              style={{ background: "var(--gradient-svc)" }}
            >
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" aria-hidden />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
                  {isAr ? "لمن تناسب" : "Who it's for"}
                </span>
                <h3 className="mt-3 text-2xl font-extrabold">{isAr ? "هل هذه الخدمة لك؟" : "Is this service for you?"}</h3>
                <ul className="mt-5 space-y-3">
                  {s.audience[loc].map((d, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 rtl:rotate-90" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ — handle objections before pricing */}
        <FaqSection items={s.faqs} />

        {/* 8. PRICING — moment of decision */}
        <div id="pricing">
          <PricingPlans plans={s.plans} />
        </div>

        {/* 9. CTA — close the deal */}
        <CtaBand />

        {/* 10. SUB-SERVICES — last (suggestion if not ready) */}
        {s.subServices && s.subServices.length > 0 && (
          <SubServicesGrid parentSlug={s.slug} items={s.subServices} />
        )}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </div>
    </SiteLayout>
  );
}
