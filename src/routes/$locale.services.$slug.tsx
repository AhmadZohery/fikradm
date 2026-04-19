import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PricingPlans } from "@/components/site/PricingPlans";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { SubServicesGrid } from "@/components/site/SubServicesGrid";
import { findService } from "@/content/data";
import { Check } from "lucide-react";

export const Route = createFileRoute("/$locale/services/$slug")({
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

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title[loc],
    description: s.metaDescription[loc],
    provider: { "@type": "Organization", name: "Fikra Digital Marketing" },
    offers: s.plans.map((p) => ({
      "@type": "Offer",
      name: p.name[loc],
      price: p.priceSar,
      priceCurrency: "SAR",
    })),
  };

  return (
    <SiteLayout>
      <Breadcrumbs trail={[
        { label: loc === "ar" ? "خدماتنا" : "Services", href: "/services" },
        { label: s.title[loc] },
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-app grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {loc === "ar" ? "خدمة احترافية" : "Pro service"}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">{s.title[loc]}</h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">{s.intro[loc]}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {s.highlights[loc].map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />{h}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
            <img src={s.image} alt={s.title[loc]} className="aspect-[4/3] w-full object-cover" loading="eager" />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container-app">
          <h2 className="text-3xl font-extrabold md:text-4xl">{loc === "ar" ? "منهجية عملنا" : "Our process"}</h2>
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

      {/* Deliverables + Audience */}
      <section className="section bg-surface">
        <div className="container-app grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7">
            <h3 className="text-xl font-bold">{loc === "ar" ? "ماذا تستلم؟" : "What you get"}</h3>
            <ul className="mt-4 space-y-2.5">
              {s.deliverables[loc].map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-primary" />{d}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7">
            <h3 className="text-xl font-bold">{loc === "ar" ? "لمن تناسب هذه الخدمة؟" : "Who it's for"}</h3>
            <ul className="mt-4 space-y-2.5">
              {s.audience[loc].map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-primary" />{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {s.subServices && s.subServices.length > 0 && (
        <SubServicesGrid parentSlug={s.slug} items={s.subServices} />
      )}

      <PricingPlans plans={s.plans} />

      <FaqSection items={s.faqs} />

      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </SiteLayout>
  );
}
