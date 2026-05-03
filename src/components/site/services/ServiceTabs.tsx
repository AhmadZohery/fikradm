import { useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Check,
  ChevronDown,
  Search,
  TrendingUp,
  Palette,
  Film,
  Code2,
  Compass,
  MessageCircle,
  Smartphone,
  LayoutDashboard,
  Bot,
  HelpCircle,
  Gift,
  Workflow,
  Users,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ServiceTabContent, ServicePersonality } from "@/content/serviceTabs";
import { cn } from "@/lib/utils";

/* ---------- Personality → visual identity ---------- */

type Personality = {
  icon: LucideIcon;
  /** decorative gradient (from-…-via-…-to-…) Tailwind classes for the side panel */
  panelGradient: string;
  /** chip / badge colors */
  chipBg: string;
  chipText: string;
  /** decorative motif rendered behind the active tab */
  Motif: () => JSX.Element;
};

function GridMotif() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
      <defs>
        <pattern id="gridMotif" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridMotif)" />
    </svg>
  );
}

function DotsMotif() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden>
      <defs>
        <pattern id="dotsMotif" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotsMotif)" />
    </svg>
  );
}

function WaveMotif() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.10]" aria-hidden viewBox="0 0 400 400" preserveAspectRatio="none">
      <path d="M0 200 Q 100 100 200 200 T 400 200" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M0 240 Q 100 140 200 240 T 400 240" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M0 280 Q 100 180 200 280 T 400 280" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const PERSONALITIES: Record<ServicePersonality, Personality> = {
  data:         { icon: Search,           panelGradient: "from-violet-600 via-violet-500 to-indigo-500",  chipBg: "bg-violet-50",   chipText: "text-violet-700",   Motif: GridMotif },
  rocket:       { icon: TrendingUp,       panelGradient: "from-orange-500 via-rose-500 to-pink-500",      chipBg: "bg-orange-50",   chipText: "text-orange-700",   Motif: WaveMotif },
  palette:      { icon: Palette,          panelGradient: "from-fuchsia-500 via-pink-500 to-rose-500",     chipBg: "bg-pink-50",     chipText: "text-pink-700",     Motif: DotsMotif },
  frame:        { icon: Film,             panelGradient: "from-amber-500 via-orange-500 to-red-500",      chipBg: "bg-amber-50",    chipText: "text-amber-700",    Motif: GridMotif },
  code:         { icon: Code2,            panelGradient: "from-emerald-600 via-teal-500 to-cyan-500",     chipBg: "bg-emerald-50",  chipText: "text-emerald-700",  Motif: GridMotif },
  blueprint:    { icon: Compass,          panelGradient: "from-sky-600 via-blue-500 to-indigo-500",       chipBg: "bg-sky-50",      chipText: "text-sky-700",      Motif: GridMotif },
  feed:         { icon: MessageCircle,    panelGradient: "from-pink-500 via-fuchsia-500 to-purple-500",   chipBg: "bg-fuchsia-50",  chipText: "text-fuchsia-700",  Motif: DotsMotif },
  device:       { icon: Smartphone,       panelGradient: "from-indigo-600 via-violet-500 to-purple-500",  chipBg: "bg-indigo-50",   chipText: "text-indigo-700",   Motif: GridMotif },
  dashboard:    { icon: LayoutDashboard,  panelGradient: "from-slate-700 via-slate-600 to-zinc-600",      chipBg: "bg-slate-100",   chipText: "text-slate-700",    Motif: GridMotif },
  neural:       { icon: Bot,              panelGradient: "from-cyan-500 via-blue-500 to-violet-600",      chipBg: "bg-cyan-50",     chipText: "text-cyan-700",     Motif: WaveMotif },
  conversation: { icon: MessageCircle,    panelGradient: "from-emerald-500 via-teal-500 to-sky-500",      chipBg: "bg-teal-50",     chipText: "text-teal-700",     Motif: DotsMotif },
};

/* ---------- Tabs ---------- */

type TabKey = "features" | "deliverables" | "process" | "audience" | "faq";

const TAB_LABELS: Record<TabKey, { ar: string; en: string; icon: LucideIcon }> = {
  features:     { ar: "مميزات الخدمة",   en: "Features",     icon: Sparkles },
  deliverables: { ar: "ماذا تستلم",      en: "Deliverables", icon: Gift },
  process:      { ar: "منهجية العمل",    en: "Methodology",  icon: Workflow },
  audience:     { ar: "لمن تناسب",        en: "Who it's for", icon: Users },
  faq:          { ar: "الأسئلة الشائعة", en: "FAQ",          icon: HelpCircle },
};

