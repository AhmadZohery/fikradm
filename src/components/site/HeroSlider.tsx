import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, PlayCircle, Star } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export function HeroSlider() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative isolate overflow-hidden bg-gradient-hero">
      {/* Decorative mesh + grid */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-90" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute -top-40 start-1/3 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-[120px] animate-float" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 end-0 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px] animate-float [animation-delay:1.5s]" aria-hidden />

      <div className="container-app relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-32">
        {/* Left — editorial copy */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {isAr ? "وكالة تسويق رقمي مرخّصة في السعودية" : "Licensed digital marketing agency in KSA"}
          </span>

          <h1 className="display-1 mt-6 text-[2.6rem] text-ink md:text-[3.6rem] lg:text-[4.4rem]">
            {isAr ? (
              <>
                نحوّل <span className="text-gradient">فكرتك</span>
                <br />
                إلى نتائج
                <span className="relative inline-block">
                  <span className="relative z-10"> تسويقية</span>
                  <svg className="absolute -bottom-2 start-0 h-3 w-full text-gold" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                    <path d="M2 8 Q 50 1 100 6 T 198 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
                <br />
                حقيقية ومُقاسة
              </>
            ) : (
              <>
                We turn your <span className="text-gradient">ideas</span>
                <br />
                into measurable
                <span className="relative inline-block">
                  <span className="relative z-10"> growth</span>
                  <svg className="absolute -bottom-2 start-0 h-3 w-full text-gold" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                    <path d="M2 8 Q 50 1 100 6 T 198 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            {isAr
              ? "فريق متخصص في السيو، إعلانات الأداء، والإنتاج الإبداعي — يخدم أكثر من 150 علامة تجارية في الخليج بنتائج موثّقة."
              : "A specialist team in SEO, performance ads, and creative production — serving 150+ Gulf brands with proven results."}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to={buildHref(locale, "/contact")}
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:shadow-glow"
            >
              <Sparkles className="h-4 w-4" />
              {t("cta.primary")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              to={buildHref(locale, "/case-studies")}
              className="inline-flex h-13 items-center gap-2 rounded-full border border-border/80 bg-background/70 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary/40 hover:bg-background"
            >
              <PlayCircle className="h-4 w-4" />
              {isAr ? "شاهد قصص نجاحنا" : "Watch success stories"}
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary-glow shadow-soft"
                    style={{ backgroundImage: `linear-gradient(135deg, oklch(${0.55 + i * 0.04} 0.22 ${275 + i * 8}) 0%, oklch(${0.7 + i * 0.02} 0.18 ${290 + i * 6}) 100%)` }}
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

        {/* Right — editorial image collage */}
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            {/* Conic gradient ring frame */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-brand opacity-20 blur-2xl" aria-hidden />
            <div className="absolute inset-0 rounded-[2.25rem] p-[2px] ring-conic animate-spin-slow [mask:linear-gradient(white,white)_content-box,linear-gradient(white,white)] [mask-composite:exclude]" aria-hidden />

            {/* Main image */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=85"
                alt={isAr ? "فريق فكرة" : "Fikra team"}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-baseline justify-between text-white">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/70">
                      {isAr ? "متوسط نمو الإيرادات" : "Avg revenue lift"}
                    </div>
                    <div className="mt-0.5 text-2xl font-extrabold tabular-nums">+220%</div>
                  </div>
                  <div className="rounded-full bg-gold/90 px-2.5 py-1 text-[11px] font-bold text-gold-foreground">
                    Q1 2025
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat card top-end */}
            <div className="absolute -end-4 top-8 hidden rounded-2xl border border-border bg-card/95 p-3.5 shadow-elegant backdrop-blur md:block animate-float">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-gold-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">ROAS</div>
                  <div className="text-lg font-extrabold tabular-nums text-foreground">x4.5</div>
                </div>
              </div>
            </div>

            {/* Floating bottom-start */}
            <div className="absolute -start-6 bottom-12 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-elegant backdrop-blur md:block animate-float [animation-delay:1s]">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{isAr ? "حملات نشطة" : "Active campaigns"}</div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-xl font-extrabold tabular-nums text-foreground">87</span>
                <span className="text-xs font-semibold text-success">+12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" aria-hidden />
    </section>
  );
}
