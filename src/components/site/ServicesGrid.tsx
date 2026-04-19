import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, Megaphone, Palette, Code2 } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { services } from "@/content/data";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  seo: Search,
  performance: Megaphone,
  creative: Palette,
  web: Code2,
};

export function ServicesGrid() {
  const { locale, buildHref, t } = useLocale();
  return (
    <section className="section">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{locale === "ar" ? "خدماتنا" : "Our services"}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            {locale === "ar" ? "ترسانة متكاملة لنمو علامتك" : "A full arsenal to grow your brand"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {locale === "ar"
              ? "من السيو والإعلانات إلى الكرييتيف وتطوير المنصات — كل ما تحتاجه تحت سقف واحد."
              : "From SEO and ads to creative and platform engineering — everything you need under one roof."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = icons[s.slug] ?? Search;
            return (
              <Link
                key={s.slug}
                to={buildHref(locale, `/services/${s.slug}`)}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{s.title[locale]}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.intro[locale]}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t("common.readmore")}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
