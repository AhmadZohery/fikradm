import { useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

const testimonials = [
  {
    quoteAr: "منهجية واضحة وتقارير شفافة أسبوعيًا — قرارات التسويق صارت مبنية على بيانات بدل التخمين.",
    quoteEn: "A clear methodology and weekly transparent reports — marketing decisions are now data-driven instead of guesswork.",
    nameAr: "عميل في قطاع التجارة الإلكترونية", nameEn: "E-commerce client",
    roleAr: "بإذن العميل سيُكشف الاسم لاحقاً", roleEn: "Name shared upon client approval",
    initials: "EC", color: "#a78bfa",
    metric: "KPIs", metricLabelAr: "مؤشرات متفق عليها", metricLabelEn: "Agreed KPIs",
  },
  {
    quoteAr: "إعادة هيكلة الحملات وفق قمع واضح خلت الميزانية تشتغل أفضل بكثير، والتقارير سهلة للقراءة لفريق الإدارة.",
    quoteEn: "Restructuring campaigns around a clear funnel made the budget work harder and reports became easy for leadership to read.",
    nameAr: "عميل في القطاع الصحي", nameEn: "Healthcare client",
    roleAr: "بإذن العميل سيُكشف الاسم لاحقاً", roleEn: "Name shared upon client approval",
    initials: "HC", color: "#f472b6",
    metric: "—", metricLabelAr: "نتائج بحسب الاتفاق", metricLabelEn: "Outcomes per engagement",
  },
  {
    quoteAr: "الموقع الجديد سريع، نظيف، وعلى قد القطاع. ملاحظات العملاء تحسنت بوضوح وتقدر تقيس الفرق بمقاييس الأداء.",
    quoteEn: "The new site is fast, clean, and tailored to the sector. Customer feedback is clearly better and the lift is measurable.",
    nameAr: "عميل في القطاع العقاري", nameEn: "Real estate client",
    roleAr: "بإذن العميل سيُكشف الاسم لاحقاً", roleEn: "Name shared upon client approval",
    initials: "RE", color: "#60a5fa",
    metric: "Web", metricLabelAr: "تطوير + UX", metricLabelEn: "Web + UX",
  },
  {
    quoteAr: "أخيراً فريق يكتب بنبرة السوق السعودي ويفهم سلوك الجمهور، بدل النسخ الجاهزة المترجمة.",
    quoteEn: "Finally a team that writes in a real Saudi tone and understands the audience, instead of generic translated copy.",
    nameAr: "عميل في قطاع المطاعم", nameEn: "F&B client",
    roleAr: "بإذن العميل سيُكشف الاسم لاحقاً", roleEn: "Name shared upon client approval",
    initials: "FB", color: "#34d399",
    metric: "Brand", metricLabelAr: "كتابة وكرييتيف", metricLabelEn: "Copy & creative",
  },
];

export function Testimonials() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];

  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section relative overflow-hidden bg-surface-soft">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" aria-hidden />
      <div className="container-app relative">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{isAr ? "آراء عملائنا" : "Client voices"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
            {isAr ? "نتائج تتحدث عن نفسها" : "Results that speak for themselves"}
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Quote card */}
          <article
            key={idx}
            className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-elegant animate-fade-up md:p-12"
          >
            <span aria-hidden className="absolute -end-10 -top-10 h-48 w-48 rounded-full bg-gradient-primary opacity-10 blur-3xl" />
            <Quote className="absolute end-8 top-8 h-16 w-16 text-primary/10" strokeWidth={1.5} />

            <div className="relative">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ms-2 text-xs font-semibold text-muted-foreground">5.0</span>
              </div>

              <p className="mt-5 font-serif text-2xl leading-relaxed text-ink md:text-[28px] md:leading-[1.45]">
                "{isAr ? t.quoteAr : t.quoteEn}"
              </p>

              <div className="mt-8 flex items-center gap-4 border-t border-dashed border-border pt-6">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-base font-black text-ink"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </span>
                <div className="flex-1">
                  <div className="font-bold text-ink">{isAr ? t.nameAr : t.nameEn}</div>
                  <div className="text-sm text-muted-foreground">{isAr ? t.roleAr : t.roleEn}</div>
                </div>
              </div>
            </div>
          </article>

          {/* Side card: metric + nav + thumbs */}
          <div className="flex flex-col gap-4">
            <div
              key={`m-${idx}`}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-brand p-8 text-center text-white shadow-pop animate-fade-up"
            >
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" aria-hidden />
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-widest text-white/70">
                  {isAr ? "النتيجة" : "The result"}
                </div>
                <div className="mt-3 text-6xl font-black tabular-nums md:text-7xl">{t.metric}</div>
                <div className="mt-2 text-sm font-semibold text-white/85">
                  {isAr ? t.metricLabelAr : t.metricLabelEn}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
              <button
                onClick={prev}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/40"}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
