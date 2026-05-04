import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Building2 } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import clientsWall from "@/assets/clients-wall.webp";

/**
 * Real client list extracted from the 2025 Fikra agency portfolio PDF.
 * Each entry is tagged with one or more industries so visitors can filter
 * the wall to find work relevant to their own sector — a common B2B sales
 * pattern that shortens the path from "social proof" to "qualified lead".
 */
type Industry =
  | "automotive"
  | "real_estate"
  | "healthcare"
  | "retail"
  | "fb"
  | "services"
  | "fashion"
  | "tech";

type Client = {
  name: string;
  industries: Industry[];
  /** Visual treatment for the wordmark */
  style?: "serif" | "sans" | "italic" | "wide" | "ar";
};

const CLIENTS: Client[] = [
  { name: "MaTicAuto", industries: ["automotive"], style: "sans" },
  { name: "GARAGE 90", industries: ["automotive"], style: "wide" },
  { name: "AL AMIN", industries: ["automotive"], style: "sans" },
  { name: "KSR Motors", industries: ["automotive"], style: "sans" },
  { name: "FIX IT", industries: ["automotive"], style: "wide" },
  { name: "Car Care", industries: ["automotive"], style: "italic" },
  { name: "PartTech", industries: ["automotive"], style: "sans" },
  { name: "cardoO", industries: ["automotive", "tech"], style: "sans" },
  { name: "التميّز العقارية", industries: ["real_estate"], style: "ar" },
  { name: "NEW CITY", industries: ["real_estate"], style: "wide" },
  { name: "SHS", industries: ["real_estate", "services"], style: "serif" },
  { name: "Artistry Living", industries: ["real_estate"], style: "serif" },
  { name: "Crystal Dental", industries: ["healthcare"], style: "sans" },
  { name: "د. رفا القاضي", industries: ["healthcare"], style: "ar" },
  { name: "La Béauté", industries: ["healthcare"], style: "italic" },
  { name: "Dr. Amir Magdy", industries: ["healthcare"], style: "serif" },
  { name: "TULIP", industries: ["fashion", "retail"], style: "wide" },
  { name: "KERVANO", industries: ["retail", "fashion"], style: "wide" },
  { name: "BASSANT", industries: ["fashion", "retail"], style: "wide" },
  { name: "NBA Outlet", industries: ["retail"], style: "sans" },
  { name: "ECO CLEAN", industries: ["services"], style: "sans" },
  { name: "Egypt Career", industries: ["services"], style: "sans" },
  { name: "MCC", industries: ["services", "tech"], style: "serif" },
  { name: "YShot", industries: ["tech"], style: "italic" },
  { name: "النادي", industries: ["fb", "services"], style: "ar" },
  { name: "الكبة الشامية", industries: ["fb"], style: "ar" },
];

const STYLE_CLASS: Record<NonNullable<Client["style"]>, string> = {
  serif: "font-serif italic font-bold tracking-tight",
  sans: "font-sans font-extrabold tracking-tight",
  italic: "font-serif italic font-semibold",
  wide: "font-sans font-black uppercase tracking-[0.2em] text-[0.95em]",
  ar: "font-sans font-extrabold tracking-tight",
};

const INDUSTRIES: { id: Industry | "all"; ar: string; en: string }[] = [
  { id: "all", ar: "كل القطاعات", en: "All industries" },
  { id: "automotive", ar: "السيارات والصيانة", en: "Automotive" },
  { id: "real_estate", ar: "العقارات", en: "Real estate" },
  { id: "healthcare", ar: "الرعاية الصحية", en: "Healthcare" },
  { id: "retail", ar: "التجزئة", en: "Retail" },
  { id: "fashion", ar: "الأزياء", en: "Fashion" },
  { id: "fb", ar: "المطاعم والأغذية", en: "F&B" },
  { id: "services", ar: "خدمات الأعمال", en: "Business services" },
  { id: "tech", ar: "التقنية", en: "Tech" },
];

export function ClientsWall() {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";
  const [filter, setFilter] = useState<Industry | "all">("all");

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
          {INDUSTRIES.map((ind) => {
            const count =
              ind.id === "all"
                ? CLIENTS.length
                : CLIENTS.filter((c) => c.industries.includes(ind.id as Industry)).length;
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
          {filtered.map((c) => (
            <li
              key={c.name}
              className="group flex h-20 items-center justify-center rounded-2xl border border-border bg-card px-3 text-center text-muted-foreground/80 shadow-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-soft"
              title={c.name}
            >
              <span
                className={`text-lg leading-tight md:text-xl ${STYLE_CLASS[c.style ?? "sans"]}`}
                dir={c.style === "ar" ? "rtl" : "ltr"}
              >
                {c.name}
              </span>
            </li>
          ))}
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