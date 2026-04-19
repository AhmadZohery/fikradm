import { useLocale } from "@/i18n/useLocale";
import { Reveal } from "./Reveal";
import { Search, FileText, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Search,
    num: "01",
    title: { ar: "اكتشاف وتحليل", en: "Discover & Analyze" },
    desc: {
      ar: "نغوص في عملك، السوق، والمنافسين لنفهم نقطة الانطلاق الحقيقية.",
      en: "We dive into your business, market, and competitors to find the real starting point.",
    },
  },
  {
    icon: FileText,
    num: "02",
    title: { ar: "خطة استراتيجية", en: "Strategic Roadmap" },
    desc: {
      ar: "نبني خارطة طريق واضحة بأهداف KPI قابلة للقياس وميزانية ذكية.",
      en: "We build a clear roadmap with measurable KPIs and a smart budget.",
    },
  },
  {
    icon: Rocket,
    num: "03",
    title: { ar: "تنفيذ متعدد القنوات", en: "Multi-channel Execution" },
    desc: {
      ar: "نطلق الحملات والمحتوى والتطوير بتنسيق محكم بين فرقنا المتخصصة.",
      en: "We launch campaigns, content, and development with tight team coordination.",
    },
  },
  {
    icon: BarChart3,
    num: "04",
    title: { ar: "قياس وتحسين", en: "Measure & Optimize" },
    desc: {
      ar: "تقارير شفافة شهرية + تحسين مستمر يضاعف العائد كل ربع.",
      en: "Transparent monthly reports + ongoing optimization that compounds returns each quarter.",
    },
  },
];

export function ProcessSection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section relative overflow-hidden bg-gradient-dark text-white">
      {/* Decorative */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-50" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-15 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-24 start-1/4 h-80 w-80 rounded-full bg-primary/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 end-1/4 h-80 w-80 rounded-full bg-gold/20 blur-3xl" aria-hidden />

      <div className="container-app relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {isAr ? "كيف نعمل" : "How we work"}
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {isAr ? "منهجية مدروسة في 4 خطوات" : "A deliberate 4-step methodology"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
              {isAr
                ? "لا نرتجل. كل عميل يمر بنفس النظام المنضبط الذي أثبت نجاحه مع +150 علامة تجارية."
                : "We don't improvise. Every client follows the same disciplined system proven across 150+ brands."}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.num} delay={i * 100}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="pointer-events-none absolute end-0 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-white/30 to-transparent lg:block rtl:rotate-180" aria-hidden />
                  )}

                  <div className="flex items-start justify-between">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary-glow">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-serif text-5xl font-bold tabular-nums text-white/10 transition group-hover:text-gold/30">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">{s.title[locale]}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">{s.desc[locale]}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
