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

// Two virtual cards rendered alongside the 4 core services to fill a 6-card grid.
// They link to existing sub-services so no extra routes are required.
type ExtraCard = {
  slug: string;
  href: string;
  title: { ar: string; en: string };
  intro: { ar: string; en: string };
  highlights: { ar: string[]; en: string[] };
};

const extraCards: ExtraCard[] = [
  {
    slug: "social",
    href: "/services/performance/social-ads",
    title: { ar: "إدارة السوشيال ميديا", en: "Social Media Management" },
    intro: {
      ar: "محتوى يومي يصنع مجتمعاً ولاءً وتحويلات حقيقية على إنستجرام وتيك توك وسناب.",
      en: "Daily content that builds community, loyalty and real conversions on Instagram, TikTok and Snap.",
    },
    highlights: {
      ar: ["تقويم محتوى شهري", "ريلز / تيك توك", "إدارة المجتمع"],
      en: ["Monthly calendar", "Reels / TikTok", "Community mgmt"],
    },
  },
  {
    slug: "content",
    href: "/services/creative/content-writing",
    title: { ar: "كتابة المحتوى التسويقي", en: "Content & Copywriting" },
    intro: {
      ar: "نصوص تبيع وتقنع، من إعلانات قصيرة إلى مقالات سيو متعمقة بقلم متخصصين عرب.",
      en: "Copy that sells, from short-form ads to in-depth SEO articles by native specialists.",
    },
    highlights: {
      ar: ["نسخ إعلانية", "مقالات SEO", "نصوص لاندينج"],
      en: ["Ad copy", "SEO articles", "Landing copy"],
    },
  },
];

export function ServicesGrid() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  type Card = {
    slug: string;
    href: string;
    title: { ar: string; en: string };
    intro: { ar: string; en: string };
    highlights: { ar: string[]; en: string[] };
    isExtra?: boolean;
  };

  const cards: Card[] = [
    ...services.map((s) => ({
      slug: s.slug,
      href: `/services/${s.slug}`,
      title: s.title,
      intro: s.intro,
      highlights: s.highlights,
    })),
    ...extraCards.map((c) => ({ ...c, isExtra: true })),
  ];

  return (
    <section className="section relative overflow-hidden smart-reveal smart-reveal--stagger">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>{isAr ? "خدماتنا" : "Our Services"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  منظومة خدمات متكاملة بـ
                  <span className="marker-line px-2"> جودة مضمونة</span>
                </>
              ) : (
                <>
                  An integrated stack with{" "}
                  <span className="marker-line px-2">guaranteed quality</span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              {isAr
                ? "ست خدمات أساسية تتكامل مع بعضها لتغطّي كل ما تحتاجه علامتك تحت سقف وكالة واحدة."
                : "Six core services that work together to cover everything your brand needs — under one agency roof."}
            </p>
          </div>
          <Link
            to="/{-$locale}/services"
            params={{ locale }}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
          >
            {isAr ? "كل الخدمات" : "View all services"}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((s, i) => {
            const Icon = iconForSlug[s.slug] ?? Search;
            return (
              <Link
                key={s.slug}
                to={s.href}
                className="svc-card press-fx sr-item group relative isolate overflow-hidden rounded-3xl border border-border bg-card p-7"
                data-cta={`service_card_${s.slug}`}
                data-cta-placement="services_grid"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="svc-card__top-rail" aria-hidden />
                <span className="svc-card__glow" aria-hidden />
                {/* Hover gradient */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition duration-500 group-hover:from-primary/5 group-hover:to-primary/10 group-hover:opacity-100"
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="relative inline-grid h-14 w-14 place-items-center rounded-2xl border border-primary/20 bg-primary-soft text-primary transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -inset-2 -z-10 rounded-3xl bg-primary opacity-0 blur-2xl transition group-hover:opacity-25" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-ink transition group-hover:text-primary">
                  {s.title[locale]}
                </h3>
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
                  <span className="text-sm font-semibold text-primary">
                    {isAr ? "اكتشف الخدمة" : "Explore service"}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:rotate-[-45deg] group-hover:scale-110">
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
