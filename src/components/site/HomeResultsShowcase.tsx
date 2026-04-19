import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";
import { TrendingUp, ShoppingBag, Heart, Building2, GraduationCap, Utensils, ArrowUpRight } from "lucide-react";

type Story = {
  industry: { ar: string; en: string };
  client: { ar: string; en: string };
  icon: typeof TrendingUp;
  metric: string;
  metricLabel: { ar: string; en: string };
  summary: { ar: string; en: string };
  tags: { ar: string[]; en: string[] };
  duration: { ar: string; en: string };
};

const STORIES: Story[] = [
  {
    industry: { ar: "تجارة إلكترونية", en: "E-commerce" },
    client: { ar: "متجر Luxe & Co", en: "Luxe & Co Store" },
    icon: ShoppingBag,
    metric: "+240%",
    metricLabel: { ar: "نمو مبيعات في 6 شهور", en: "Sales growth in 6 months" },
    summary: {
      ar: "إعادة هيكلة الإعلانات + تحسين CRO للصفحات + إطلاق برنامج ولاء.",
      en: "Ads restructure + CRO on key pages + a loyalty program launch.",
    },
    tags: { ar: ["Meta Ads", "CRO", "Email"], en: ["Meta Ads", "CRO", "Email"] },
    duration: { ar: "6 أشهر", en: "6 months" },
  },
  {
    industry: { ar: "قطاع طبي", en: "Healthcare" },
    client: { ar: "شبكة عيادات Smile+", en: "Smile+ Clinics" },
    icon: Heart,
    metric: "5.8x",
    metricLabel: { ar: "ROAS عبر منصات Meta و Google", en: "ROAS across Meta & Google" },
    summary: {
      ar: "بناء قمع إعلاني كامل + كرييتيف يومي + Conversions API.",
      en: "Full-funnel ads + daily creative + Conversions API setup.",
    },
    tags: { ar: ["Performance", "Creative"], en: ["Performance", "Creative"] },
    duration: { ar: "4 أشهر", en: "4 months" },
  },
  {
    industry: { ar: "عقاري", en: "Real Estate" },
    client: { ar: "مجموعة Reside KSA", en: "Reside KSA Group" },
    icon: Building2,
    metric: "x3",
    metricLabel: { ar: "ليدز مؤهّلة شهرياً", en: "Qualified monthly leads" },
    summary: {
      ar: "صفحات هبوط مخصصة + حملات Google + سيو محلي للمشاريع.",
      en: "Custom landing pages + Google Ads + local SEO per project.",
    },
    tags: { ar: ["SEO", "Landing", "Google"], en: ["SEO", "Landing", "Google"] },
    duration: { ar: "9 أشهر", en: "9 months" },
  },
  {
    industry: { ar: "أكاديمي", en: "Education" },
    client: { ar: "أكاديمية Riseed", en: "Riseed Academy" },
    icon: GraduationCap,
    metric: "−63%",
    metricLabel: { ar: "انخفاض كلفة اكتساب الطالب", en: "Drop in cost per student" },
    summary: {
      ar: "إعادة بناء قمع التسجيل + كرييتيف فيديو + إعلانات تيك توك.",
      en: "Funnel rebuild + video creative + TikTok ads.",
    },
    tags: { ar: ["TikTok", "Funnel"], en: ["TikTok", "Funnel"] },
    duration: { ar: "5 أشهر", en: "5 months" },
  },
  {
    industry: { ar: "مطاعم وضيافة", en: "F&B" },
    client: { ar: "سلسلة مطاعم Olea", en: "Olea Restaurants" },
    icon: Utensils,
    metric: "+820%",
    metricLabel: { ar: "متابعون جدد على إنستجرام", en: "New Instagram followers" },
    summary: {
      ar: "هوية بصرية محدّثة + إنتاج محتوى أسبوعي + شراكات مؤثرين.",
      en: "Refreshed identity + weekly content production + creator partnerships.",
    },
    tags: { ar: ["Branding", "Social"], en: ["Branding", "Social"] },
    duration: { ar: "8 أشهر", en: "8 months" },
  },
  {
    industry: { ar: "B2B / SaaS", en: "B2B / SaaS" },
    client: { ar: "منصة FlowOps", en: "FlowOps Platform" },
    icon: TrendingUp,
    metric: "+412%",
    metricLabel: { ar: "زيارات عضوية في 9 شهور", en: "Organic traffic in 9 months" },
    summary: {
      ar: "استراتيجية محتوى Topical Authority + سيو تقني + بناء روابط آمن.",
      en: "Topical authority content + technical SEO + safe link building.",
    },
    tags: { ar: ["SEO", "Content"], en: ["SEO", "Content"] },
    duration: { ar: "9 أشهر", en: "9 months" },
  },
];

export function HomeResultsShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="section relative overflow-hidden bg-gradient-soft">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      <div className="container-app relative">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>{isAr ? "نتائج بالأرقام" : "Results, by the numbers"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  أرقام <span className="marker-line px-2">حقيقية</span> من عملاء حقيقيين
                </>
              ) : (
                <>
                  <span className="marker-line px-2">Real numbers</span> from real clients
                </>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              {isAr
                ? "ست قصص مختصرة من قطاعات مختلفة — ما الذي فعلناه، وكم استغرق، وما النتيجة الفعلية."
                : "Six short stories across different industries — what we did, how long it took, and the actual outcome."}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={i}
                className="group relative isolate overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-elegant"
              >
                <span aria-hidden className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-gradient-primary opacity-0 blur-3xl transition duration-700 group-hover:opacity-20" />

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Icon className="h-3 w-3" />
                    {s.industry[locale]}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {s.duration[locale]}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="text-5xl font-black tabular-nums text-gradient md:text-6xl">
                    {s.metric}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-muted-foreground">
                    {s.metricLabel[locale]}
                  </div>
                </div>

                <div className="mt-5 border-t border-dashed border-border pt-4">
                  <div className="text-sm font-bold text-ink">{s.client[locale]}</div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {s.summary[locale]}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags[locale].map((t, ti) => (
                      <span
                        key={ti}
                        className="rounded-full bg-surface-soft px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100 rtl:rotate-90" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
