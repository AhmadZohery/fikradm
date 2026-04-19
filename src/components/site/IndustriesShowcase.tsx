import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n/useLocale";
import { industries } from "@/content/data";
import { ArrowUpRight, ShoppingBag, Truck, Stethoscope, Building2 } from "lucide-react";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

const iconFor: Record<string, typeof ShoppingBag> = {
  ecommerce: ShoppingBag,
  logistics: Truck,
  healthcare: Stethoscope,
  "real-estate": Building2,
};

export function IndustriesShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>{isAr ? "حلول حسب القطاع" : "Solutions by industry"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>خبرة عميقة في <span className="text-gradient">قطاعك</span></>
              ) : (
                <>Deep expertise in <span className="text-gradient">your industry</span></>
              )}
            </h2>
          </div>
          <Link to="/$locale/industries" params={{ locale }} className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
            {isAr ? "كل القطاعات" : "All industries"}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => {
            const Icon = iconFor[ind.slug] ?? ShoppingBag;
            return (
              <Link
                key={ind.slug}
                to="/$locale/industries/$slug"
                params={{ locale, slug: ind.slug }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={ind.image} alt={ind.title[locale]} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                  <span className="absolute start-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-primary shadow-soft backdrop-blur">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-extrabold text-ink">{ind.title[locale]}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{ind.intro[locale]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    {isAr ? "اكتشف الحلول" : "Explore"}
                    <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
