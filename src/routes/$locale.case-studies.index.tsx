import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { useLocale } from "@/i18n/useLocale";
import { Reveal } from "@/components/site/Reveal";
import { SectionEyebrow } from "@/components/site/cinematic/SectionEyebrow";
import { ArrowUpRight, TrendingUp, ShoppingBag, Heart, Building2, GraduationCap, Utensils, Plane, Sparkles, Quote } from "lucide-react";

export const Route = createFileRoute("/$locale/case-studies/")({
  head: ({ params }) => {
    const ar = params.locale === "ar";
    return {
      meta: [
        { title: ar ? "قصص النجاح والبورتفوليو | فكرة" : "Case Studies & Portfolio | Fikra" },
        { name: "description", content: ar ? "أعمال حقيقية ونتائج موثّقة لأكثر من 200 علامة تجارية في الخليج." : "Real work and verified results from 200+ Gulf brands." },
      ],
    };
  },
  component: CaseStudiesIndex,
});

type Industry = "ecommerce" | "healthcare" | "real-estate" | "education" | "fnb" | "travel" | "saas";

type CaseStudy = {
  slug: string;
  industry: Industry;
  industryLabel: { ar: string; en: string };
  client: { ar: string; en: string };
  title: { ar: string; en: string };
  summary: { ar: string; en: string };
  cover: string;
  accent: string; // gradient
  metrics: { value: string; label: { ar: string; en: string } }[];
  services: string[];
  duration: { ar: string; en: string };
  featured?: boolean;
};

