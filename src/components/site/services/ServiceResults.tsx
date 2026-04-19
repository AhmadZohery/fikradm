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
    { client: { ar: "متجر تجزئة سعودي", en: "Saudi retail brand" }, industry: { ar: "تجارة إلكترونية", en: "E-commerce" }, metric: { value: 412, suffix: "%", label: { ar: "زيادة في الزيارات العضوية", en: "organic traffic growth" } }, duration: { ar: "خلال 8 شهور", en: "in 8 months" } },
    { client: { ar: "عيادة طبية بالرياض", en: "Riyadh medical clinic" }, industry: { ar: "صحة", en: "Healthcare" }, metric: { value: 28, suffix: "x", label: { ar: "ضعف في الحجوزات الشهرية", en: "monthly bookings increase" } }, duration: { ar: "خلال 6 شهور", en: "in 6 months" } },
    { client: { ar: "منصة B2B تقنية", en: "B2B tech platform" }, industry: { ar: "تقنية", en: "Tech" }, metric: { value: 156, suffix: "%", label: { ar: "نمو في الـ Demo Requests", en: "demo requests growth" } }, duration: { ar: "خلال سنة", en: "within a year" } },
  ],
  performance: [
    { client: { ar: "متجر أزياء", en: "Fashion brand" }, industry: { ar: "أزياء", en: "Fashion" }, metric: { value: 7, suffix: ".2x", label: { ar: "ROAS على ميزانية 80 ألف ر.س", en: "ROAS on SAR 80K spend" } }, duration: { ar: "في الشهر الأول", en: "in month one" } },
    { client: { ar: "شركة عقارات", en: "Real estate firm" }, industry: { ar: "عقار", en: "Real estate" }, metric: { value: 64, suffix: "%", label: { ar: "انخفاض في تكلفة الـ Lead", en: "drop in cost per lead" } }, duration: { ar: "خلال 3 شهور", en: "in 3 months" } },
    { client: { ar: "تطبيق توصيل", en: "Delivery app" }, industry: { ar: "تطبيقات", en: "Apps" }, metric: { value: 240, suffix: "K", label: { ar: "تنزيل بتكلفة 2.8 ر.س فقط", en: "installs at SAR 2.8 each" } }, duration: { ar: "خلال 90 يوم", en: "in 90 days" } },
  ],
  creative: [
    { client: { ar: "علامة تجميل", en: "Beauty brand" }, industry: { ar: "تجميل", en: "Beauty" }, metric: { value: 312, suffix: "%", label: { ar: "زيادة في تفاعل السوشيال", en: "social engagement lift" } }, duration: { ar: "بعد إعادة الهوية", en: "post rebrand" } },
    { client: { ar: "سلسلة مطاعم", en: "Restaurant chain" }, industry: { ar: "مطاعم", en: "F&B" }, metric: { value: 4, suffix: "M", label: { ar: "مشاهدة لحملة فيديو واحدة", en: "views on one video campaign" } }, duration: { ar: "في 30 يوم", en: "in 30 days" } },
    { client: { ar: "تطبيق فينتك", en: "Fintech app" }, industry: { ar: "فينتك", en: "Fintech" }, metric: { value: 86, suffix: "%", label: { ar: "ارتفاع نسبة النقر للإعلان", en: "ad CTR uplift" } }, duration: { ar: "بعد إعادة الكرييتيف", en: "post-creative refresh" } },
  ],
  web: [
    { client: { ar: "متجر مجوهرات", en: "Jewelry store" }, industry: { ar: "تجزئة فاخرة", en: "Luxury retail" }, metric: { value: 47, suffix: "%", label: { ar: "زيادة في معدل التحويل", en: "conversion rate lift" } }, duration: { ar: "بعد إعادة التصميم", en: "post redesign" } },
    { client: { ar: "منصة تعليمية", en: "EdTech platform" }, industry: { ar: "تعليم", en: "Education" }, metric: { value: 99, suffix: "/100", label: { ar: "Lighthouse Score على الموبايل", en: "mobile Lighthouse score" } }, duration: { ar: "في الإطلاق", en: "at launch" } },
    { client: { ar: "متجر إلكتروني", en: "E-commerce store" }, industry: { ar: "تجارة", en: "Retail" }, metric: { value: 1, suffix: ".4s", label: { ar: "متوسط وقت تحميل الصفحة", en: "avg page load time" } }, duration: { ar: "بعد التحسين", en: "post optimization" } },
  ],
  social: [
    { client: { ar: "علامة عربية", en: "Arabic brand" }, industry: { ar: "FMCG", en: "FMCG" }, metric: { value: 280, suffix: "K", label: { ar: "متابع جديد عضوياً", en: "new organic followers" } }, duration: { ar: "خلال 6 شهور", en: "in 6 months" } },
    { client: { ar: "علامة موضة", en: "Fashion brand" }, industry: { ar: "أزياء", en: "Fashion" }, metric: { value: 18, suffix: "%", label: { ar: "Engagement Rate (الصناعة 2%)", en: "engagement rate (industry 2%)" } }, duration: { ar: "ثابت لـ 4 شهور", en: "sustained 4 months" } },
    { client: { ar: "تطبيق محلي", en: "Local app" }, industry: { ar: "تطبيقات", en: "Apps" }, metric: { value: 12, suffix: "M", label: { ar: "Reach عضوي شهري", en: "monthly organic reach" } }, duration: { ar: "بعد عام واحد", en: "after one year" } },
  ],
  content: [
    { client: { ar: "منصة B2B", en: "B2B platform" }, industry: { ar: "SaaS", en: "SaaS" }, metric: { value: 340, suffix: "%", label: { ar: "نمو في الزوار من المحتوى", en: "content-driven traffic growth" } }, duration: { ar: "خلال 9 شهور", en: "in 9 months" } },
    { client: { ar: "علامة استشارية", en: "Consulting brand" }, industry: { ar: "خدمات", en: "Services" }, metric: { value: 5, suffix: "x", label: { ar: "ليدز شهرية بدون ميزانية إعلان", en: "monthly leads with zero ad spend" } }, duration: { ar: "بعد سنة", en: "after one year" } },
    { client: { ar: "متجر إلكتروني", en: "Online store" }, industry: { ar: "تجزئة", en: "Retail" }, metric: { value: 62, suffix: "%", label: { ar: "زيادة AOV عبر دلائل المنتجات", en: "AOV lift via product guides" } }, duration: { ar: "خلال 4 شهور", en: "in 4 months" } },
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
            <SectionEyebrow>{isAr ? "نتائج حقيقية" : "Real results"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  أرقام نفخر بها لـ
                  <span className="marker-line px-2"> عملائنا</span>
                </>
              ) : (
                <>
                  Numbers we delivered for{" "}
                  <span className="marker-line px-2">our clients</span>
                </>
              )}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground md:max-w-xs md:text-end">
            {isAr ? "كل رقم مُوثق بتقارير وحملات حقيقية." : "Every number is backed by real reports and campaigns."}
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
