import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PricingPlans } from "@/components/site/PricingPlans";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { findIndustry } from "@/content/data";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/$locale/industries/$slug")({
  beforeLoad: ({ params }) => {
    if (!findIndustry(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const ind = findIndustry(params.slug);
    if (!ind) return { meta: [{ title: "Not found" }] };
    const loc = params.locale === "en" ? "en" : "ar";
    return {
      meta: [
        { title: ind.metaTitle[loc] },
        { name: "description", content: ind.metaDescription[loc] },
        { property: "og:title", content: ind.metaTitle[loc] },
        { property: "og:description", content: ind.metaDescription[loc] },
        { property: "og:image", content: ind.image },
      ],
    };
  },
  component: IndustryPage,
});

function IndustryPage() {
  const { slug, locale } = Route.useParams();
  const ind = findIndustry(slug)!;
  const loc = locale === "en" ? "en" : "ar";

  return (
    <SiteLayout>
      <Breadcrumbs trail={[
        { label: loc === "ar" ? "حلول حسب القطاع" : "Industries", href: "/industries" },
        { label: ind.title[loc] },
      ]} />

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-app grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {loc === "ar" ? "حل قطاعي" : "Industry solution"}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">{ind.title[loc]}</h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">{ind.intro[loc]}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {ind.outcomes.map((o, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
                  <div className="text-2xl font-extrabold text-gradient md:text-3xl">{o.value}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground md:text-xs">{o.label[loc]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
            <img src={ind.image} alt={ind.title[loc]} className="aspect-[4/3] w-full object-cover" loading="eager" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-7">
            <h3 className="text-xl font-bold">{loc === "ar" ? "تحديات نسمعها كل يوم" : "Pains we hear daily"}</h3>
            <ul className="mt-4 space-y-2.5">
              {ind.pains[loc].map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><X className="mt-0.5 h-4 w-4 text-destructive" />{p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-success/20 bg-success/5 p-7">
            <h3 className="text-xl font-bold">{loc === "ar" ? "كيف نحلّها؟" : "How we solve them"}</h3>
            <ul className="mt-4 space-y-2.5">
              {ind.solutions[loc].map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-success" />{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PricingPlans plans={ind.plans} eyebrow={loc === "ar" ? "باقات القطاع" : "Industry packages"} />
      <FaqSection items={ind.faqs} />
      <CtaBand />
    </SiteLayout>
  );
}