const STUDIES: CaseStudy[] = [
  {
    slug: "luxe-co",
    industry: "ecommerce",
    industryLabel: { ar: "تجارة إلكترونية", en: "E-commerce" },
    client: { ar: "متجر Luxe & Co", en: "Luxe & Co" },
    title: {
      ar: "كيف ضاعفنا مبيعات متجر فاخر 2.4× في 6 شهور",
      en: "How we 2.4×’d a luxury store’s sales in 6 months",
    },
    summary: {
      ar: "إعادة هيكلة كاملة للحملات + تحسين CRO على صفحات المنتج + برنامج ولاء.",
      en: "Full ad restructure + CRO on product pages + a loyalty program.",
    },
    cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
    accent: "from-fuchsia-500 to-violet-600",
    metrics: [
      { value: "+240%", label: { ar: "نمو المبيعات", en: "Sales growth" } },
      { value: "−68%", label: { ar: "كلفة الاكتساب", en: "CAC drop" } },
      { value: "4.6×", label: { ar: "ROAS", en: "ROAS" } },
    ],
    services: ["Meta Ads", "CRO", "Email"],
    duration: { ar: "6 أشهر", en: "6 months" },
    featured: true,
  },
  {
    slug: "smile-clinics",
    industry: "healthcare",
    industryLabel: { ar: "قطاع طبي", en: "Healthcare" },
    client: { ar: "شبكة عيادات Smile+", en: "Smile+ Clinics" },
    title: {
      ar: "ROAS 5.8× لشبكة عيادات أسنان عبر قمع متكامل",
      en: "5.8× ROAS for a dental network via a full funnel",
    },
    summary: { ar: "بناء قمع كامل + كرييتيف يومي + Conversions API.", en: "Full funnel + daily creative + Conversions API." },
    cover: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
    accent: "from-rose-500 to-pink-600",
    metrics: [
      { value: "5.8×", label: { ar: "ROAS", en: "ROAS" } },
      { value: "+312%", label: { ar: "حجوزات", en: "Bookings" } },
    ],
    services: ["Performance", "Creative"],
    duration: { ar: "4 أشهر", en: "4 months" },
  },
  {
    slug: "reside-ksa",
    industry: "real-estate",
    industryLabel: { ar: "عقاري", en: "Real Estate" },
    client: { ar: "Reside KSA", en: "Reside KSA" },
    title: {
      ar: "3× ليدز عقارية شهرياً عبر سيو محلي وحملات Google",
      en: "3× monthly real-estate leads via local SEO + Google",
    },
    summary: { ar: "صفحات هبوط لكل مشروع + سيو محلي + حملات Google.", en: "Per-project landing pages + local SEO + Google campaigns." },
    cover: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    accent: "from-blue-500 to-cyan-600",
    metrics: [
      { value: "x3", label: { ar: "ليدز شهرية", en: "Monthly leads" } },
      { value: "−42%", label: { ar: "كلفة الليد", en: "Cost per lead" } },
    ],
    services: ["SEO", "Landing", "Google"],
    duration: { ar: "9 أشهر", en: "9 months" },
  },
  {
    slug: "riseed",
    industry: "education",
    industryLabel: { ar: "أكاديمي", en: "Education" },
    client: { ar: "أكاديمية Riseed", en: "Riseed Academy" },
    title: { ar: "−63% كلفة اكتساب الطالب عبر تيك توك", en: "−63% cost per student via TikTok" },
    summary: { ar: "إعادة بناء قمع التسجيل + كرييتيف فيديو + إعلانات تيك توك.", en: "Funnel rebuild + video creative + TikTok ads." },
    cover: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1600&q=80",
    accent: "from-amber-500 to-orange-600",
    metrics: [
      { value: "−63%", label: { ar: "كلفة الطالب", en: "Cost per student" } },
      { value: "+186%", label: { ar: "تسجيلات", en: "Sign-ups" } },
    ],
    services: ["TikTok", "Funnel"],
    duration: { ar: "5 أشهر", en: "5 months" },
  },
  {
    slug: "olea",
    industry: "fnb",
    industryLabel: { ar: "مطاعم وضيافة", en: "F&B" },
    client: { ar: "سلسلة Olea", en: "Olea Restaurants" },
    title: { ar: "+820% متابعون جدد بإنتاج محتوى أسبوعي", en: "+820% follower growth with weekly content" },
    summary: { ar: "هوية بصرية محدّثة + إنتاج محتوى أسبوعي + شراكات مؤثرين.", en: "Refreshed identity + weekly content + creator partnerships." },
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    accent: "from-emerald-500 to-teal-600",
    metrics: [
      { value: "+820%", label: { ar: "متابعون", en: "Followers" } },
      { value: "12M+", label: { ar: "مشاهدات", en: "Views" } },
    ],
    services: ["Branding", "Social"],
    duration: { ar: "8 أشهر", en: "8 months" },
  },
  {
    slug: "flowops",
    industry: "saas",
    industryLabel: { ar: "B2B / SaaS", en: "B2B / SaaS" },
    client: { ar: "منصة FlowOps", en: "FlowOps" },
    title: { ar: "+412% زيارات عضوية في 9 شهور", en: "+412% organic traffic in 9 months" },
    summary: { ar: "محتوى Topical Authority + سيو تقني + بناء روابط آمن.", en: "Topical authority content + technical SEO + safe link building." },
    cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    accent: "from-indigo-500 to-purple-600",
    metrics: [
      { value: "+412%", label: { ar: "زيارات عضوية", en: "Organic traffic" } },
      { value: "#1", label: { ar: "كلمات تنافسية", en: "Top rankings" } },
    ],
    services: ["SEO", "Content"],
    duration: { ar: "9 أشهر", en: "9 months" },
  },
  {
    slug: "horizon-travel",
    industry: "travel",
    industryLabel: { ar: "سياحة", en: "Travel" },
    client: { ar: "Horizon Travel", en: "Horizon Travel" },
    title: { ar: "−51% كلفة الحجز عبر إعادة بناء صفحات الهبوط", en: "−51% cost per booking via landing page rebuild" },
    summary: { ar: "صفحات هبوط محسنة + سيو دولي + Email automation.", en: "Optimized landings + international SEO + email automation." },
    cover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
    accent: "from-sky-500 to-blue-600",
    metrics: [
      { value: "−51%", label: { ar: "كلفة الحجز", en: "Cost per booking" } },
      { value: "x2.7", label: { ar: "حجوزات", en: "Bookings" } },
    ],
    services: ["CRO", "SEO", "Email"],
    duration: { ar: "7 أشهر", en: "7 months" },
  },
];

const INDUSTRY_ICONS: Record<Industry, typeof TrendingUp> = {
  ecommerce: ShoppingBag,
  healthcare: Heart,
  "real-estate": Building2,
  education: GraduationCap,
  fnb: Utensils,
  travel: Plane,
  saas: TrendingUp,
};

