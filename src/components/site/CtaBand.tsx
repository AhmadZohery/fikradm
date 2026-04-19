import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Phone } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export function CtaBand() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section">
      <div className="container-app">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-gradient-dark p-10 text-white shadow-elegant md:p-16 lg:p-20">
          {/* Texture & glow */}
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" aria-hidden />
          <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -start-16 h-96 w-96 rounded-full bg-gold/25 blur-3xl" aria-hidden />

          <div className="relative grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {isAr ? "ابدأ نموك اليوم" : "Start your growth today"}
              </span>
              <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {isAr ? (
                  <>
                    جاهز لتحويل تسويقك
                    <br />
                    إلى <span className="text-gradient-gold">محرك نمو</span> حقيقي؟
                  </>
                ) : (
                  <>
                    Ready to turn marketing
                    <br /> into a <span className="text-gradient-gold">real growth engine</span>?
                  </>
                )}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                {isAr
                  ? "احجز استشارة استراتيجية مجانية مدتها 30 دقيقة — نحلل وضعك الحالي ونعطيك خطة عمل ملموسة خلال 48 ساعة."
                  : "Book a free 30-minute strategy call — we'll analyze your situation and deliver a concrete action plan within 48 hours."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={buildHref(locale, "/contact")}
                  className="group inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-elegant transition hover:bg-gold hover:text-gold-foreground"
                >
                  {t("cta.primary")}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
                <a
                  href="tel:+966500000000"
                  className="inline-flex h-13 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  {isAr ? "اتصل الآن" : "Call now"}
                </a>
              </div>
            </div>

            {/* Right — guarantee badge */}
            <div className="relative grid place-items-center">
              <div className="absolute inset-0 ring-conic animate-spin-slow rounded-full opacity-30 blur-2xl" aria-hidden />
              <div className="relative grid h-56 w-56 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur md:h-64 md:w-64">
                <div className="text-center">
                  <div className="font-serif text-6xl font-bold text-gold md:text-7xl">48h</div>
                  <div className="mt-2 px-4 text-xs font-semibold uppercase tracking-widest text-white/80">
                    {isAr ? "خطة عمل في يومين" : "Action plan in 2 days"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
