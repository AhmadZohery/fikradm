import { useLocale } from "@/i18n/useLocale";
import { CountUp } from "./cinematic/CountUp";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

const items = [
  { to: 220, suffix: "%", labelAr: "متوسط نمو الإيرادات", labelEn: "Avg revenue lift" },
  { to: 5, suffix: "x", labelAr: "عائد الإعلان", labelEn: "Return on ad spend" },
  { to: 150, suffix: "+", labelAr: "علامة تجارية", labelEn: "Brands served" },
  { to: 12, suffix: "M+", labelAr: "ميزانيات مُدارة (ر.س)", labelEn: "Managed ad spend (SAR)" },
];

export function StatsBand() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section-tight relative overflow-hidden">
      <div className="container-app">
        <div className="mb-10 text-center">
          <SectionEyebrow>{isAr ? "أرقام تتحدث" : "Numbers that talk"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            {isAr ? "نتائج موثّقة لعملائنا" : "Documented client results"}
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <div key={i} className="group relative bg-card p-8 transition hover:bg-primary-soft/40">
              <div className="text-4xl font-black tabular-nums text-ink md:text-5xl">
                <span className="text-gradient">
                  <CountUp to={s.to} suffix={s.suffix} />
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                {isAr ? s.labelAr : s.labelEn}
              </p>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-brand transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
