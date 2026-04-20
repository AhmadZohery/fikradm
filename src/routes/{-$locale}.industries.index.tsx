import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { industries } from "@/content/data";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export const Route = createFileRoute("/{-$locale}/industries/")({
  head: ({ params }) => {
    const isAr = params.locale === "ar";
    return {
      meta: [
        { title: isAr ? "حلول حسب القطاع | فكرة" : "Industry Solutions | Fikra" },
        { name: "description", content: isAr ? "حلول تسويقية متخصصة لكل قطاع: التجارة، اللوجستيات، الصحة، العقار." : "Tailored solutions per industry: e-commerce, logistics, healthcare, real estate." },
      ],
    };
  },
  component: IndustriesIndex,
});

function IndustriesIndex() {
  const { locale, buildHref } = useLocale();
  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: locale === "ar" ? "حلول حسب القطاع" : "Industries" }]} />
      <section className="section">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl">{locale === "ar" ? "حلول مخصصة لكل قطاع" : "Tailored solutions for every industry"}</h1>
            <p className="mt-4 text-muted-foreground">{locale === "ar" ? "نتحدث لغة عميلك لأننا نعرف قطاعك." : "We speak your customer's language because we know your industry."}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {industries.map((ind) => (
              <Link key={ind.slug} to={buildHref(locale, `/industries/${ind.slug}`)} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={ind.image} alt={ind.title[locale]} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{ind.title[locale]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{ind.intro[locale]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {locale === "ar" ? "اكتشف الحل" : "See solution"}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
