import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { GlowOrbs } from "./cinematic/GlowOrbs";
import { HugeWordBackdrop } from "./cinematic/HugeWordBackdrop";
import { FloatingStatCard } from "./cinematic/FloatingStatCard";
import { SocialRail } from "./cinematic/SocialRail";
import { PillButton } from "./cinematic/PillButton";
import { Sparkle } from "./cinematic/Sparkle";
import heroSaudiMarketer from "@/assets/hero-saudi-marketer.jpg";

export function HeroSlider() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative isolate overflow-hidden bg-gradient-hero">
      <GlowOrbs />
      <SocialRail />

      {/* Soft grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" aria-hidden />

      <div className="container-app relative z-10 grid items-center gap-12 pb-12 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-12">
        {/* LEFT — Smart Reveal on text only; image stays eager for LCP */}
        <div className="relative animate-fade-up smart-reveal smart-reveal--stagger">
          <span className="sr-item inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {isAr ? "وكالة تسويق رقمي مرخّصة في السعودية" : "Licensed digital marketing agency in KSA"}
          </span>

          <h1 className="sr-item display-1 mt-6 text-[2.6rem] text-ink md:text-[3.6rem] lg:text-[4.6rem]">
            {isAr ? (
              <>
                استراتيجيات تسويق
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 marker-line px-2">فعّالة</span>
                </span>{" "}
                <span className="text-gradient">وعالية الأثر</span>
              </>
            ) : (
              <>
                Cost-Effective and
                <br />
                Impactful{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 marker-line px-2">Marketing</span>
                </span>{" "}
                <span className="text-gradient">Strategies</span>
              </>
            )}
          </h1>

          <p className="sr-item mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            {isAr
              ? "نقدّم استراتيجيات مبتكرة ونتائج موثّقة لمساعدة الشركات على النمو والريادة في الأسواق التنافسية — لأكثر من 150 علامة تجارية في الخليج."
              : "Innovative strategies and proven results to help businesses thrive and lead in competitive markets — for 150+ Gulf brands."}
          </p>

          <div className="sr-item mt-9 flex flex-wrap items-center gap-3">
            <PillButton to={buildHref(locale, "/contact")} iconLeft>
              {t("cta.primary")}
            </PillButton>
            <PillButton to={buildHref(locale, "/case-studies")} variant="outline">
              {isAr ? "شاهد قصص نجاحنا" : "Watch success stories"}
            </PillButton>
          </div>

          {/* Trust */}
          <div className="sr-item mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
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
                <p className="text-xs text-muted-foreground">{isAr ? "+150 عميل سعيد" : "150+ happy clients"}</p>
              </div>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <div className="text-sm font-bold tabular-nums text-foreground">SAR 12M+</div>
              <p className="text-xs text-muted-foreground">{isAr ? "ميزانيات إعلانية مُدارة" : "Managed ad spend"}</p>
            </div>
          </div>
        </div>

        {/* RIGHT — image + floating stat card.
            Aspect-ratio reserves space → no CLS while LCP image loads. */}
        <div className="relative">
          <div
            className="relative mx-auto aspect-[4/5] w-full max-w-md"
            style={{ contain: "layout paint" }}
          >
            {/* Sparkle decoration */}
            <Sparkle className="absolute -top-6 -start-2 z-10 animate-glow-pulse" size={36} />

            {/* Conic ring */}
            <div
              className="absolute -inset-4 rounded-[2.5rem] opacity-25 blur-2xl"
              style={{ background: "var(--gradient-brand)" }}
              aria-hidden
            />
            <div
              className="absolute inset-0 rounded-[2.25rem] p-[2px] ring-conic animate-spin-slow [mask:linear-gradient(white,white)_content-box,linear-gradient(white,white)] [mask-composite:exclude]"
              aria-hidden
            />

            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-elegant">
              <img
                src={heroSaudiMarketer}
                alt={isAr ? "خبير تسويق رقمي سعودي بالزي التقليدي" : "Saudi digital marketing expert in traditional attire"}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1024}
                height={1280}
              />
            </div>

            {/* Floating stat card top-end */}
            <div className="absolute -end-6 top-12 hidden md:block animate-float">
              <FloatingStatCard
                title={isAr ? "إحصائيات المشاريع 2025" : "Project Statistic 2025"}
                stats={[
                  { value: "84", label: isAr ? "عملاء سعداء %" : "Happy Client %" },
                  { value: "87", label: isAr ? "نجاح المشاريع %" : "Project Success %" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Huge backdrop word */}
      <HugeWordBackdrop text={isAr ? "تسويق" : "MARKETING"} />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" aria-hidden />
    </section>
  );
}
