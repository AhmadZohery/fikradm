import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { industries } from "@/content/data";
import { Reveal } from "./Reveal";

export function IndustriesShowcase() {
  const { locale, buildHref, t } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section bg-surface/60 relative overflow-hidden">
      <div className="container-app relative">
        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {isAr ? "حلول حسب القطاع" : "Industry solutions"}
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {isAr ? (
                <>
                  نتحدث <span className="text-gradient">لغة قطاعك</span>
                  <br /> وعملائك
                </>
              ) : (
                <>
                  We speak the <span className="text-gradient">language</span>
                  <br /> of your industry
                </>
              )}
            </h2>
          </div>
          <Link
            to={buildHref(locale, "/industries")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            {t("common.viewall")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-12 md:auto-rows-[280px]">
          {industries.map((ind, i) => {
            // Bento sizing
            const sizes = ["md:col-span-7 md:row-span-2", "md:col-span-5", "md:col-span-5", "md:col-span-7"];
            const isLarge = i === 0;
            return (
              <Reveal key={ind.slug} delay={i * 80} className={sizes[i % sizes.length]}>
                <Link
                  to={buildHref(locale, `/industries/${ind.slug}`)}
                  className="group relative block h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant"
                >
                  <img
                    src={ind.image}
                    alt={ind.title[locale]}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" aria-hidden />
                  {/* Brand tint on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden />

                  <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8">
                    <div className="flex items-start justify-between">
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
                        0{i + 1}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition group-hover:border-white/40 group-hover:bg-white">
                        <ArrowUpRight className="h-4 w-4 text-white transition group-hover:rotate-45 group-hover:text-primary" />
                      </span>
                    </div>
                    <div className="mt-auto">
                      <h3 className={`font-extrabold leading-tight ${isLarge ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                        {ind.title[locale]}
                      </h3>
                      <p className={`mt-2 line-clamp-2 text-white/85 ${isLarge ? "text-base md:text-lg" : "text-sm"}`}>
                        {ind.intro[locale]}
                      </p>
                      {ind.subIndustries && ind.subIndustries.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {ind.subIndustries.slice(0, 3).map((s) => (
                            <span
                              key={s.slug}
                              className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/85 backdrop-blur"
                            >
                              {s.shortLabel[locale]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
