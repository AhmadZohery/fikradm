import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { industries } from "@/content/data";
import { Reveal } from "./Reveal";

export function IndustriesShowcase() {
  const { locale, buildHref, t } = useLocale();
  return (
    <section className="section bg-surface">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {locale === "ar" ? "حلول حسب القطاع" : "Industry solutions"}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              {locale === "ar" ? "نتحدث لغة قطاعك" : "We speak your industry's language"}
            </h2>
          </div>
          <Link to={buildHref(locale, "/industries")} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {t("common.viewall")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              to={buildHref(locale, `/industries/${ind.slug}`)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={ind.image} alt={ind.title[locale]} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-foreground">{ind.title[locale]}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{ind.intro[locale]}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {locale === "ar" ? "اكتشف الحل" : "See solution"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
