import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n/useLocale";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { GlowOrbs } from "./cinematic/GlowOrbs";

export function CtaBand() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-brand p-10 text-white md:p-16">
          <GlowOrbs variant="primary" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" aria-hidden />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {isAr ? "ابدأ نموك معنا" : "Start growing today"}
              </span>
              <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                {isAr
                  ? "جاهز ترفع نتائجك التسويقية لمستوى آخر؟"
                  : "Ready to take your marketing to the next level?"}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/85 md:text-lg">
                {isAr
                  ? "احجز استشارتك المجانية الآن، وفريقنا هيرجع لك خلال 24 ساعة بخطة مخصصة لعملك."
                  : "Book your free consultation. Our team will get back within 24 hours with a custom plan."}
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Link
                to={buildHref(locale, "/contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-white py-3.5 ps-7 pe-2 text-sm font-bold text-primary shadow-pop transition hover:scale-[1.02]"
              >
                {t("cta.primary")}
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white transition group-hover:rotate-[-45deg]">
                  <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
                </span>
              </Link>
              <Link
                to={buildHref(locale, "/case-studies")}
                className="text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
              >
                {isAr ? "أو شاهد قصص نجاحنا" : "Or see our success stories"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
