import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import { BeforeAfter } from "./cinematic/BeforeAfter";
import { CountUp } from "./cinematic/CountUp";
import beforeImg from "@/assets/before-website.jpg";
import afterImg from "@/assets/after-website.jpg";

export function HomeBeforeAfter() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section bg-surface-soft">
      <div className="container-app">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow>{isAr ? "قبل وبعد" : "Before & After"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  الفرق
                  <span className="marker-line px-2"> الذي نصنعه</span> — مرئي بالعين
                </>
              ) : (
                <>
                  The difference we make — <span className="marker-line px-2">visible</span> in pixels
                </>
              )}
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-muted-foreground">
              {isAr
                ? "اسحب الشريط لترى نموذجاً توضيحياً لتحوّل موقع قبل وبعد إعادة التصميم. كل بكسل مدروس لرفع التحويلات."
                : "Drag the slider to see an illustrative website transformation before and after a redesign. Every pixel engineered to lift conversions."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="text-3xl font-black text-ink">KPI</div>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {isAr ? "هدف رفع معدل التحويل بحسب الاتفاق" : "Conversion lift per engagement"}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="text-3xl font-black text-ink">Core Web Vitals</div>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {isAr ? "هدف اجتياز معايير الأداء على الموبايل" : "Mobile performance targets"}
                </p>
              </div>
            </div>
          </div>
          <BeforeAfter
            beforeSrc={beforeImg}
            afterSrc={afterImg}
            beforeAlt={isAr ? "موقع قديم بطيء وغير مُحوِّل" : "Old slow non-converting site"}
            afterAlt={isAr ? "تصميم جديد سريع وعالي التحويل" : "New fast high-converting design"}
            beforeLabel={isAr ? "قبل" : "Before"}
            afterLabel={isAr ? "بعد" : "After"}
          />
        </div>
      </div>
    </section>
  );
}
