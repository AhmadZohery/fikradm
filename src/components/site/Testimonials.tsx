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
    metric: "+240%", metricLabelAr: "نمو المبيعات", metricLabelEn: "Sales growth",
  },
  {
    quoteAr: "حملاتنا الإعلانية الجديدة حققت ROAS بمعدل 5.8x مع شفافية كاملة في التقارير. الفرق ملحوظ من اليوم الأول.",
    quoteEn: "Our new ad campaigns hit 5.8x ROAS with full reporting transparency. The difference was clear from day one.",
    nameAr: "نوف الزهراني", nameEn: "Nouf Al-Zahrani",
    roleAr: "مدير تسويق سلسلة عيادات", roleEn: "Marketing Director, Clinic Network",
    metric: "5.8x", metricLabelAr: "ROAS", metricLabelEn: "ROAS",
  },
  {
    quoteAr: "موقعنا الجديد رفع التحويلات 3 أضعاف وأصبح أسرع من المنافسين بكل المقاييس. تجربة مستخدم استثنائية حقاً.",
    quoteEn: "Our new site tripled conversions and outperformed competitors on all speed metrics. Truly exceptional UX.",
    nameAr: "محمد القرني", nameEn: "Mohammed Al-Qarni",
    roleAr: "Co-founder, شركة عقارية", roleEn: "Co-founder, Real Estate Co",
    metric: "x3", metricLabelAr: "التحويلات", metricLabelEn: "Conversions",
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

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative rounded-3xl border border-border bg-card p-8 shadow-card md:p-12">
            <Quote className="absolute -top-5 start-8 h-10 w-10 rounded-2xl bg-primary p-2 text-white shadow-soft" />
            <p className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
              "{isAr ? t.quoteAr : t.quoteEn}"
            </p>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <div className="font-bold text-ink">{isAr ? t.nameAr : t.nameEn}</div>
                <div className="text-sm text-muted-foreground">{isAr ? t.roleAr : t.roleEn}</div>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="rounded-3xl bg-gradient-brand p-8 text-center text-white shadow-elegant">
              <div className="text-5xl font-black tabular-nums">{t.metric}</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/80">
                {isAr ? t.metricLabelAr : t.metricLabelEn}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={prev} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-primary" aria-label="Previous">
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <span className="text-sm font-semibold tabular-nums text-muted-foreground">{idx + 1} / {testimonials.length}</span>
              <button onClick={next} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-primary" aria-label="Next">
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
