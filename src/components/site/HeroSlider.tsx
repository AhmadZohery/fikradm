import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight, Pause, Play, Sparkles, TrendingUp, Rocket } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { GlowOrbs } from "./cinematic/GlowOrbs";
import { HugeWordBackdrop } from "./cinematic/HugeWordBackdrop";
import { FloatingStatCard } from "./cinematic/FloatingStatCard";
import { SocialRail } from "./cinematic/SocialRail";
import { PillButton } from "./cinematic/PillButton";
import { Sparkle } from "./cinematic/Sparkle";
import heroSaudiMarketer from "@/assets/hero-saudi-marketer.jpg";
import heroAdsPerformance from "@/assets/hero-ads-performance.jpg";
import heroBrandCreative from "@/assets/hero-brand-creative.jpg";

type Slide = {
  id: string;
  eyebrow: { ar: string; en: string };
  titleAr: React.ReactNode;
  titleEn: React.ReactNode;
  // Kinetic words split for word-rise animation
  kineticAr: string[];
  kineticEn: string[];
  body: { ar: string; en: string };
  primary: { ar: string; en: string; href: string };
  secondary: { ar: string; en: string; href: string };
  hugeWord: { ar: string; en: string };
  image: string;
  badge: { icon: React.ComponentType<{ className?: string }>; ar: string; en: string };
  stats: { value: string; ar: string; en: string }[];
};

const SLIDE_DURATION = 7000;

