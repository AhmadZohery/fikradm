import { useLocale } from "@/i18n/useLocale";
import type { PricingPlan } from "@/content/types";
import { Check, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function PricingPlans({ plans, eyebrow, title, subtitle }: {
  plans: PricingPlan[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  const { locale, t, buildHref } = useLocale();

  return (
    <section className="section bg-surface">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {eyebrow ?? (locale === "ar" ? "باقات مرنة" : "Flexible plans")}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            {title ?? (locale === "ar" ? "اختر الباقة المناسبة لمرحلتك" : "Pick the plan that fits your stage")}
          </h2>
          {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 transition",
                p.highlighted
                  ? "border-primary/60 shadow-elegant ring-1 ring-primary/30 lg:-translate-y-2"
                  : "border-border shadow-soft hover:-translate-y-1 hover:shadow-elegant",
              )}
            >
              {p.highlighted && (
                <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-soft">
                  <Star className="me-1 inline h-3 w-3" />
                  {t("common.popular")}
                </span>
              )}

              <header>
                <h3 className="text-lg font-extrabold text-foreground">{p.name[locale]}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.description[locale]}</p>
              </header>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">{p.priceSar.toLocaleString()}</span>
                <span className="text-sm font-medium text-muted-foreground">{t("common.sar")}{t("common.month")}</span>
              </div>
              {p.originalPriceSar && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">{p.originalPriceSar.toLocaleString()} {t("common.sar")}</span>
                  {p.discountPct && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                      {t("common.discount", { value: p.discountPct })}
                    </span>
                  )}
                </div>
              )}

              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features[locale].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={buildHref(locale, "/contact")}
                className={cn(
                  "mt-7 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition",
                  p.highlighted
                    ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95"
                    : "border border-border bg-background text-foreground hover:bg-accent",
                )}
              >
                {t("cta.choose")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
