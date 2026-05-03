import { useEffect, useRef, useState } from "react";
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
};

const PERSONALITIES: Record<ServicePersonality, Personality> = {
  data:         { icon: Search,           panelGradient: "from-violet-600 via-violet-500 to-indigo-500",  chipBg: "bg-violet-50",   chipText: "text-violet-700"   },
  rocket:       { icon: TrendingUp,       panelGradient: "from-orange-500 via-rose-500 to-pink-500",      chipBg: "bg-orange-50",   chipText: "text-orange-700"   },
  palette:      { icon: Palette,          panelGradient: "from-fuchsia-500 via-pink-500 to-rose-500",     chipBg: "bg-pink-50",     chipText: "text-pink-700"     },
  frame:        { icon: Film,             panelGradient: "from-amber-500 via-orange-500 to-red-500",      chipBg: "bg-amber-50",    chipText: "text-amber-700"    },
  code:         { icon: Code2,            panelGradient: "from-emerald-600 via-teal-500 to-cyan-500",     chipBg: "bg-emerald-50",  chipText: "text-emerald-700"  },
  blueprint:    { icon: Compass,          panelGradient: "from-sky-600 via-blue-500 to-indigo-500",       chipBg: "bg-sky-50",      chipText: "text-sky-700"      },
  feed:         { icon: MessageCircle,    panelGradient: "from-pink-500 via-fuchsia-500 to-purple-500",   chipBg: "bg-fuchsia-50",  chipText: "text-fuchsia-700"  },
  device:       { icon: Smartphone,       panelGradient: "from-indigo-600 via-violet-500 to-purple-500",  chipBg: "bg-indigo-50",   chipText: "text-indigo-700"   },
  dashboard:    { icon: LayoutDashboard,  panelGradient: "from-slate-700 via-slate-600 to-zinc-600",      chipBg: "bg-slate-100",   chipText: "text-slate-700"    },
  neural:       { icon: Bot,              panelGradient: "from-cyan-500 via-blue-500 to-violet-600",      chipBg: "bg-cyan-50",     chipText: "text-cyan-700"     },
  conversation: { icon: MessageCircle,    panelGradient: "from-emerald-500 via-teal-500 to-sky-500",      chipBg: "bg-teal-50",     chipText: "text-teal-700"     },
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
  const sectionRef = useRef<HTMLElement | null>(null);

  const HASH_TO_TAB: Record<string, TabKey> = {
    "#features": "features",
    "#deliverables": "deliverables",
    "#methodology": "process",
    "#process": "process",
    "#audience": "audience",
    "#faq": "faq",
  };
  const TAB_TO_HASH: Record<TabKey, string> = {
    features: "#features",
    deliverables: "#deliverables",
    process: "#methodology",
    audience: "#audience",
    faq: "#faq",
  };

  // Sync tab with URL hash so /services/seo#methodology opens the right tab.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const k = HASH_TO_TAB[window.location.hash];
      if (k) {
        setTab(k);
        requestAnimationFrame(() => {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTab = (k: TabKey) => {
    setTab(k);
    if (typeof window !== "undefined") {
      const newUrl = `${window.location.pathname}${window.location.search}${TAB_TO_HASH[k]}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

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
    <section ref={sectionRef} id="service-tabs" dir={isAr ? "rtl" : "ltr"} className="section scroll-mt-24">
      <div className="container-app">
        {/* Section header — compact, no hero duplication */}
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", p.chipBg, p.chipText)}>
            <Icon className="h-3.5 w-3.5" />
            {content.hero.eyebrow[locale]}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
            {content.hero.tagline[locale]}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            {content.hero.intro[locale]}
          </p>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          {/* Tab headers */}
          <div role="tablist" className="flex flex-wrap gap-1 border-b border-border bg-surface-soft p-2">
            {tabKeys.map((k) => {
              const T = TAB_LABELS[k].icon;
              const active = tab === k;
              return (
                <button
                  key={k}
                  onClick={() => selectTab(k)}
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

          {/* Tab body — min-height stabilizes CLS as tab content swaps */}
          <div className="relative min-h-[420px] p-6 md:p-10">
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
