import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PricingPlans } from "@/components/site/PricingPlans";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { findIndustry, findSubIndustry, getSubIndustriesFor } from "@/content/data";
import { Check, X, ArrowRight } from "lucide-react";
import { buildSeoMeta, buildSeoLinks, jsonLdScript, breadcrumbLd as breadcrumbLdGen } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/industries/$slug/$sub")({
  beforeLoad: ({ params }) => {
    if (!findSubIndustry(params.slug, params.sub)) throw notFound();
  },
  head: ({ params }) => {
    const s = findSubIndustry(params.slug, params.sub);
    if (!s) return { meta: [{ title: "Not found" }] };
    const loc: "ar" | "en" = (params.locale ?? "ar") === "en" ? "en" : "ar";
    const path = `/${loc}/industries/${params.slug}/${s.slug}`;
    return {
      meta: buildSeoMeta({
        title: s.metaTitle[loc],
        description: s.metaDescription[loc],
        path,
        locale: loc,
        image: s.image,
      }),
      links: buildSeoLinks({ path, locale: loc }),
    };
  },
  component: SubIndustryPage,
});

function SubIndustryPage() {
  const { slug, sub, locale } = Route.useParams();
  const parent = findIndustry(slug)!;
  const s = findSubIndustry(slug, sub)!;
  const loc = locale === "en" ? "en" : "ar";
  const siblings = getSubIndustriesFor(slug).filter((x) => x.slug !== sub);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: loc === "ar" ? "حلول حسب القطاع" : "Industries", item: `https://fikradm.lovable.app/${locale}/industries` },
      { "@type": "ListItem", position: 2, name: parent.title[loc], item: `https://fikradm.lovable.app/${locale}/industries/${slug}` },
      { "@type": "ListItem", position: 3, name: s.title[loc] },
    ],
  };

  return (
    <SiteLayout>
      <Breadcrumbs trail={[
        { label: loc === "ar" ? "حلول حسب القطاع" : "Industries", href: "/industries" },
        { label: parent.title[loc], href: `/industries/${slug}` },
        { label: s.shortLabel[loc] },
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-app grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <Reveal>
            <Link
              to="/{-$locale}/industries/$slug"
              params={{ locale, slug }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              {parent.title[loc]}
            </Link>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">{s.title[loc]}</h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">{s.intro[loc]}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {s.outcomes.map((o, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
                  <div className="text-2xl font-extrabold text-gradient md:text-3xl">{o.value}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground md:text-xs">{o.label[loc]}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/{-$locale}/contact"
                params={{ locale }}
                className="inline-flex h-11 items-center rounded-full bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 hover:shadow-glow"
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
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
              <img src={s.image} alt={s.title[loc]} className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105" loading="eager" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pains vs Solutions */}
      <section className="section">
        <div className="container-app grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-7 transition hover:shadow-soft">
              <h3 className="text-xl font-bold">{loc === "ar" ? "تحديات نسمعها كل يوم" : "Pains we hear daily"}</h3>
              <ul className="mt-4 space-y-2.5">
                {s.pains[loc].map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl border border-success/20 bg-success/5 p-7 transition hover:shadow-soft">
              <h3 className="text-xl font-bold">{loc === "ar" ? "كيف نحلّها؟" : "How we solve them"}</h3>
              <ul className="mt-4 space-y-2.5">
                {s.solutions[loc].map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <div id="pricing">
        <PricingPlans plans={s.plans} eyebrow={loc === "ar" ? "باقات متخصصة" : "Specialized packages"} />
      </div>

      <FaqSection items={s.faqs} />

      {siblings.length > 0 && (
        <section className="section">
          <div className="container-app">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold md:text-3xl">
                {loc === "ar" ? "تخصصات أخرى في نفس القطاع" : "Other niches in this industry"}
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {siblings.map((x, i) => (
                <Reveal key={x.slug} delay={i * 80}>
                  <Link
                    to="/{-$locale}/industries/$slug/$sub"
                    params={{ locale, slug, sub: x.slug }}
                    className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
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

      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </SiteLayout>
  );
}
