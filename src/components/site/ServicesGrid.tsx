import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Search, Megaphone, Palette, Code2, Share2, FileText } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { services } from "@/content/data";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

const iconForSlug: Record<string, typeof Search> = {
  seo: Search,
  performance: Megaphone,
  creative: Palette,
  web: Code2,
  social: Share2,
  content: FileText,
};

export function ServicesGrid() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>{isAr ? "خدماتنا" : "Our Services"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  نقدم خدمات متفوقة بـ
                  <span className="marker-line px-2"> جودة مضمونة</span>
                </>
              ) : (
                <>
                  Superior service with{" "}
                  <span className="marker-line px-2">guaranteed quality</span>
                </>
              )}
            </h2>
          </div>
          <Link
            to="/$locale/services"
            params={{ locale }}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            {isAr ? "كل الخدمات" : "View all services"}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = iconForSlug[s.slug] ?? Search;
            return (
              <Link
                key={s.slug}
                to="/$locale/services/$slug"
                params={{ locale, slug: s.slug }}
                className="group relative isolate overflow-hidden rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-svc"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: "var(--svc)" }}
                />
                <div className="relative mb-6 inline-grid h-14 w-14 place-items-center rounded-2xl border border-border bg-surface-soft transition group-hover:scale-110">
                  <Icon className="h-6 w-6" style={{ color: "var(--svc)" }} />
                  <span
                    className="absolute -inset-2 -z-10 rounded-3xl opacity-0 blur-xl transition group-hover:opacity-30"
                    style={{ background: "var(--svc)" }}
                  />
                </div>

                <h3 className="text-xl font-extrabold text-ink">{s.title[locale]}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {s.intro[locale]}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.highlights[locale].slice(0, 3).map((h, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-border bg-surface-soft/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-semibold" style={{ color: "var(--svc)" }}>
                    {isAr ? "اكتشف الخدمة" : "Explore service"}
                  </span>
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-white transition group-hover:rotate-[-45deg]"
                    style={{ background: "var(--svc)" }}
                  >
                    <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
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
