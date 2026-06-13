import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { useLocale } from "@/i18n/useLocale";
import { Reveal } from "@/components/site/Reveal";
import { SectionEyebrow } from "@/components/site/cinematic/SectionEyebrow";
import {
  ArrowUpRight,
  TrendingUp,
  ShoppingBag,
  Heart,
  Building2,
  GraduationCap,
  Utensils,
  Sparkles,
  Quote,
  ImageIcon,
  Briefcase,
} from "lucide-react";
import { buildSeoMeta, buildSeoLinks, jsonLdScript, breadcrumbLd } from "@/lib/seo";
import { CASE_STUDIES, type CaseStudy } from "@/content/caseStudies";
import type { ClientIndustry } from "@/content/clients";

export const Route = createFileRoute("/{-$locale}/case-studies/")({
  head: ({ params }) => {
    const ar = (params.locale ?? "ar") === "ar";
    const locale = (params.locale ?? "ar") as "ar" | "en";
    const title = ar ? "قصص النجاح والبورتفوليو | فكرة" : "Case Studies & Portfolio | Fikra";
    const description = ar
      ? "Playbooks عملية وقصص أعمال نعمل بها مع علامات سعودية وخليجية ومصرية في قطاعات مختلفة."
      : "Practical playbooks and real engagements with Saudi, Gulf and Egyptian brands across sectors.";
    const path = `/${locale}/case-studies`;
    return {
      meta: buildSeoMeta({ title, description, path, locale }),
      links: buildSeoLinks({ path, locale }),
      scripts: [
        jsonLdScript(
          breadcrumbLd([
            { name: ar ? "الرئيسية" : "Home", url: `/${locale}` },
            { name: ar ? "قصص النجاح" : "Case Studies", url: path },
          ]),
        ),
      ],
    };
  },
  component: CaseStudiesIndex,
});

const STUDIES: CaseStudy[] = CASE_STUDIES;

const INDUSTRY_ICONS: Record<Industry, typeof TrendingUp> = {
  ecommerce: ShoppingBag,
  healthcare: Heart,
  "real-estate": Building2,
  education: GraduationCap,
  fnb: Utensils,
  travel: Plane,
  saas: TrendingUp,
};

function CaseStudiesIndex() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const featured = STUDIES.find((s) => s.featured) ?? STUDIES[0];
  const rest = STUDIES.filter((s) => s.slug !== featured.slug);

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "قصص النجاح" : "Case Studies" }]} />

      {/* Hero */}
      <section className="section-tight relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-40" aria-hidden />
        <div className="container-app relative">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {isAr ? "أعمال موثّقة" : "Verified work"}
              </span>
              <h1 className="mt-5 text-4xl font-black leading-[1.1] md:text-6xl">
                {isAr ? (
                  <>
                    قصص نجاح <span className="text-gradient">تتحدث بالأرقام</span>،
                    <br />
                    لا بالكلمات.
                  </>
                ) : (
                  <>
                    Success stories <span className="text-gradient">that speak</span>
                    <br />
                    in numbers, not words.
                  </>
                )}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
                {isAr
                  ? "+200 علامة تجارية في الخليج اختارت فكرة. هذه عيّنة من النتائج الحقيقية في قطاعات مختلفة."
                  : "200+ Gulf brands chose Fikra. Below is a sample of real, measurable outcomes across industries."}
              </p>

              {/* Big stats */}
              <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { v: "+200", l: { ar: "علامة تجارية", en: "Brands" } },
                  { v: "+28M", l: { ar: "ريال إعلانات مدارة", en: "Managed ad spend" } },
                  { v: "4.9/5", l: { ar: "تقييم العملاء", en: "Client rating" } },
                  { v: "97%", l: { ar: "نسبة الاحتفاظ", en: "Retention" } },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
                    <div className="text-2xl font-black text-gradient md:text-3xl">{s.v}</div>
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{s.l[locale]}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured case */}
      <section className="section-tight">
        <div className="container-app">
          <Reveal>
            <Link
              to="/{-$locale}/case-studies"
              params={{ locale }}
              className="group relative grid overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-elegant lg:grid-cols-[1.2fr_1fr]"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <img
                  src={featured.cover}
                  alt={featured.client[locale]}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${featured.accent} opacity-30 mix-blend-multiply`} />
                <span className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                  <Sparkles className="h-3 w-3" /> {isAr ? "قصة مميّزة" : "Featured"}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  {featured.industryLabel[locale]} · {featured.duration[locale]}
                </div>
                <h2 className="mt-3 text-2xl font-black leading-tight md:text-4xl">
                  {featured.title[locale]}
                </h2>
                <p className="mt-4 text-muted-foreground">{featured.summary[locale]}</p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {featured.metrics.map((m, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-surface-soft p-3 text-center">
                      <div className="text-2xl font-black tabular-nums text-gradient">{m.value}</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{m.label[locale]}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {featured.services.map((s) => (
                      <span key={s} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    {isAr ? "قراءة القصة" : "Read story"}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="section-tight">
        <div className="container-app">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <SectionEyebrow>{isAr ? "كل القصص" : "All stories"}</SectionEyebrow>
                <h2 className="mt-3 text-2xl font-extrabold md:text-4xl">
                  {isAr ? "تصفّح كل أعمالنا" : "Browse all our work"}
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((c, i) => {
              const Icon = INDUSTRY_ICONS[c.industry];
              return (
                <Reveal key={c.slug} delay={i * 60}>
                  <Link
                    to="/{-$locale}/case-studies"
                    params={{ locale }}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-elegant"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={c.cover}
                        alt={c.client[locale]}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <span className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${c.accent} opacity-25 transition duration-500 group-hover:opacity-40 mix-blend-multiply`} />
                      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
                      <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                        <Icon className="h-3 w-3" /> {c.industryLabel[locale]}
                      </span>
                      <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2">
                        {c.metrics.slice(0, 2).map((m, mi) => (
                          <div key={mi} className="rounded-xl border border-white/20 bg-white/10 p-2 text-center backdrop-blur-md">
                            <div className="text-xl font-black tabular-nums text-white">{m.value}</div>
                            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80">{m.label[locale]}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-ink transition group-hover:text-primary">
                        {c.title[locale]}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {c.summary[locale]}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-4">
                        <div className="flex flex-wrap gap-1">
                          {c.services.slice(0, 2).map((s) => (
                            <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                              {s}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {c.duration[locale]}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote callout */}
      <section className="section-tight">
        <div className="container-app">
          <Reveal>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/5 to-card p-10 text-center md:p-14">
              <Quote className="mx-auto h-10 w-10 text-primary/30" />
              <p className="mt-4 font-serif text-2xl leading-relaxed text-ink md:text-3xl">
                {isAr
                  ? "كل قصة هنا بدأت بمكالمة استشارة مجانية. القصة التالية ممكن تكون قصتك."
                  : "Every story here started with a free consultation. The next one could be yours."}
              </p>
              <Link
                to="/{-$locale}/contact"
                params={{ locale }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-pop transition hover:scale-[1.02]"
              >
                {isAr ? "ابدأ قصتك اليوم" : "Start your story today"}
                <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </SiteLayout>
  );
}
