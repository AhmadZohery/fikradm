import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Search, Megaphone, Palette, Code2 } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { services } from "@/content/data";
import { Reveal } from "./Reveal";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  seo: Search,
  performance: Megaphone,
  creative: Palette,
  web: Code2,
};

// Bento layout positions
const bentoClass = [
  "md:col-span-7 md:row-span-2", // big featured
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
];

export function ServicesGrid() {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-30" aria-hidden />
      <div className="container-app relative">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-end">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {isAr ? "ترسانة الخدمات" : "Services arsenal"}
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              {isAr ? (
                <>
                  كل ما تحتاجه لنمو علامتك
                  <br />
                  <span className="text-gradient">تحت سقف واحد</span>
                </>
              ) : (
                <>
                  Everything to grow your brand
                  <br />
                  <span className="text-gradient">under one roof</span>
                </>
              )}
            </h2>
          </div>
          <p className="text-base text-muted-foreground md:max-w-md md:text-end">
            {isAr
              ? "أربع تخصصات أساسية تتكامل لبناء محرك نمو رقمي حقيقي لشركتك."
              : "Four core specialties that integrate into a real digital growth engine."}
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-12 md:auto-rows-[minmax(220px,auto)]">
          {services.map((s, i) => {
            const Icon = icons[s.slug] ?? Search;
            const isFeatured = i === 0;
            return (
              <Reveal key={s.slug} delay={i * 90} className={bentoClass[i % bentoClass.length]}>
                <Link
                  to={buildHref(locale, `/services/${s.slug}`)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant md:p-8"
                >
                  {/* Hover gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                  <div className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/25" aria-hidden />

                  <div className="relative flex items-start justify-between">
                    <div className={`grid place-items-center rounded-2xl border border-primary/20 bg-primary-soft text-primary transition group-hover:border-primary/40 group-hover:bg-gradient-brand group-hover:text-primary-foreground ${isFeatured ? "h-16 w-16" : "h-14 w-14"}`}>
                      <Icon className={isFeatured ? "h-8 w-8" : "h-7 w-7"} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 tabular-nums">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className={`relative mt-${isFeatured ? "8" : "6"} font-extrabold leading-tight text-foreground ${isFeatured ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                    {s.title[locale]}
                  </h3>
                  <p className="relative mt-3 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground md:text-base">
                    {s.intro[locale]}
                  </p>

                  <div className="relative mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {isAr ? "تعرّف أكثر" : "Explore"}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                    </span>
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
