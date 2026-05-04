import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PricingPlans } from "@/components/site/PricingPlans";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { findIndustry } from "@/content/data";
import { Check, X, ArrowRight } from "lucide-react";
import { buildSeoMeta, buildSeoLinks, jsonLdScript, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/industries/$slug")({
  beforeLoad: ({ params }) => {
    if (!findIndustry(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const ind = findIndustry(params.slug);
    if (!ind) return { meta: [{ title: "Not found" }] };
    const loc = (params.locale ?? "ar") === "en" ? "en" : "ar";
    const isAr = loc === "ar";
    const path = `/${loc}/industries/${params.slug}`;
    return {
      meta: buildSeoMeta({
        title: ind.metaTitle[loc],
        description: ind.metaDescription[loc],
        path,
        locale: loc,
        image: ind.image,
      }),
      links: buildSeoLinks({ path, locale: loc }),
      scripts: [
        jsonLdScript(
          breadcrumbLd([
            { name: isAr ? "الرئيسية" : "Home", url: `/${loc}` },
            { name: isAr ? "حلول حسب القطاع" : "Industries", url: `/${loc}/industries` },
            { name: ind.title[loc], url: path },
          ]),
        ),
      ],
    };
  },
  component: IndustryPage,
});

function IndustryPage() {
  const { slug, locale } = Route.useParams();
  const ind = findIndustry(slug)!;
  const loc = locale === "en" ? "en" : "ar";
  const subs = ind.subIndustries ?? [];

  return (
    <SiteLayout>
      <Breadcrumbs trail={[
        { label: loc === "ar" ? "حلول حسب القطاع" : "Industries", href: "/industries" },
        { label: ind.title[loc] },
      ]} />

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-app grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <Reveal>
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
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
              <img src={ind.image} alt={ind.title[loc]} className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105" loading="eager" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-app grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-7 transition hover:shadow-soft">
              <h3 className="text-xl font-bold">{loc === "ar" ? "تحديات نسمعها كل يوم" : "Pains we hear daily"}</h3>
              <ul className="mt-4 space-y-2.5">
                {ind.pains[loc].map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><X className="mt-0.5 h-4 w-4 text-destructive" />{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl border border-success/20 bg-success/5 p-7 transition hover:shadow-soft">
              <h3 className="text-xl font-bold">{loc === "ar" ? "كيف نحلّها؟" : "How we solve them"}</h3>
              <ul className="mt-4 space-y-2.5">
                {ind.solutions[loc].map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-success" />{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {subs.length > 0 && (
        <section className="section bg-surface">
          <div className="container-app">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {loc === "ar" ? "تخصصات داخل القطاع" : "Niches inside this industry"}
                </span>
                <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                  {loc === "ar" ? "حلول أعمق لكل تخصص" : "Deeper solutions for each niche"}
                </h2>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subs.map((x, i) => (
                <Reveal key={x.slug} delay={i * 80}>
                  <Link
                    to="/{-$locale}/industries/$slug/$sub"
                    params={{ locale, slug, sub: x.slug }}
                    className="group block h-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={x.image}
                        alt={x.title[loc]}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold">{x.title[loc]}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{x.intro[loc]}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        {loc === "ar" ? "اعرف المزيد" : "Learn more"}
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <PricingPlans plans={ind.plans} eyebrow={loc === "ar" ? "باقات القطاع" : "Industry packages"} />
      <FaqSection items={ind.faqs} />
      <CtaBand />
    </SiteLayout>
  );
}
