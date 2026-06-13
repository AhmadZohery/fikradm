import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "../cinematic/SectionEyebrow";
import { CountUp } from "../cinematic/CountUp";
import { TrendingUp, ArrowUpRight } from "lucide-react";

type Result = {
  client: { ar: string; en: string };
  industry: { ar: string; en: string };
  metric: { value: number; suffix: string; label: { ar: string; en: string } };
  duration: { ar: string; en: string };
};

const RESULTS: Record<string, Result[]> = {
  seo: [
    { client: { ar: "سيناريو: تجارة إلكترونية", en: "Scenario: E-commerce" }, industry: { ar: "تجزئة", en: "Retail" }, metric: { value: 150, suffix: "%+", label: { ar: "هدف نمو الزيارات العضوية", en: "target organic traffic growth" } }, duration: { ar: "خلال 6–9 شهور", en: "over 6–9 months" } },
    { client: { ar: "سيناريو: قطاع صحي", en: "Scenario: Healthcare" }, industry: { ar: "صحة", en: "Healthcare" }, metric: { value: 3, suffix: "x", label: { ar: "هدف نمو الحجوزات العضوية", en: "target organic bookings lift" } }, duration: { ar: "خلال 6 شهور", en: "over 6 months" } },
    { client: { ar: "سيناريو: منصة B2B", en: "Scenario: B2B platform" }, industry: { ar: "تقنية", en: "Tech" }, metric: { value: 80, suffix: "%+", label: { ar: "هدف نمو طلبات العرض", en: "target demo requests growth" } }, duration: { ar: "خلال 9–12 شهر", en: "over 9–12 months" } },
  ],
  performance: [
    { client: { ar: "سيناريو: تجارة إلكترونية", en: "Scenario: E-commerce" }, industry: { ar: "أزياء/تجزئة", en: "Fashion/Retail" }, metric: { value: 3, suffix: "x+", label: { ar: "هدف ROAS بعد التحسين", en: "target ROAS after optimisation" } }, duration: { ar: "خلال 60–90 يوم", en: "within 60–90 days" } },
    { client: { ar: "سيناريو: توليد عملاء", en: "Scenario: Lead generation" }, industry: { ar: "عقار/خدمات", en: "Real estate / Services" }, metric: { value: 30, suffix: "%+", label: { ar: "هدف خفض تكلفة العميل المحتمل", en: "target drop in cost per lead" } }, duration: { ar: "خلال 90 يوم", en: "within 90 days" } },
    { client: { ar: "سيناريو: تطبيقات", en: "Scenario: Mobile apps" }, industry: { ar: "تطبيقات", en: "Apps" }, metric: { value: 25, suffix: "%+", label: { ar: "هدف خفض تكلفة التنزيل", en: "target drop in cost per install" } }, duration: { ar: "خلال 90 يوم", en: "within 90 days" } },
  ],
  creative: [
    { client: { ar: "سيناريو: إعادة هوية", en: "Scenario: Rebrand" }, industry: { ar: "علامات استهلاكية", en: "Consumer brands" }, metric: { value: 2, suffix: "x+", label: { ar: "هدف تفاعل السوشيال", en: "target social engagement" } }, duration: { ar: "بعد إعادة الهوية", en: "post rebrand" } },
    { client: { ar: "سيناريو: حملة فيديو", en: "Scenario: Video campaign" }, industry: { ar: "مطاعم/تجزئة", en: "F&B / Retail" }, metric: { value: 1, suffix: "M+", label: { ar: "هدف مشاهدات لحملة فيديو واحدة", en: "target views per video campaign" } }, duration: { ar: "في 30 يوم", en: "in 30 days" } },
    { client: { ar: "سيناريو: تحديث الكرييتيف", en: "Scenario: Creative refresh" }, industry: { ar: "خدمات رقمية", en: "Digital services" }, metric: { value: 30, suffix: "%+", label: { ar: "هدف رفع نسبة النقر للإعلان", en: "target ad CTR uplift" } }, duration: { ar: "بعد التحديث", en: "post refresh" } },
  ],
  web: [
    { client: { ar: "سيناريو: إعادة تصميم متجر", en: "Scenario: Store redesign" }, industry: { ar: "تجزئة", en: "Retail" }, metric: { value: 25, suffix: "%+", label: { ar: "هدف رفع معدل التحويل", en: "target conversion rate lift" } }, duration: { ar: "بعد إعادة التصميم", en: "post redesign" } },
    { client: { ar: "سيناريو: موقع مؤسسي", en: "Scenario: Corporate site" }, industry: { ar: "تعليم/خدمات", en: "Education / Services" }, metric: { value: 90, suffix: "+/100", label: { ar: "هدف Lighthouse على الموبايل", en: "target mobile Lighthouse score" } }, duration: { ar: "في الإطلاق", en: "at launch" } },
    { client: { ar: "سيناريو: تحسين الأداء", en: "Scenario: Performance tuning" }, industry: { ar: "تجارة إلكترونية", en: "E-commerce" }, metric: { value: 2, suffix: "s−", label: { ar: "هدف وقت تحميل الصفحة", en: "target page load time" } }, duration: { ar: "بعد التحسين", en: "post optimisation" } },
  ],
  social: [
    { client: { ar: "سيناريو: نمو عضوي", en: "Scenario: Organic growth" }, industry: { ar: "FMCG", en: "FMCG" }, metric: { value: 50, suffix: "K+", label: { ar: "هدف متابعين جدد عضوياً", en: "target new organic followers" } }, duration: { ar: "خلال 6 شهور", en: "over 6 months" } },
    { client: { ar: "سيناريو: تفاعل أعلى", en: "Scenario: Higher engagement" }, industry: { ar: "أزياء", en: "Fashion" }, metric: { value: 3, suffix: "x", label: { ar: "هدف Engagement Rate مقابل القطاع", en: "target engagement vs industry" } }, duration: { ar: "خلال 3–4 شهور", en: "over 3–4 months" } },
    { client: { ar: "سيناريو: وصول عضوي", en: "Scenario: Organic reach" }, industry: { ar: "تطبيقات", en: "Apps" }, metric: { value: 1, suffix: "M+", label: { ar: "هدف Reach عضوي شهري", en: "target monthly organic reach" } }, duration: { ar: "خلال 6–12 شهر", en: "over 6–12 months" } },
  ],
  content: [
    { client: { ar: "سيناريو: محتوى B2B", en: "Scenario: B2B content" }, industry: { ar: "SaaS", en: "SaaS" }, metric: { value: 100, suffix: "%+", label: { ar: "هدف نمو زوار المحتوى", en: "target content traffic growth" } }, duration: { ar: "خلال 9–12 شهر", en: "over 9–12 months" } },
    { client: { ar: "سيناريو: محتوى استشاري", en: "Scenario: Thought leadership" }, industry: { ar: "خدمات", en: "Services" }, metric: { value: 2, suffix: "x+", label: { ar: "هدف عملاء محتملين عضوياً", en: "target organic monthly leads" } }, duration: { ar: "بعد عام", en: "after one year" } },
    { client: { ar: "سيناريو: دلائل منتجات", en: "Scenario: Product guides" }, industry: { ar: "تجزئة", en: "Retail" }, metric: { value: 15, suffix: "%+", label: { ar: "هدف رفع متوسط قيمة الطلب", en: "target AOV lift" } }, duration: { ar: "خلال 4–6 شهور", en: "over 4–6 months" } },
  ],
};

