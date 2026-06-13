import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Building2 } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import clientsWall from "@/assets/clients-wall.webp";
import {
  CLIENTS,
  CLIENT_INDUSTRIES,
  type Client,
  type ClientIndustry,
} from "@/content/clients";

const STYLE_CLASS: Record<NonNullable<Client["style"]>, string> = {
  serif: "font-serif italic font-bold tracking-tight",
  sans: "font-sans font-extrabold tracking-tight",
  italic: "font-serif italic font-semibold",
  wide: "font-sans font-black uppercase tracking-[0.2em] text-[0.95em]",
  ar: "font-sans font-extrabold tracking-tight",
};

export function ClientsWall() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [filter, setFilter] = useState<ClientIndustry | "all">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? CLIENTS
        : CLIENTS.filter((c) => c.industries.includes(filter)),
    [filter],
  );

  return (
    <section
      className="section bg-surface-soft"
      aria-labelledby="clients-wall-heading"
    >
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>
              {isAr ? "عملاؤنا" : "Our clients"}
            </SectionEyebrow>
            <h2
              id="clients-wall-heading"
              className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl"
            >
              {isAr ? (
                <>
                  أكثر من <span className="marker-line px-2">30 علامة</span> اختاروا فكرة
                  <span className="text-gradient"> شريكاً للنمو</span>
                </>
              ) : (
                <>
                  <span className="marker-line px-2">30+ brands</span> chose Fikra as their
                  <span className="text-gradient"> growth partner</span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              {isAr
                ? "من مراكز السيارات إلى العيادات والعقارات والتجزئة — صنعنا حضوراً رقمياً مدفوعاً بالنتائج عبر قطاعات متعددة في السعودية ومصر."
                : "From auto-service centers to clinics, real estate and retail — we build results-driven digital presence across multiple sectors in KSA and Egypt."}
            </p>
          </div>

          <Link
            to="/{-$locale}/case-studies"
            params={{ locale }}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
            data-cta="clients_wall_see_all"
          >
            {isAr ? "كل العملاء ودراسات الحالة" : "See all clients & case studies"}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
          </Link>
        </div>

        {/* Industry filter chips */}
        <div
          role="tablist"
          aria-label={isAr ? "تصفية حسب القطاع" : "Filter by industry"}
          className="mt-8 flex flex-wrap gap-2"
        >
          {CLIENT_INDUSTRIES.map((ind) => {
            const count =
              ind.id === "all"
                ? CLIENTS.length
                : CLIENTS.filter((c) => c.industries.includes(ind.id as ClientIndustry)).length;
            const active = filter === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(ind.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                {isAr ? ind.ar : ind.en}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-white/20" : "bg-surface-soft"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wordmark grid */}
        <ul
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          aria-live="polite"
        >
          {filtered.map((c) => {
            const displayName = !isAr && c.nameEn ? c.nameEn : c.name;
            return (
              <li
                key={c.slug}
                className="group flex h-20 items-center justify-center rounded-2xl border border-border bg-card px-3 text-center text-muted-foreground/80 shadow-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-soft"
                title={displayName}
              >
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={displayName}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 w-auto max-w-full object-contain opacity-80 transition group-hover:opacity-100"
                  />
                ) : (
                  <span
                    className={`text-lg leading-tight md:text-xl ${STYLE_CLASS[c.style ?? "sans"]}`}
                    dir={c.style === "ar" ? "rtl" : "ltr"}
                    style={c.color ? { color: c.color } : undefined}
                  >
                    {displayName}
                  </span>
                )}
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {isAr ? "لا يوجد عملاء في هذا القطاع بعد." : "No clients in this industry yet."}
            </li>
          )}
        </ul>

        {/* Portfolio collage — actual rendered logos page from the brand profile PDF */}
        <figure className="mt-12 overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-card">
          <img
            src={clientsWall}
            alt={
              isAr
                ? "جدار شعارات أكثر من 30 علامة تجارية تعاونت معها فكرة للتسويق الرقمي"
                : "Wall of 30+ client brand logos that partnered with Fikra Digital Marketing"
            }
            className="block h-auto w-full rounded-2xl"
            loading="lazy"
            decoding="async"
            width={2400}
            height={1350}
          />
          <figcaption className="px-4 py-3 text-center text-xs text-muted-foreground">
            {isAr
              ? "مقتطف من ملف الوكالة 2025 — العملاء الذين منحونا الثقة عبر القطاعات المختلفة."
              : "Excerpt from the 2025 agency profile — clients who trusted us across sectors."}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}