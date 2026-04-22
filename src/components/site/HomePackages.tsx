import { Link } from "@tanstack/react-router";
import { Check, Sparkles, Rocket, Crown, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

type BundlePlan = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  priceSar: number;
  originalPriceSar: number;
  popular?: boolean;
  bestFor: { ar: string; en: string };
  includes: { ar: string[]; en: string[] };
};

const BUNDLES: BundlePlan[] = [
  {
    id: "starter",
    icon: Sparkles,
    name: { ar: "باقة الانطلاق", en: "Starter Bundle" },
    tagline: { ar: "أساس قوي لتواجدك الرقمي", en: "A strong foundation for your digital presence" },
    priceSar: 4990,
    originalPriceSar: 6990,
    bestFor: { ar: "للأنشطة الناشئة وملاك المتاجر الجدد", en: "For startups and new store owners" },
    includes: {
      ar: [
        "سيو محلي + تحسين 6 صفحات",
        "إدارة منصة إعلانية واحدة (Meta أو Google)",
        "12 تصميم سوشيال شهرياً",
        "كرييتيف لـ 4 إعلانات",
        "تقرير شهري + مكالمة استراتيجية",
      ],
      en: [
        "Local SEO + 6-page optimization",
        "1 ad platform (Meta or Google)",
        "12 social designs / month",
        "Creative for 4 ads",
        "Monthly report + strategy call",
      ],
    },
  },
  {
    id: "growth",
    icon: Rocket,
    name: { ar: "باقة النمو", en: "Growth Bundle" },
    tagline: { ar: "الأكثر طلباً — تسويق متكامل بنتائج سريعة", en: "Most popular — integrated marketing with fast results" },
    priceSar: 12990,
    originalPriceSar: 16990,
    popular: true,
    bestFor: { ar: "للعلامات التي تريد توسعاً حقيقياً", en: "For brands ready to scale" },
    includes: {
      ar: [
        "كل ما في باقة الانطلاق",
        "سيو متقدم + 4 مقالات شهرياً + بناء روابط",
        "إعلانات Meta + Google + TikTok",
        "30 تصميم + 4 ريلز/فيديوهات شهرياً",
        "إدارة سوشيال ميديا كاملة + Community Mgmt",
        "Dashboard أداء حي + تقارير أسبوعية",
        "مدير حساب مخصص",
      ],
      en: [
        "Everything in Starter",
        "Advanced SEO + 4 articles/month + link building",
        "Meta + Google + TikTok ads",
        "30 designs + 4 reels/videos monthly",
        "Full social media management + community",
        "Live performance dashboard + weekly reports",
        "Dedicated account manager",
      ],
    },
  },
  {
    id: "scale",
    icon: Crown,
    name: { ar: "باقة الهيمنة", en: "Scale Bundle" },
    tagline: { ar: "للعلامات الكبرى التي تطلب الريادة", en: "For market leaders who demand dominance" },
    priceSar: 28990,
    originalPriceSar: 36990,
    bestFor: { ar: "للشركات الكبرى والعلامات المؤسسية", en: "For enterprises and large brands" },
    includes: {
      ar: [
        "كل ما في باقة النمو",
        "سيو مؤسسي + سلطة موضوعية كاملة",
        "حملات إعلانية على كل المنصات + ميزانيات بلا حدود",
        "إنتاج بصري احترافي (تصوير + موشن)",
        "موقع إلكتروني / متجر مع CRO",
        "Dashboard مخصص + تقارير يومية",
        "فريق مخصص (3+ متخصصين)",
        "اتفاقية SLA ودعم 24/7",
      ],
      en: [
        "Everything in Growth",
        "Enterprise SEO + topical authority",
        "Ads on all platforms + unlimited budgets",
        "Pro visual production (photo + motion)",
        "Website / store with CRO",
        "Custom dashboard + daily reports",
        "Dedicated team (3+ specialists)",
        "SLA + 24/7 support",
      ],
    },
  },
];

export function HomePackages() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";

  return (
    <section id="packages" className="section relative overflow-hidden bg-gradient-soft">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" aria-hidden />
      <div className="container-app relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>{isAr ? "باقات شاملة" : "Integrated Bundles"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
            {isAr ? (
              <>
                باقة تسويق <span className="marker-line px-2">متكاملة</span> بدلاً من خدمات متفرقة
              </>
            ) : (
              <>
                One <span className="marker-line px-2">integrated</span> marketing bundle, not scattered services
              </>
            )}
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            {isAr
              ? "اختر باقتك الكاملة — سيو + إعلانات + سوشيال + تصميم تحت سقف واحد. وفّر حتى 35% مقابل شراء الخدمات منفصلة."
              : "Pick your full bundle — SEO + Ads + Social + Design under one roof. Save up to 35% vs buying separately."}
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {BUNDLES.map((b) => {
            const Icon = b.icon;
            const features = isAr ? b.includes.ar : b.includes.en;
            return (
              <article
                key={b.id}
                className={
                  "svc-card press-fx sr-item relative flex flex-col rounded-3xl border bg-card p-8 pt-12 " +
                  (b.popular
                    ? "border-primary/50 shadow-elegant ring-1 ring-primary/30 lg:-translate-y-3"
                    : "border-border shadow-card")
                }
              >
                {b.popular && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-primary px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-soft rtl:left-auto rtl:right-1/2 rtl:translate-x-1/2">
                    <Sparkles className="h-3 w-3" />
                    {isAr ? "الأكثر طلباً" : "Most popular"}
                  </span>
                )}

                <div
                  className={
                    "grid h-14 w-14 place-items-center rounded-2xl " +
                    (b.popular ? "bg-gradient-primary text-white shadow-soft" : "bg-primary/10 text-primary")
                  }
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-2xl font-extrabold text-ink">{isAr ? b.name.ar : b.name.en}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{isAr ? b.tagline.ar : b.tagline.en}</p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-ink tabular-nums">{b.priceSar.toLocaleString()}</span>
                  <span className="text-sm font-medium text-muted-foreground">{t("common.sar")}{t("common.month")}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">{b.originalPriceSar.toLocaleString()} {t("common.sar")}</span>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                    -{Math.round(((b.originalPriceSar - b.priceSar) / b.originalPriceSar) * 100)}%
                  </span>
                </div>

                <p className="mt-5 rounded-xl bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                  {isAr ? "الأنسب لـ: " : "Best for: "}<span className="font-medium text-foreground/80">{isAr ? b.bestFor.ar : b.bestFor.en}</span>
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={buildHref(locale, "/contact")}
                  className={
                    "mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition " +
                    (b.popular
                      ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95"
                      : "border border-border bg-background text-foreground hover:bg-accent")
                  }
                >
                  {isAr ? "اختر هذه الباقة" : "Choose this bundle"}
                  <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a href="#builder" className="text-sm font-semibold text-primary hover:underline">
            {isAr ? "أو ابنِ باقتك الخاصة من الخدمات ↓" : "Or build your own bundle ↓"}
          </a>
        </div>
      </div>
    </section>
  );
}
