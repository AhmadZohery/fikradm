import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { StatsBand } from "@/components/site/StatsBand";
import { CtaBand } from "@/components/site/CtaBand";
import { Testimonials } from "@/components/site/Testimonials";
import { TrustStrip } from "@/components/site/cinematic/TrustStrip";
import { LogosStrip } from "@/components/site/LogosStrip";
import { useLocale } from "@/i18n/useLocale";
import { Target, Heart, Award, Users, ShieldCheck, BadgeCheck, MapPin, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import heroSaudiMarketer from "@/assets/hero-saudi-marketer.jpg";

export const Route = createFileRoute("/{-$locale}/about")({
  head: ({ params }) => ({
    meta: [
      { title: (params.locale ?? "ar") === "ar" ? "من نحن | فكرة للتسويق الرقمي" : "About | Fikra Digital Marketing" },
      { name: "description", content: (params.locale ?? "ar") === "ar" ? "تعرّف على فكرة، وكالة تسويق رقمي مرخّصة في السعودية ورؤيتنا في النمو." : "Meet Fikra — a licensed KSA digital marketing agency and our vision for growth." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";
  const values = [
    { icon: Target, title: { ar: "نتائج قابلة للقياس", en: "Measurable results" }, desc: { ar: "كل قرار مبني على بيانات.", en: "Every decision is data-driven." } },
    { icon: Heart, title: { ar: "شراكة حقيقية", en: "True partnership" }, desc: { ar: "نمو عميلنا = نموّنا.", en: "Our client's growth is ours." } },
    { icon: Award, title: { ar: "جودة لا تتنازل", en: "Uncompromising quality" }, desc: { ar: "كل تسليم بمعايير عالمية.", en: "Every delivery to global standards." } },
    { icon: Users, title: { ar: "فريق متخصص", en: "Specialist team" }, desc: { ar: "خبراء، لا generalists.", en: "Experts, not generalists." } },
  ];

  const credentials = [
    { icon: ShieldCheck, ar: "سجل تجاري سعودي مرخّص", en: "Licensed Saudi commercial registration" },
    { icon: BadgeCheck, ar: "شريك Meta و Google و TikTok معتمد", en: "Certified Meta, Google & TikTok Partner" },
    { icon: MapPin, ar: "مكاتب في الرياض ودبي", en: "Offices in Riyadh & Dubai" },
    { icon: Sparkles, ar: "متوافقون مع رؤية 2030", en: "Aligned with Vision 2030" },
  ];

  const milestones = [
    { y: "2019", ar: "انطلاق فكرة في الرياض", en: "Fikra launches in Riyadh" },
    { y: "2021", ar: "توسّع في دول الخليج (الإمارات والكويت)", en: "Expansion across the Gulf (UAE & Kuwait)" },
    { y: "2023", ar: "أكثر من 100 علامة تجارية خليجية", en: "100+ Gulf brands trust Fikra" },
    { y: "2025", ar: "إدارة +12 مليون ريال ميزانيات إعلانية", en: "SAR 12M+ ad budgets under management" },
  ];

  const promises = isAr
    ? [
        "تقارير شفافة أسبوعياً بالأرقام، بدون تجميل",
        "فريق سعودي وعربي يفهم ثقافة السوق ولهجته",
        "عقود مرنة بدون التزامات طويلة مخفية",
        "ضمان استرجاع أو إعادة تنفيذ خلال أول 30 يوم",
        "حماية بيانات العميل وفق نظام حماية البيانات السعودي (PDPL)",
        "تواصل مباشر عبر واتساب مع مدير حسابك",
      ]
    : [
        "Transparent weekly reports — real numbers, no fluff",
        "Saudi & Arab team that understands local culture and dialect",
        "Flexible contracts with no hidden long lock-ins",
        "30-day money-back or rework guarantee",
        "Client data handled per Saudi PDPL regulations",
        "Direct WhatsApp line with your account manager",
      ];

  return (
    <SiteLayout>
      <Breadcrumbs trail={[{ label: isAr ? "من نحن" : "About" }]} />

      {/* HERO — Trust forward */}
      <section className="relative isolate overflow-hidden bg-gradient-hero">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" aria-hidden />
        <div className="container-app relative z-10 grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isAr ? "وكالة سعودية مرخّصة • منذ 2019" : "Licensed Saudi agency • Since 2019"}
            </span>
            <h1 className="display-1 mt-5 text-[2.4rem] text-ink md:text-[3.2rem] lg:text-[3.8rem]">
              {isAr ? (
                <>
                  شركاؤكم في النمو
                  <br />
                  <span className="text-gradient">في قلب الخليج</span>
                </>
              ) : (
                <>
                  Your growth partners
                  <br />
                  <span className="text-gradient">at the heart of the Gulf</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              {isAr
                ? "فكرة وكالة تسويق رقمي مرخّصة في المملكة العربية السعودية، نخدم أكثر من 150 علامة تجارية في السعودية والإمارات والكويت بحلول متكاملة من السيو والإعلانات إلى الكرييتيف والتطوير — بفهم عميق للسوق الخليجي وثقافته."
                : "Fikra is a licensed Saudi digital marketing agency serving 150+ brands across KSA, UAE and Kuwait with integrated solutions — from SEO and ads to creative and development — built on deep Gulf market expertise."}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {credentials.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/70 px-3 py-2.5 text-sm font-semibold backdrop-blur">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{isAr ? c.ar : c.en}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={buildHref(locale, "/contact")}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-primary px-6 text-sm font-bold text-primary-foreground shadow-soft transition hover:scale-[1.04] hover:shadow-glow"
              >
                {isAr ? "احجز استشارة مجانية" : "Book a free consultation"}
                <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
              </Link>
              <Link
                to={buildHref(locale, "/case-studies")}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background/60 px-6 text-sm font-bold text-foreground backdrop-blur transition hover:border-primary/40 hover:text-primary"
              >
                {isAr ? "قصص نجاحنا" : "Our success stories"}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2.5rem] opacity-25 blur-2xl" style={{ background: "var(--gradient-brand)" }} aria-hidden />
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-elegant">
                <img
                  src={heroSaudiMarketer}
                  alt={isAr ? "خبير تسويق رقمي سعودي" : "Saudi digital marketing expert"}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -bottom-5 -start-5 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-elegant backdrop-blur md:block animate-float">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><BadgeCheck className="h-5 w-5" /></span>
                  <div>
                    <div className="text-sm font-extrabold">{isAr ? "تقييم 4.9 / 5" : "4.9 / 5 rating"}</div>
                    <div className="text-xs text-muted-foreground">{isAr ? "150+ عميل خليجي" : "150+ Gulf clients"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <StatsBand />

      {/* Story / Mission */}
      <section className="section">
        <div className="container-app grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{isAr ? "قصتنا" : "Our story"}</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {isAr ? "بدأنا بفكرة… وأصبحنا الشريك المفضّل لعلامات الخليج" : "It started with an idea — now we're the Gulf's go-to partner"}
            </h2>
          </div>
          <div className="space-y-4 text-base leading-8 text-muted-foreground md:text-lg">
            <p>
              {isAr
                ? "تأسست فكرة في الرياض عام 2019 بإيمان بسيط: أن العلامات التجارية الخليجية تستحق تسويقاً رقمياً يفهم سوقها، يحترم ثقافتها، ويُحقّق أرقاماً حقيقية — لا مجرد تقارير منمّقة."
                : "Fikra was founded in Riyadh in 2019 on a simple belief: Gulf brands deserve digital marketing that truly understands their market, respects their culture, and delivers real numbers — not pretty reports."}
            </p>
            <p>
              {isAr
                ? "اليوم، نخدم أكثر من 150 علامة في السعودية والإمارات والكويت، من المتاجر الإلكترونية الناشئة إلى المؤسسات الكبرى. نلتزم بمعايير رؤية 2030 ونعمل وفق نظام حماية البيانات السعودي (PDPL)، ونؤمن بأن الثقة تُبنى بالشفافية وتُكسب بالنتائج."
                : "Today we serve 150+ brands across KSA, UAE and Kuwait — from emerging e-commerce to major enterprises. We align with Vision 2030, comply with Saudi PDPL data protection, and believe trust is built through transparency and earned through results."}
            </p>
          </div>
        </div>
      </section>

      {/* Promises grid */}
      <section className="section bg-surface-soft">
        <div className="container-app">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{isAr ? "وعدنا لكم" : "Our promise"}</span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{isAr ? "ست ضمانات نلتزم بها مع كل عميل" : "Six commitments we honor with every client"}</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promises.map((p, i) => (
              <div key={i} className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold leading-7 text-foreground">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container-app">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{isAr ? "رحلتنا" : "Our journey"}</span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{isAr ? "محطّات بنينا فيها الثقة" : "Milestones that built trust"}</h2>
          </div>
          <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <li key={i} className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
                <div className="text-3xl font-black text-gradient">{m.y}</div>
                <p className="mt-2 text-sm font-semibold leading-7 text-foreground">{isAr ? m.ar : m.en}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-app">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{isAr ? "قيمنا" : "Our values"}</span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{isAr ? "ما يحرّكنا كل يوم" : "What drives us every day"}</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 text-base font-bold">{v.title[locale]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc[locale]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <LogosStrip />
      <Testimonials />
      <CtaBand />
    </SiteLayout>
  );
}