export function ServiceResults({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const items = RESULTS[slug] ?? RESULTS.seo;

  return (
    <section className="section bg-surface-soft">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>{isAr ? "نطاقات أداء توضيحية" : "Illustrative performance ranges"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  ما الذي نستهدفه عادة في
                  <span className="marker-line px-2"> هذه الخدمة</span>
                </>
              ) : (
                <>
                  What we typically{" "}
                  <span className="marker-line px-2">target</span> here
                </>
              )}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground md:max-w-xs md:text-end">
            {isAr
              ? "نماذج توضيحية وفق معدلات الصناعة ومنهجية عملنا — وليست التزامًا بنتائج محددة."
              : "Illustrative benchmarks based on industry data and our methodology — not a guarantee of specific outcomes."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((r, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--svc)" }} />
                {isAr ? r.industry.ar : r.industry.en}
              </div>
              <div className="mt-1 text-base font-bold text-ink">{isAr ? r.client.ar : r.client.en}</div>

              <div className="mt-6 flex items-baseline gap-2">
                <TrendingUp className="h-6 w-6" style={{ color: "var(--svc)" }} />
                <div className="text-5xl font-black tabular-nums leading-none text-ink md:text-6xl">
                  <CountUp to={r.metric.value} />{r.metric.suffix}
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{isAr ? r.metric.label.ar : r.metric.label.en}</p>
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? r.duration.ar : r.duration.en}</p>

              <span
                className="absolute -end-10 -top-10 h-28 w-28 rounded-full opacity-10 transition group-hover:scale-150"
                style={{ background: "var(--svc)" }}
                aria-hidden
              />
              <ArrowUpRight
                className="absolute end-5 top-5 h-5 w-5 opacity-40 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100 rtl:rotate-90"
                style={{ color: "var(--svc)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
