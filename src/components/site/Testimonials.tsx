import { useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

const testimonials = [
  {
    quoteAr: "خلال 6 أشهر فقط، نمت مبيعات متجرنا بنسبة 240%، وكلفة اكتساب العميل انخفضت إلى الثلث. فريق احترافي يفهم عمق السوق الخليجي.",
    quoteEn: "In just 6 months, our store sales grew 240% and CAC dropped to a third. A pro team that truly understands the Gulf market.",
    nameAr: "خالد العتيبي", nameEn: "Khalid Al-Otaibi",
    roleAr: "مؤسس متجر Luxe & Co", roleEn: "Founder, Luxe & Co",
    initials: "KA", color: "#a78bfa",
    metric: "+240%", metricLabelAr: "نمو المبيعات", metricLabelEn: "Sales growth",
  },
  {
    quoteAr: "حملاتنا الإعلانية الجديدة حققت ROAS بمعدل 5.8x مع شفافية كاملة في التقارير. الفرق ملحوظ من اليوم الأول.",
    quoteEn: "Our new ad campaigns hit 5.8x ROAS with full reporting transparency. The difference was clear from day one.",
    nameAr: "نوف الزهراني", nameEn: "Nouf Al-Zahrani",
    roleAr: "مدير تسويق سلسلة عيادات", roleEn: "Marketing Director, Clinic Network",
    initials: "NZ", color: "#f472b6",
    metric: "5.8x", metricLabelAr: "ROAS", metricLabelEn: "ROAS",
  },
  {
    quoteAr: "موقعنا الجديد رفع التحويلات 3 أضعاف وأصبح أسرع من المنافسين بكل المقاييس. تجربة مستخدم استثنائية حقاً.",
    quoteEn: "Our new site tripled conversions and outperformed competitors on all speed metrics. Truly exceptional UX.",
    nameAr: "محمد القرني", nameEn: "Mohammed Al-Qarni",
    roleAr: "Co-founder، شركة عقارية", roleEn: "Co-founder, Real Estate Co",
    initials: "MQ", color: "#60a5fa",
    metric: "x3", metricLabelAr: "التحويلات", metricLabelEn: "Conversions",
  },
  {
    quoteAr: "أخيراً وكالة تكتب نسخ إعلانية بفهم حقيقي للسوق السعودي. كل حملة تأتي بأعلى من المتوقع.",
    quoteEn: "Finally an agency that writes copy with real understanding of the Saudi market. Every campaign overdelivers.",
    nameAr: "ريم الفهد", nameEn: "Reem Al-Fahd",
    roleAr: "مديرة تسويق F&B", roleEn: "Marketing Manager, F&B Group",
    initials: "RF", color: "#34d399",
    metric: "+820%", metricLabelAr: "نمو المتابعين", metricLabelEn: "Follower growth",
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
