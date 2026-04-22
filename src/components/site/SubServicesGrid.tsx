import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { SubServiceMeta } from "@/content/types";
import { useLocale } from "@/i18n/useLocale";

export function SubServicesGrid({
  parentSlug,
  items,
  title,
}: {
  parentSlug: string;
  items: SubServiceMeta[];
  title?: string;
}) {
  const { locale } = useLocale();
  const loc = locale === "en" ? "en" : "ar";

  if (!items.length) return null;

  return (
    <section className="section bg-surface smart-reveal smart-reveal--stagger">
      <div className="container-app">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            {title ?? (loc === "ar" ? "تخصصات هذه الخدمة" : "Specializations")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {loc === "ar"
              ? "اختر التخصص الذي يناسب احتياجك واطّلع على باقاته الكاملة."
              : "Pick the specialization that fits your need and explore its full plans."}
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.slug}
              to="/{-$locale}/services/$slug/$sub"
              params={{ locale, slug: parentSlug, sub: s.slug }}
              className="svc-card press-fx sr-item group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              data-cta={`subservice_card_${s.slug}`}
              data-cta-placement="subservices_grid"
            >
              <span className="svc-card__top-rail" aria-hidden />
              <span className="svc-card__glow" aria-hidden />
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title[loc]}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {s.shortLabel[loc]}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug">{s.title[loc]}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{s.intro[loc]}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {loc === "ar" ? "اكتشف التفاصيل" : "Explore details"}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
