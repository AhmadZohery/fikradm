/**
 * ServiceShowcase — per-service unique storytelling section.
 * Each service slug renders a completely different layout:
 *   - seo: Search Console dashboard mockup + keyword journey
 *   - performance: Live ad funnel + ROAS calculator strip
 *   - creative: Brand gallery wall + reel preview
 *   - web: Code editor + lighthouse score gauge
 *   - social: Phone mockup with live feed
 *   - content: Editorial magazine spread
 *
 * Uses MediaSlot for image/video placeholders so real screenshots can be
 * dropped in later without touching layout.
 */
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "../cinematic/SectionEyebrow";
import { MediaSlot } from "../cinematic/MediaSlot";
import { CountUp } from "../cinematic/CountUp";
import { VideoEmbed } from "../cinematic/VideoEmbed";
import { ArrowUpRight, Search, TrendingUp, Eye, MousePointerClick, Heart, MessageCircle, Share2, Code2, Gauge, Type, Image as ImageIcon } from "lucide-react";

type Props = { slug: string };

export function ServiceShowcase({ slug }: Props) {
  switch (slug) {
    case "seo":
      return <SeoShowcase />;
    case "performance":
      return <PerformanceShowcase />;
    case "creative":
      return <CreativeShowcase />;
    case "web":
      return <WebShowcase />;
    case "social":
      return <SocialShowcase />;
    case "content":
      return <ContentShowcase />;
    default:
      return <SeoShowcase />;
  }
}

