import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n/useLocale";
import { ArrowUpRight, Sparkles, CheckCircle2, Phone } from "lucide-react";
import { GlowOrbs } from "./cinematic/GlowOrbs";

export function CtaBand() {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";

  const promises = isAr
    ? ["استشارة 30 دقيقة بدون التزام", "خطة عمل مخصصة في 48 ساعة", "تقرير تدقيق رقمي مجاني"]
    : ["30-min consultation, no strings", "Custom action plan in 48 hours", "Free digital audit report"];

  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-brand p-8 text-white shadow-elegant md:p-14">
          <GlowOrbs variant="primary" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" aria-hidden />
          <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -start-24 -bottom-24 h-80 w-80 rounded-full bg-gold/30 blur-3xl" aria-hidden />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                {isAr ? "متاحون لاستقبال 3 عملاء فقط هذا الشهر" : "Open for 3 new clients this month"}
              </span>

              <h2 className="mt-5 text-3xl font-black leading-[1.1] md:text-5xl">
                {isAr ? (
                  <>
                    اتركنا نبني لك <span className="bg-white/20 px-2 italic">خطة نمو</span>
                    <br />
                    تستحق وقتك وميزانيتك.
                  </>
                ) : (
                  <>
                    Let us craft a <span className="bg-white/20 px-2 italic">growth plan</span>
                    <br />
                    worth your time and budget.
                  </>
                )}
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/85 md:text-lg">
                {isAr
                  ? "لا قوالب جاهزة. نحلّل عملك، نقترح أفضل المنصات والميزانية، ونرسم لك خارطة طريق واضحة قبل أي التزام."
                  : "No templates. We analyze your business, recommend the best platforms and budget, and draw a clear roadmap — before any commitment."}
              </p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {promises.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-pop md:p-8">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/70">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  {isAr ? "ابدأ خلال دقيقة" : "Start in a minute"}
                </div>
                <div className="mt-4 grid gap-3">
                  <Link
                    to={buildHref(locale, "/contact")}
                    className="group inline-flex items-center justify-between gap-2 rounded-2xl bg-white py-4 ps-5 pe-2 text-sm font-bold text-primary shadow-pop transition hover:scale-[1.02]"
                  >
                    {t("cta.primary")}
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white transition group-hover:rotate-[-45deg]">
                      <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
                    </span>
                  </Link>
                  <a
                    href="tel:+966500000000"
                    className="group inline-flex items-center justify-between gap-2 rounded-2xl border border-white/30 bg-white/5 py-4 ps-5 pe-5 text-sm font-bold text-white transition hover:bg-white/15"
                    dir="ltr"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      +966 50 000 0000
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                      {isAr ? "اتصال مباشر" : "Direct call"}
                    </span>
                  </a>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-white/15 pt-4">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {["#fbbf24", "#f472b6", "#60a5fa", "#34d399"].map((c, i) => (
                      <span
                        key={i}
                        className="grid h-8 w-8 place-items-center rounded-full border-2 border-white/40 text-[11px] font-bold text-ink"
                        style={{ background: c }}
                      >
                        {["KA", "NZ", "MQ", "RS"][i]}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-white/85">
                    <div className="font-bold">+200 {isAr ? "علامة" : "brands"}</div>
                    <div className="text-white/60">{isAr ? "بدأت معنا هذا العام" : "started with us this year"}</div>
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