function CaseStudiesIndex() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const featured = STUDIES.find((s) => s.featured) ?? STUDIES[0];
  const rest = STUDIES.filter((s) => s.slug !== featured.slug);

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "قصص النجاح" : "Case Studies" }]} />

      {/* Hero */}
      <section className="section-tight relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-40" aria-hidden />
        <div className="container-app relative">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {isAr ? "أعمال موثّقة" : "Verified work"}
              </span>
              <h1 className="mt-5 text-4xl font-black leading-[1.1] md:text-6xl">
                {isAr ? (
                  <>
                    قصص نجاح <span className="text-gradient">تتحدث بالأرقام</span>،
                    <br />
                    لا بالكلمات.
                  </>
                ) : (
                  <>
                    Success stories <span className="text-gradient">that speak</span>
                    <br />
                    in numbers, not words.
                  </>
                )}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
                {isAr
                  ? "+200 علامة تجارية في الخليج اختارت فكرة. هذه عيّنة من النتائج الحقيقية في قطاعات مختلفة."
                  : "200+ Gulf brands chose Fikra. Below is a sample of real, measurable outcomes across industries."}
              </p>

              {/* Big stats */}
              <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { v: "+200", l: { ar: "علامة تجارية", en: "Brands" } },
                  { v: "+28M", l: { ar: "ريال إعلانات مدارة", en: "Managed ad spend" } },
                  { v: "4.9/5", l: { ar: "تقييم العملاء", en: "Client rating" } },
                  { v: "97%", l: { ar: "نسبة الاحتفاظ", en: "Retention" } },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
                    <div className="text-2xl font-black text-gradient md:text-3xl">{s.v}</div>
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{s.l[locale]}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured case */}
      <section className="section-tight">
        <div className="container-app">
          <Reveal>
            <Link
              to="/$locale/case-studies"
              params={{ locale }}
              className="group relative grid overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-elegant lg:grid-cols-[1.2fr_1fr]"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <img
                  src={featured.cover}
                  alt={featured.client[locale]}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${featured.accent} opacity-30 mix-blend-multiply`} />
                <span className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                  <Sparkles className="h-3 w-3" /> {isAr ? "قصة مميّزة" : "Featured"}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  {featured.industryLabel[locale]} · {featured.duration[locale]}
                </div>
                <h2 className="mt-3 text-2xl font-black leading-tight md:text-4xl">
                  {featured.title[locale]}
                </h2>
                <p className="mt-4 text-muted-foreground">{featured.summary[locale]}</p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {featured.metrics.map((m, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-surface-soft p-3 text-center">
                      <div className="text-2xl font-black tabular-nums text-gradient">{m.value}</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{m.label[locale]}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {featured.services.map((s) => (
                      <span key={s} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    {isAr ? "قراءة القصة" : "Read story"}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-90" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="section-tight">
        <div className="container-app">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <SectionEyebrow>{isAr ? "كل القصص" : "All stories"}</SectionEyebrow>
                <h2 className="mt-3 text-2xl font-extrabold md:text-4xl">
                  {isAr ? "تصفّح كل أعمالنا" : "Browse all our work"}
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((c, i) => {
              const Icon = INDUSTRY_ICONS[c.industry];
              return (
                <Reveal key={c.slug} delay={i * 60}>
                  <Link
                    to="/$locale/case-studies"
                    params={{ locale }}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-elegant"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={c.cover}
                        alt={c.client[locale]}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <span className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${c.accent} opacity-25 transition duration-500 group-hover:opacity-40 mix-blend-multiply`} />
                      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
                      <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                        <Icon className="h-3 w-3" /> {c.industryLabel[locale]}
                      </span>
                      <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2">
                        {c.metrics.slice(0, 2).map((m, mi) => (
                          <div key={mi} className="rounded-xl border border-white/20 bg-white/10 p-2 text-center backdrop-blur-md">
                            <div className="text-xl font-black tabular-nums text-white">{m.value}</div>
                            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80">{m.label[locale]}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-ink transition group-hover:text-primary">
                        {c.title[locale]}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {c.summary[locale]}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-4">
                        <div className="flex flex-wrap gap-1">
                          {c.services.slice(0, 2).map((s) => (
                            <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                              {s}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {c.duration[locale]}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote callout */}
      <section className="section-tight">
        <div className="container-app">
          <Reveal>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/5 to-card p-10 text-center md:p-14">
              <Quote className="mx-auto h-10 w-10 text-primary/30" />
              <p className="mt-4 font-serif text-2xl leading-relaxed text-ink md:text-3xl">
                {isAr
                  ? "كل قصة هنا بدأت بمكالمة استشارة مجانية. القصة التالية ممكن تكون قصتك."
                  : "Every story here started with a free consultation. The next one could be yours."}
              </p>
              <Link
                to="/$locale/contact"
                params={{ locale }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-pop transition hover:scale-[1.02]"
              >
                {isAr ? "ابدأ قصتك اليوم" : "Start your story today"}
                <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </SiteLayout>
  );
}