/* ─────────────────────────  SEO  ───────────────────────── */
function SeoShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow>{isAr ? "السيو في العمل" : "SEO in action"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {isAr ? (
                <>
                  هكذا يبدو
                  <span className="marker-line px-2"> داشبورد </span>
                  عميل سيو حقيقي بعد 6 شهور
                </>
              ) : (
                <>
                  This is what a real SEO client's <span className="marker-line px-2">dashboard</span> looks like after 6 months
                </>
              )}
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              {isAr
                ? "كل عميل لديه دخول مباشر على Search Console وLooker Studio dashboard مخصص. نُظهر لك كل كلمة، كل صفحة، وكل تحول."
                : "Every client gets direct Search Console access and a custom Looker Studio dashboard. We show every keyword, page, and conversion."}
            </p>
            <ul className="mt-7 grid gap-3">
              {[
                { ar: "تتبع 500+ كلمة مفتاحية أسبوعياً", en: "Track 500+ keywords weekly" },
                { ar: "تقرير موثّق لكل صفحة بنشرها", en: "Documented page-by-page progress" },
                { ar: "Google Sheets مباشر مع كل التغييرات", en: "Live Google Sheet with every change" },
                { ar: "توقّع نمو الزيارات بناءً على البيانات", en: "Data-backed traffic growth forecasts" },
              ].map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--svc)" }} />
                  <span className="text-foreground/85">{isAr ? it.ar : it.en}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            {/* Browser-style dashboard mockup */}
            <div className="relative rounded-3xl border border-border bg-card shadow-elegant">
              <div className="flex items-center gap-2 border-b border-border bg-surface-soft px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ms-3 flex items-center gap-2 rounded-full bg-card px-3 py-1 text-[11px] text-muted-foreground" dir="ltr">
                  <Search className="h-3 w-3" /> search.google.com/search-console
                </span>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {isAr ? "إجمالي النقرات" : "Total clicks"}
                    </div>
                    <div className="mt-1 text-3xl font-black tabular-nums text-ink">
                      <CountUp to={84230} />
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <TrendingUp className="h-3 w-3" /> +<CountUp to={412} suffix="%" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(["7d", "28d", "3m", "16m"] as const).map((p) => (
                      <span key={p} className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${p === "16m" ? "bg-primary text-white" : "bg-surface-soft text-muted-foreground"}`}>{p}</span>
                    ))}
                  </div>
                </div>
                {/* SVG chart */}
                <svg viewBox="0 0 400 120" className="h-32 w-full">
                  <defs>
                    <linearGradient id="seo-grad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="var(--svc)" stopOpacity="0.4" />
                      <stop offset="1" stopColor="var(--svc)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,100 C40,90 80,85 120,75 C160,65 200,55 240,40 C280,28 320,18 360,10 L400,5 L400,120 L0,120 Z" fill="url(#seo-grad)" />
                  <path d="M0,100 C40,90 80,85 120,75 C160,65 200,55 240,40 C280,28 320,18 360,10 L400,5" fill="none" stroke="var(--svc)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { l: isAr ? "ظهور" : "Impressions", v: "1.2M" },
                    { l: "CTR", v: "6.8%" },
                    { l: isAr ? "متوسط الترتيب" : "Avg position", v: "4.2" },
                  ].map((m, i) => (
                    <div key={i} className="rounded-xl border border-border bg-surface-soft p-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.l}</div>
                      <div className="mt-0.5 text-base font-black tabular-nums text-ink">{m.v}</div>
                    </div>
                  ))}
                </div>
                {/* Top keywords */}
                <div className="mt-5">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {isAr ? "أعلى الكلمات المفتاحية" : "Top keywords"}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { kw: isAr ? "وكالة تسويق رقمي الرياض" : "digital marketing riyadh", pos: "#1", clicks: "12.4k" },
                      { kw: isAr ? "افضل شركة سيو" : "best seo agency ksa", pos: "#2", clicks: "8.1k" },
                      { kw: isAr ? "تصميم مواقع احترافية" : "professional web design", pos: "#3", clicks: "6.7k" },
                    ].map((k, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg bg-surface-soft px-3 py-2 text-xs">
                        <span className="font-mono font-bold text-emerald-600">{k.pos}</span>
                        <span className="flex-1 truncate text-foreground/85">{k.kw}</span>
                        <span className="font-bold tabular-nums text-ink">{k.clicks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Floating screenshot card */}
            <div className="absolute -bottom-8 -end-4 hidden w-56 md:block animate-float">
              <MediaSlot ratio="square" rounded="2xl" alt={isAr ? "Looker Studio dashboard" : "Looker Studio dashboard"} caption={isAr ? "تقرير شهري" : "Monthly report"} badge="LOOKER" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  PERFORMANCE  ───────────────────────── */
function PerformanceShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const funnel = [
    { stage: isAr ? "ظهور" : "Impressions", value: "1.4M", w: 100, icon: Eye },
    { stage: isAr ? "نقرات" : "Clicks", value: "62.8K", w: 75, icon: MousePointerClick },
    { stage: isAr ? "تواصل" : "Leads", value: "8.4K", w: 45, icon: Heart },
    { stage: isAr ? "بيع" : "Sales", value: "2.1K", w: 22, icon: TrendingUp },
  ];
  return (
    <section className="section relative overflow-hidden bg-surface-soft">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>{isAr ? "Funnel حي" : "Live funnel"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
            {isAr ? (
              <>كل ريال إعلاني <span className="marker-line px-2">يُحسب</span> — ويُعاد بأرباح</>
            ) : (
              <>Every ad dollar <span className="marker-line px-2">accounted for</span> — returned in profit</>
            )}
          </h2>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          {/* Funnel */}
          <div className="space-y-3">
            {funnel.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="relative ms-auto flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant"
                  style={{ width: `${f.w}%` }}
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-svc" style={{ background: "var(--gradient-svc)" }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{f.stage}</div>
                    <div className="text-2xl font-black tabular-nums text-ink">{f.value}</div>
                  </div>
                  <div
                    className="h-2 w-24 overflow-hidden rounded-full bg-surface-soft"
                  >
                    <div className="h-full rounded-full" style={{ width: `${f.w}%`, background: "var(--svc)" }} />
                  </div>
                </div>
              );
            })}
            <div className="ms-auto flex w-[22%] items-center justify-center gap-2 rounded-2xl bg-gradient-svc p-4 text-white shadow-svc">
              <span className="text-xs font-bold uppercase tracking-widest opacity-90">ROAS</span>
              <span className="text-2xl font-black tabular-nums"><CountUp to={5} suffix=".8x" /></span>
            </div>
          </div>

          {/* Right panel: ad creative preview + spend math */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-elegant">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-blink" /> {isAr ? "حملة نشطة" : "Active campaign"}
              </div>
              <MediaSlot ratio="square" rounded="2xl" alt={isAr ? "إعلان فيسبوك حقيقي" : "Real Facebook ad creative"} badge="META" caption={isAr ? "Reels Ad — متوسط CTR 4.8%" : "Reels Ad — 4.8% avg CTR"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{isAr ? "صرف يومي" : "Daily spend"}</div>
                <div className="mt-1 text-xl font-black tabular-nums text-ink">SAR 850</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-card">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{isAr ? "إيراد يومي" : "Daily revenue"}</div>
                <div className="mt-1 text-xl font-black tabular-nums" style={{ color: "var(--svc)" }}>SAR 4,930</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  CREATIVE  ───────────────────────── */
function CreativeShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>{isAr ? "معرض أعمال" : "Work gallery"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
            {isAr ? (
              <>هويات
                <span className="marker-line px-2"> تُحبّ </span>
                وحملات تُذكر
              </>
            ) : (
              <>Brands worth <span className="marker-line px-2">loving</span>, campaigns worth remembering</>
            )}
          </h2>
        </div>

        {/* Asymmetric gallery */}
        <div className="mt-14 grid grid-cols-6 gap-4 md:gap-5">
          <MediaSlot className="col-span-6 md:col-span-3 md:row-span-2 md:aspect-auto md:h-full" ratio="square" rounded="3xl" alt={isAr ? "هوية بصرية كاملة لعلامة موضة" : "Full brand identity — fashion label"} badge={isAr ? "هوية" : "Identity"} />
          <MediaSlot className="col-span-3 md:col-span-3" ratio="video" rounded="2xl" alt={isAr ? "كرييتيف إعلاني" : "Ad creative set"} badge={isAr ? "إعلان" : "Ad"} />
          <MediaSlot className="col-span-3 md:col-span-2" ratio="square" rounded="2xl" alt={isAr ? "تصميم منشور" : "Social post"} />
          <div className="col-span-3 grid place-items-center rounded-3xl bg-gradient-svc p-6 text-center text-white shadow-svc md:col-span-1">
            <div>
              <div className="text-3xl font-black"><CountUp to={300} suffix="+" /></div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-90">{isAr ? "تصميم شهرياً" : "Designs / month"}</div>
            </div>
          </div>
          <MediaSlot className="col-span-6 md:col-span-2" ratio="video" rounded="2xl" alt={isAr ? "ريلز عميل" : "Client reel"} type="video" badge="REEL" />
          <MediaSlot className="col-span-3 md:col-span-2" ratio="portrait" rounded="2xl" alt={isAr ? "بوستر" : "Poster"} />
          <MediaSlot className="col-span-3 md:col-span-2" ratio="portrait" rounded="2xl" alt={isAr ? "تغليف منتج" : "Product packaging"} />
        </div>

        {/* Color palette + type */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{isAr ? "لوحة الألوان" : "Color palette"}</div>
            <div className="mt-3 flex gap-2">
              {["#6048d8", "#8b6df0", "#ffd166", "#1a1a2e", "#ffffff"].map((c) => (
                <div key={c} className="aspect-square flex-1 rounded-xl border border-border" style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{isAr ? "النظام الطباعي" : "Typography"}</div>
            <div className="mt-3 font-serif text-3xl text-ink leading-none">Aa</div>
            <div className="mt-2 text-sm text-muted-foreground">Display + Body</div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{isAr ? "الأصول" : "Brand assets"}</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[Type, ImageIcon, Heart].map((I, i) => (
                <div key={i} className="grid aspect-square place-items-center rounded-xl bg-surface-soft text-primary"><I className="h-5 w-5" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  WEB  ───────────────────────── */
function WebShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section relative overflow-hidden bg-surface-soft">
      <div className="container-app">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left: code editor mockup */}
          <div className="relative rounded-3xl bg-ink p-5 font-mono text-[13px] text-white shadow-elegant">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ms-3 text-[10px] text-white/50">~ fikra/landing.tsx</span>
            </div>
            <pre className="whitespace-pre-wrap leading-7" dir="ltr">
{`export default function Hero() {
  return (
    <section className="bg-gradient-hero">
      <h1>{`}<span className="text-cyan-300">Convert</span>{`}</h1>
      <Button>{`}<span className="text-amber-300">"Start growing"</span>{`}</Button>
    </section>
  );
}`}
            </pre>
            <div className="mt-4 border-t border-white/10 pt-3 text-[11px] text-white/70">
              <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 0 errors · 43 routes · TanStack Start</div>
              <div className="flex items-center gap-2 mt-1"><span className="text-emerald-400">✓</span> Build · 1.2s · 89kb gzipped</div>
            </div>
          </div>

          {/* Right: lighthouse + bullets */}
          <div>
            <SectionEyebrow>{isAr ? "هندسة الأداء" : "Engineered performance"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {isAr ? (
                <>كود نظيف، <span className="marker-line px-2">أداء عالٍ</span>، تحويلات أكبر</>
              ) : (
                <>Clean code, <span className="marker-line px-2">peak performance</span>, more conversions</>
              )}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {isAr
                ? "كل موقع ننشره يمر باختبار Lighthouse وWebPageTest قبل التسليم. ولا نسلم إلا 95+ على كل المقاييس."
                : "Every site we ship passes Lighthouse and WebPageTest before launch. We don't deliver under 95+ on every metric."}
            </p>

            {/* Lighthouse gauges */}
            <div className="mt-7 grid grid-cols-4 gap-3">
              {[
                { label: "Perf", val: 99 },
                { label: "A11y", val: 100 },
                { label: "BP", val: 100 },
                { label: "SEO", val: 100 },
              ].map((g, i) => (
                <LighthouseGauge key={i} {...g} />
              ))}
            </div>

            <div className="mt-7 grid gap-3">
              {[
                { ar: "TanStack Start + React 19 SSR", en: "TanStack Start + React 19 SSR", icon: Code2 },
                { ar: "Core Web Vitals كلها خضراء", en: "All Core Web Vitals green", icon: Gauge },
                { ar: "Schema, Pixels, GTM، Open Graph من اليوم الأول", en: "Schema, Pixels, GTM, OG from day one", icon: TrendingUp },
              ].map((it, i) => {
                const Icon = it.icon;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="h-4 w-4" /></div>
                    <span className="text-sm font-semibold text-foreground">{isAr ? it.ar : it.en}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LighthouseGauge({ label, val }: { label: string; val: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (val / 100) * c;
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-3 shadow-card">
      <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--svc)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="-mt-12 text-lg font-black tabular-nums text-ink">{val}</div>
      <div className="mt-7 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

/* ─────────────────────────  SOCIAL  ───────────────────────── */
function SocialShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section relative overflow-hidden">
      <div className="container-app">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow>{isAr ? "محتوى ينتشر" : "Content that travels"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {isAr ? (
                <>محتوى لكل منصة <span className="marker-line px-2">بشخصيتها</span></>
              ) : (
                <>Native content per platform — <span className="marker-line px-2">in its voice</span></>
              )}
            </h2>
            <div className="mt-7 grid grid-cols-2 gap-4">
              {[
                { l: isAr ? "ريلز / تيك توك شهرياً" : "Reels / TikTok / month", v: "32" },
                { l: isAr ? "متابع جديد عضوياً" : "New organic followers", v: "+18K" },
                { l: isAr ? "Engagement Rate" : "Engagement rate", v: "8.4%" },
                { l: isAr ? "وقت رد < 4س" : "Reply time < 4h", v: "100%" },
              ].map((m, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="text-3xl font-black tabular-nums text-ink">{m.v}</div>
                  <div className="mt-1 text-xs font-semibold text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[3rem] border-[10px] border-ink bg-card shadow-elegant">
              <div className="flex items-center justify-center bg-ink py-2">
                <span className="h-1.5 w-20 rounded-full bg-white/30" />
              </div>
              <MediaSlot ratio="portrait" rounded="lg" alt={isAr ? "تيك توك / ريلز" : "TikTok / Reels feed"} className="!aspect-auto absolute inset-x-0 top-7 bottom-12" type="video" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-around bg-ink/95 py-3 text-white/80">
                {[Heart, MessageCircle, Share2].map((I, i) => (
                  <I key={i} className="h-5 w-5" />
                ))}
              </div>
            </div>
            {/* Floating engagement card */}
            <div className="absolute -end-4 top-16 hidden md:block animate-float">
              <div className="rounded-2xl border border-white/40 bg-white/95 p-3 shadow-pop backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{isAr ? "تفاعل" : "Engagement"}</div>
                <div className="mt-0.5 flex items-center gap-1 text-base font-black text-ink">
                  +<CountUp to={312} suffix="%" />
                </div>
              </div>
            </div>
            <div className="absolute -start-6 bottom-24 hidden md:block animate-float [animation-delay:1s]">
              <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 shadow-soft">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                <span className="text-xs font-bold tabular-nums">12.4K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  CONTENT  ───────────────────────── */
function ContentShowcase() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section relative overflow-hidden bg-surface-soft">
      <div className="container-app">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          {/* Magazine spread */}
          <div className="relative rounded-3xl border border-border bg-card shadow-elegant">
            <div className="grid grid-cols-2">
              <div className="relative aspect-[3/4] overflow-hidden rounded-s-3xl">
                <MediaSlot ratio="portrait" rounded="lg" alt={isAr ? "غلاف عدد" : "Issue cover"} className="!aspect-auto !rounded-none absolute inset-0" badge="ISSUE 24" />
              </div>
              <div className="flex flex-col justify-between p-7">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--svc)" }}>Editorial</div>
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">
                    {isAr ? "كيف يبني المحتوى ثقة لا تشتريها الإعلانات" : "How content builds trust ads can't buy"}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {isAr
                      ? "ثلاث قواعد ذهبية لإنتاج محتوى يبيع — بدون أن يبدو إعلاناً."
                      : "Three golden rules to produce content that sells — without sounding like an ad."}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">8 min read</span>
                  <span className="ms-auto inline-flex items-center gap-1 text-xs font-bold text-primary">
                    {isAr ? "اقرأ" : "Read"} <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionEyebrow>{isAr ? "إنتاج محتوى" : "Content engine"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {isAr ? (
                <>محتوى يبني <span className="marker-line px-2">سلطة</span> قبل البيع</>
              ) : (
                <>Content that builds <span className="marker-line px-2">authority</span> before the sale</>
              )}
            </h2>
            <ul className="mt-7 grid gap-3">
              {[
                { ar: "بحث موضوعات + خريطة محتوى ربع سنوية", en: "Topical research + quarterly content map" },
                { ar: "كتّاب متخصصون بقطاعك", en: "Industry-specialist writers" },
                { ar: "تحديث المحتوى القديم لإبقاء الترتيب", en: "Old article refreshes to hold rankings" },
                { ar: "تقويم نشر مدمج مع السوشيال والإعلانات", en: "Calendar integrated with social + ads" },
              ].map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--svc)" }} />
                  <span className="text-foreground/85">{isAr ? it.ar : it.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