export function ServiceTabs({ content }: { content: ServiceTabContent }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [tab, setTab] = useState<TabKey>("features");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const p = PERSONALITIES[content.personality];
  const Icon = p.icon;
  const tabKeys: TabKey[] = ["features", "deliverables", "process", "audience", "faq"];

  // FAQ JSON-LD
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((it) => ({
      "@type": "Question",
      name: it.q[locale],
      acceptedAnswer: { "@type": "Answer", text: it.a[locale] },
    })),
  };

  return (
    <section className="section">
      <div className="container-app">
        {/* Hero header */}
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", p.chipBg, p.chipText)}>
              <Icon className="h-3.5 w-3.5" />
              {content.hero.eyebrow[locale]}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
              {content.hero.title[locale]}
            </h1>
            <p className="mt-3 text-lg font-medium text-muted-foreground md:text-xl">
              {content.hero.tagline[locale]}
            </p>
            <p className="mt-4 text-sm leading-7 text-foreground/80 md:text-base">
              {content.hero.intro[locale]}
            </p>
          </div>

          {/* decorative panel */}
          <div className={cn("relative aspect-[5/4] overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-white shadow-elegant", p.panelGradient)}>
            <div className="text-current">
              <p.Motif />
            </div>
            <div className="relative flex h-full flex-col justify-between">
              <Icon className="h-12 w-12 opacity-90" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">
                  {isAr ? "خدمة فكرة" : "Fikra service"}
                </div>
                <div className="mt-1 text-2xl font-extrabold leading-tight">
                  {content.hero.title[locale]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          {/* Tab headers */}
          <div className="flex flex-wrap gap-1 border-b border-border bg-surface-soft p-2">
            {tabKeys.map((k) => {
              const T = TAB_LABELS[k].icon;
              const active = tab === k;
              return (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "group relative inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all min-w-[120px]",
                    active
                      ? cn("bg-gradient-to-br text-white shadow-soft", p.panelGradient)
                      : "text-muted-foreground hover:bg-card hover:text-foreground",
                  )}
                  aria-selected={active}
                  role="tab"
                >
                  <T className="h-4 w-4" />
                  <span>{TAB_LABELS[k][locale]}</span>
                </button>
              );
            })}
          </div>

          {/* Tab body */}
          <div className="relative p-6 md:p-10">
            {tab === "features" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {content.features[locale].map((f, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white shadow-soft bg-gradient-to-br", p.panelGradient)}>
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm leading-6 text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "deliverables" && (
              <div className="grid gap-4 md:grid-cols-2">
                {content.deliverables[locale].map((d, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div className={cn("absolute inset-y-0 start-0 w-1 bg-gradient-to-b", p.panelGradient)} />
                    <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl text-white bg-gradient-to-br", p.panelGradient)}>
                      <Gift className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-7 text-foreground">{d}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "process" && (
              <ol className="relative grid gap-5 md:grid-cols-2">
                {content.process.map((step, i) => (
                  <li
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6"
                  >
                    <div className={cn("absolute -end-6 -top-6 grid h-24 w-24 place-items-center rounded-full text-3xl font-black text-white opacity-20 bg-gradient-to-br", p.panelGradient)}>
                      {i + 1}
                    </div>
                    <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl text-white bg-gradient-to-br", p.panelGradient)}>
                      <span className="text-sm font-extrabold">{i + 1}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-extrabold text-ink">{step.step[locale]}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.detail[locale]}</p>
                  </li>
                ))}
              </ol>
            )}

            {tab === "audience" && (
              <div className="grid gap-3 md:grid-cols-2">
                {content.audience[locale].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5"
                  >
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white bg-gradient-to-br", p.panelGradient)}>
                      ✓
                    </span>
                    <p className="text-sm leading-7 text-foreground">{a}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "faq" && (
              <div className="space-y-3">
                {content.faqs.map((it, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                      <button
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm font-bold text-foreground md:text-base">{it.q[locale]}</span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 shrink-0 transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                      <div className={cn("grid transition-all", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground">{it.a[locale]}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
              </div>
            )}
          </div>

          {/* Final CTA inside the tab card */}
          <div className={cn("flex flex-col items-start gap-4 border-t border-border bg-surface-soft p-6 md:flex-row md:items-center md:justify-between md:p-8")}>
            <p className="text-base font-extrabold text-ink md:text-lg">◆ {content.cta[locale]}</p>
            <Link
              to="/{-$locale}/contact"
              params={{ locale: locale === "ar" ? undefined : locale }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:shadow-elegant bg-gradient-to-br",
                p.panelGradient,
              )}
            >
              {isAr ? "احجز استشارتك المجانية" : "Book your free consultation"}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