export function HeroSlider() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: "marketing",
        eyebrow: { ar: "شريكك الاستراتيجي للنمو الرقمي في السعودية", en: "Your strategic partner for digital growth in KSA" },
        titleAr: <>نحوّل <span className="marker-line px-2">طموحك</span> إلى <span className="text-gradient">نمو قابل للقياس</span></>,
        titleEn: <>We turn <span className="marker-line px-2">ambition</span> into <span className="text-gradient">measurable growth</span></>,
        kineticAr: ["نحوّل", "طموحك", "إلى", "نمو", "قابل", "للقياس"],
        kineticEn: ["We", "turn", "ambition", "into", "measurable", "growth"],
        body: {
          ar: "لسنا مجرد وكالة تسويق — نحن شركاؤك الاستراتيجيون: نبني الهوية، نطوّر الموقع، ونُدير حملاتك على Google و Meta و TikTok بأرقام واضحة وتقارير شفّافة لأكثر من 30 علامة في السعودية ومصر.",
          en: "More than an agency — we're your strategic partners: building your brand, developing your site, and running Google, Meta and TikTok campaigns with transparent reports for 30+ brands across KSA and Egypt.",
        },
        primary: { ar: "احجز استشارة تشخيص مجانية", en: "Book a free diagnostic call", href: buildHref(locale, "/contact") },
        secondary: { ar: "شاهد قصص نجاحنا", en: "See our success stories", href: buildHref(locale, "/case-studies") },
        hugeWord: { ar: "تسويق", en: "MARKETING" },
        image: heroSaudiMarketer,
        badge: { icon: Sparkles, ar: "وكالة متكاملة الخدمات", en: "Full-stack growth partner" },
        stats: [
          { value: "30", ar: "علامة تجارية +", en: "Brands +" },
          { value: "94", ar: "رضا العملاء %", en: "Client satisfaction %" },
        ],
      },
      {
        id: "ads",
        eyebrow: { ar: "حملات أداء بأرقام تتكلّم عن نفسها", en: "Performance ads with numbers that speak" },
        titleAr: <>إعلانات <span className="marker-line px-2">مدروسة</span> <span className="text-gradient">تجلب عملاء حقيقيين</span></>,
        titleEn: <>Smart ads that bring <span className="marker-line px-2">real</span> <span className="text-gradient">paying customers</span></>,
        kineticAr: ["إعلانات", "مدروسة", "تجلب", "عملاء", "حقيقيين"],
        kineticEn: ["Smart", "ads", "that", "convert"],
        body: {
          ar: "نستهدف الفئة الصحيحة على Meta و Google و TikTok بأكثر الطرق فعالية — تتبّع دقيق للتحويلات وتحسين أسبوعي يضمن أعلى عائد على الاستثمار (ROI).",
          en: "We reach the right audience on Meta, Google and TikTok with precise conversion tracking and weekly optimization for maximum ROI.",
        },
        primary: { ar: "احجز استشارة مجانية", en: "Book a free audit", href: buildHref(locale, "/contact") },
        secondary: { ar: "خدمات الإعلانات", en: "Performance services", href: buildHref(locale, "/services/performance") },
        hugeWord: { ar: "أداء", en: "ADS" },
        image: heroAdsPerformance,
        badge: { icon: TrendingUp, ar: "ROAS 4.8x متوسط", en: "Avg. 4.8x ROAS" },
        stats: [
          { value: "4.8", ar: "متوسط ROAS x", en: "Avg ROAS x" },
          { value: "62", ar: "خفض كلفة الاكتساب %", en: "Lower CPA %" },
        ],
      },
      {
        id: "brand",
        eyebrow: { ar: "هوية بصرية ومواقع تصنع الفارق", en: "Brand identity & websites that win" },
        titleAr: <>نبني <span className="marker-line px-2">علامتك</span> <span className="text-gradient">من الأساس حتى الإطلاق</span></>,
        titleEn: <>We build your <span className="marker-line px-2">brand</span> <span className="text-gradient">from foundation to launch</span></>,
        kineticAr: ["نبني", "علامتك", "من", "الأساس", "حتى", "الإطلاق"],
        kineticEn: ["From", "brand", "to", "website", "to", "launch"],
        body: {
          ar: "شعار وهوية بصرية، موقع إلكتروني سريع ومتوافق مع كل الأجهزة، ومحتوى يعبّر عن قيمك — كل ذلك تحت سقف وكالة واحدة بمنهجية واضحة وضمان جودة.",
          en: "Logo and visual identity, a fast responsive website, and content that reflects your values — all under one roof with a clear methodology and quality guarantee.",
        },
        primary: { ar: "ابدأ مشروعك", en: "Start your project", href: buildHref(locale, "/contact") },
        secondary: { ar: "أعمالنا", en: "Our work", href: buildHref(locale, "/case-studies") },
        hugeWord: { ar: "إبداع", en: "CREATIVE" },
        image: heroBrandCreative,
        badge: { icon: Rocket, ar: "+30 علامة موثوقة", en: "30+ trusted brands" },
        stats: [
          { value: "30", ar: "علامة تجارية +", en: "Brands +" },
          { value: "8", ar: "قطاعات نخدمها", en: "Industries served" },
        ],
      },
    ],
    [locale, t, buildHref],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  // Auto-advance with pause on hover/focus + reduced motion
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setTimeout(next, SLIDE_DURATION);
    return () => window.clearTimeout(id);
  }, [index, paused, reduceMotion, next]);

  // Keyboard nav
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") (isAr ? prev : next)();
    else if (e.key === "ArrowLeft") (isAr ? next : prev)();
    else if (e.key === " ") { e.preventDefault(); setPaused((p) => !p); }
  };

  const slide = slides[index];
  const Badge = slide.badge.icon;
  const kinetic = isAr ? slide.kineticAr : slide.kineticEn;

  return (
    <section
      className="relative isolate overflow-hidden bg-gradient-hero"
      aria-roledescription="carousel"
      aria-label={isAr ? "شرائح تعريفية بالوكالة" : "Hero slides"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKey}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 48) (dx > 0 ? (isAr ? next : prev) : (isAr ? prev : next))();
        touchStart.current = null;
      }}
      tabIndex={0}
    >
      <GlowOrbs />
      <SocialRail />

      {/* Soft grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" aria-hidden />

      <div className="container-app relative z-10 grid items-center gap-12 pb-12 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-12">
        {/* LEFT — kinetic text */}
        <div key={`txt-${slide.id}`} className="relative min-h-[28rem] md:min-h-[32rem] lg:min-h-[36rem]">
          <span className="hs-fade-in inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur" style={{ animationDelay: "60ms" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {isAr ? slide.eyebrow.ar : slide.eyebrow.en}
          </span>

          {/* Kinetic typography — words rise individually */}
          <h1 className="display-1 mt-6 text-[2.6rem] text-ink md:text-[3.6rem] lg:text-[4.6rem]" aria-live="polite">
            <span className="sr-only">{kinetic.join(" ")}</span>
            <span aria-hidden className="block leading-[1.05]">
              {kinetic.map((w, i) => (
                <span key={`${slide.id}-${i}`} className="overflow-hidden inline-block align-bottom me-[0.25em]">
                  <span className="hs-word inline-block" style={{ animationDelay: `${120 + i * 90}ms` }}>
                    {i === 1 ? <span className="marker-line px-2">{w}</span> : i === kinetic.length - 1 ? <span className="text-gradient">{w}</span> : w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p className="hs-fade-in mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg" style={{ animationDelay: "320ms" }}>
            {isAr ? slide.body.ar : slide.body.en}
          </p>

          <div className="hs-fade-in mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "420ms" }}>
            <PillButton to={slide.primary.href} iconLeft>
              {isAr ? slide.primary.ar : slide.primary.en}
            </PillButton>
            <PillButton to={slide.secondary.href} variant="outline">
              {isAr ? slide.secondary.ar : slide.secondary.en}
            </PillButton>
          </div>

          {/* Trust */}
          <div className="hs-fade-in mt-12 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "520ms" }}>
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-background shadow-soft"
                    style={{
                      backgroundImage: `linear-gradient(135deg, oklch(${0.55 + i * 0.04} 0.22 ${275 + i * 8}) 0%, oklch(${0.7 + i * 0.02} 0.18 ${290 + i * 6}) 100%)`,
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <span className="ms-1 text-sm font-bold text-foreground">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">{isAr ? "+30 علامة سعيدة" : "30+ happy brands"}</p>
              </div>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-soft backdrop-blur">
              <Badge className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground">{isAr ? slide.badge.ar : slide.badge.en}</span>
            </div>
          </div>
        </div>

        {/* RIGHT — image with ken-burns + crossfade */}
        <div className="relative pb-24 md:pb-0">
          <div
            className="relative mx-auto aspect-[4/5] w-full max-w-md"
            style={{ contain: "layout paint" }}
          >
            {!reduceMotion && (
              <Sparkle className="absolute -top-6 -start-2 z-10 animate-glow-pulse" size={36} />
            )}

            {/* Crossfade stack — clean frame, minimal elevation */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[2rem] bg-card shadow-soft"
            >
              {slides.map((s, i) => (
                <img
                  key={s.id}
                  src={s.image}
                  alt={isAr ? "خبير تسويق رقمي سعودي" : "Saudi digital marketing expert"}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ease-out ${
                    i === index ? `opacity-100 ${reduceMotion ? "" : "hs-ken-burns"}` : "opacity-0"
                  }`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  decoding="async"
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 28rem, (min-width: 768px) 22rem, 90vw"
                  aria-hidden={i !== index}
                />
              ))}
            </div>

          </div>

          {/* Floating stat card — anchored to the image side (left in LTR / right in RTL) */}
          <div
            className="pointer-events-none absolute z-20 inset-x-0 -bottom-2 flex justify-center md:inset-x-auto md:bottom-10 md:justify-start md:[inset-inline-start:-2rem] lg:md:[inset-inline-start:-3rem]"
            aria-label={isAr ? "إحصائيات المشاريع 2025" : "Project statistics 2025"}
          >
            <div
              key={`stat-${slide.id}`}
              className={`pointer-events-auto hs-fade-in ${reduceMotion ? "" : "animate-float"}`}
            >
              <FloatingStatCard
                title={isAr ? "إحصائيات المشاريع 2025" : "Project Statistic 2025"}
                stats={slide.stats.map((st) => ({ value: st.value, label: isAr ? st.ar : st.en }))}
              />
            </div>
          </div>

          {/* JSON-LD: Organization with aggregate project stats for richer SERP */}
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: isAr ? "فكرة للتسويق الرقمي" : "Fikra Digital Marketing",
                url: "https://fikradm.lovable.app",
                description: isAr
                  ? "وكالة تسويق رقمي مرخّصة في السعودية — استراتيجيات تسويق وأداء وعلامة تجارية."
                  : "Licensed Saudi digital marketing agency — strategy, performance and brand.",
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.9",
                  reviewCount: "150",
                  bestRating: "5",
                  worstRating: "1",
                },
                makesOffer: slides.map((s) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: isAr ? s.eyebrow.ar : s.eyebrow.en,
                  },
                })),
                additionalProperty: slide.stats.map((st) => ({
                  "@type": "PropertyValue",
                  name: isAr ? st.ar : st.en,
                  value: st.value,
                })),
              }),
            }}
          />
        </div>
      </div>

      {/* Controls + indicators */}
      <div className="container-app relative z-20 -mt-2 flex items-center justify-between pb-6 md:pb-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isAr ? next : prev}
            aria-label={isAr ? "الشريحة التالية" : "Previous slide"}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white/85 text-ink shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5 rtl:hidden" />
            <ChevronRight className="hidden h-5 w-5 rtl:block" />
          </button>
          <button
            type="button"
            onClick={isAr ? prev : next}
            aria-label={isAr ? "الشريحة السابقة" : "Next slide"}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white/85 text-ink shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white"
          >
            <ChevronRight className="h-5 w-5 rtl:hidden" />
            <ChevronLeft className="hidden h-5 w-5 rtl:block" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? (isAr ? "تشغيل" : "Play") : (isAr ? "إيقاف" : "Pause")}
            aria-pressed={paused}
            className="ms-1 grid h-10 w-10 place-items-center rounded-full border border-border bg-white/85 text-ink shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>

        {/* Indicators with progress bar on active */}
        <div role="tablist" aria-label={isAr ? "اختيار الشريحة" : "Select slide"} className="flex items-center gap-2">
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={active}
                aria-label={`${isAr ? "الشريحة" : "Slide"} ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`group relative h-2 overflow-hidden rounded-full bg-border transition-all ${active ? "w-14" : "w-6 hover:w-9"}`}
              >
                {active && !paused && !reduceMotion && (
                  <span
                    key={`p-${index}`}
                    className="hs-progress-fill absolute inset-0 block bg-primary"
                    style={{ ["--hs-duration" as string]: `${SLIDE_DURATION}ms` }}
                  />
                )}
                {active && (paused || reduceMotion) && (
                  <span className="absolute inset-0 block bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <HugeWordBackdrop text={isAr ? slide.hugeWord.ar : slide.hugeWord.en} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" aria-hidden />
    </section>
  );
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduce;
}
