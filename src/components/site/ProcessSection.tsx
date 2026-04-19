import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import { Sparkle } from "./cinematic/Sparkle";

const steps = [
  { n: "01", titleAr: "الاكتشاف والتحليل", titleEn: "Discover & Audit", descAr: "ندرس عملك ومنافسيك وعميلك المثالي لنبني خريطة طريق دقيقة.", descEn: "Deep dive into your business, competitors and ideal customer." },
  { n: "02", titleAr: "الاستراتيجية", titleEn: "Strategy", descAr: "خطة قنوات وميزانية ومحتوى مع KPIs قابلة للقياس.", descEn: "Channel mix, budget and content plan with measurable KPIs." },
  { n: "03", titleAr: "التنفيذ", titleEn: "Execution", descAr: "إطلاق الحملات والكرييتيف والمحتوى بفريق متخصص.", descEn: "Launch campaigns, creative and content with specialists." },
  { n: "04", titleAr: "القياس والتطوير", titleEn: "Measure & Iterate", descAr: "تقارير شفافة وتحسين مستمر مبني على البيانات.", descEn: "Transparent reporting and continuous data-driven optimization." },
];

export function ProcessSection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section relative overflow-hidden bg-surface-soft">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      <Sparkle className="absolute end-10 top-10 animate-glow-pulse" size={40} />

      <div className="container-app relative">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{isAr ? "كيف نعمل" : "How we work"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
            {isAr ? (
              <>منهجية واضحة من <span className="text-gradient">الفكرة</span> إلى النتيجة</>
            ) : (
              <>A clear methodology from <span className="text-gradient">idea</span> to result</>
            )}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {isAr
              ? "أربع مراحل احترافية تضمن تنفيذاً سلساً ونتائج قابلة للقياس."
              : "Four professional phases ensuring smooth execution and measurable outcomes."}
          </p>
        </div>

        <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden className="absolute inset-x-8 top-12 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
          {steps.map((s, i) => (
            <div key={s.n} className="card-elevated group relative rounded-3xl p-7">
              <div className="relative mb-5">
                <span className="text-6xl font-black text-primary/10">{s.n}</span>
                <span className="absolute end-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-soft">
                  {String(i + 1)}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-ink">{isAr ? s.titleAr : s.titleEn}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{isAr ? s.descAr : s.descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
