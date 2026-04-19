import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import type { ServiceMeta, SubServiceMeta } from "@/content/types";
import { useLocale } from "@/i18n/useLocale";
import { getServiceVariant, type ServiceVariant } from "./serviceVariants";
import { GlowOrbs } from "../cinematic/GlowOrbs";
import { HugeWordBackdrop } from "../cinematic/HugeWordBackdrop";
import { SectionEyebrow } from "../cinematic/SectionEyebrow";
import { Sparkle } from "../cinematic/Sparkle";
import { CountUp } from "../cinematic/CountUp";

type Props = {
  service: ServiceMeta | SubServiceMeta;
  parent?: ServiceMeta;
  variantOverride?: string;
  isSubService?: boolean;
};

const heroDecoration: Record<ServiceVariant["hero"], (s: ServiceMeta | SubServiceMeta) => React.ReactNode> = {
  data: (s) => <DataHeroVisual image={s.image} />,
  funnel: (s) => <FunnelHeroVisual image={s.image} />,
  gallery: (s) => <GalleryHeroVisual image={s.image} />,
  code: (s) => <CodeHeroVisual image={s.image} />,
  grid: (s) => <GridHeroVisual image={s.image} />,
  magazine: (s) => <MagazineHeroVisual image={s.image} />,
};

export function ServiceVariantHero({ service, parent, variantOverride, isSubService }: Props) {
  const { locale, t, buildHref } = useLocale();
  const isAr = locale === "ar";
  const variantSlug = variantOverride ?? service.slug;
  const variant = getServiceVariant(variantSlug);

  return (
    <section data-accent={variant.accent} className="relative isolate overflow-hidden bg-gradient-hero">
      <GlowOrbs variant="svc" />
      <Sparkle className="absolute -top-2 start-8 z-10 animate-glow-pulse" size={28} />

      <div className="container-app relative z-10 grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="animate-fade-up">
          {parent ? (
            <Link
              to="/$locale/services/$slug"
              params={{ locale, slug: parent.slug }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--svc)" }}
            >
              <span className="inline-block h-px w-6" style={{ background: "var(--svc)" }} />
              {parent.title[locale]}
            </Link>
          ) : (
            <SectionEyebrow>{isAr ? "خدمة احترافية" : "Pro Service"}</SectionEyebrow>
          )}

          <h1 className="display-1 mt-4 text-[2.4rem] text-ink md:text-[3.4rem] lg:text-[4rem]">
            {service.title[locale].split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="relative inline-block">
                  <span className="marker-line px-2">{word}</span>
                </span>
              ) : (
                <span key={i}>{word} </span>
              ),
            )}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">{service.intro[locale]}</p>

          <ul className="mt-7 grid gap-2 sm:grid-cols-2">
            {service.highlights[locale].slice(0, 4).map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                <span
                  className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                  style={{ background: "var(--svc)" }}
                >
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={buildHref(locale, "/contact")}
              className="btn-pill group"
              style={{ background: "var(--svc)" }}
            >
              <span className="px-2">{t("cta.primary")}</span>
              <span className="pill-icon">
                <ArrowUpRight className="h-4 w-4 text-white rtl:rotate-90" />
              </span>
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
            >
              {isAr ? "شاهد الباقات" : "See plans"}
            </a>
          </div>
        </div>

        <div className="relative">{heroDecoration[variant.hero](service)}</div>
      </div>

      <HugeWordBackdrop text={isAr ? variant.hugeWord.ar : variant.hugeWord.en} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" aria-hidden />

      <span className="hidden">{isSubService ? "1" : "0"}</span>
    </section>
  );
}

/* ---------- Hero visual variants ---------- */

function FrameImage({ image, alt = "" }: { image: string; alt?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-elegant">
      <img src={image} alt={alt} className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
    </div>
  );
}

function DataHeroVisual({ image }: { image: string }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      <FrameImage image={image} />
      <div className="absolute -end-6 top-10 hidden md:block animate-float">
        <div className="rounded-2xl border border-white/40 bg-white/95 p-4 shadow-pop backdrop-blur-xl">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Organic traffic</div>
          <div className="mt-1 text-2xl font-black tabular-nums text-ink">
            +<CountUp to={184} suffix="%" />
          </div>
          <div className="mt-3 flex h-12 items-end gap-1">
            {[40, 55, 35, 62, 48, 70, 88].map((h, i) => (
              <span
                key={i}
                className="w-2.5 origin-bottom rounded-sm animate-bar-grow"
                style={{
                  height: `${h}%`,
                  background: "var(--svc)",
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -start-4 bottom-16 hidden rounded-full border border-border bg-white px-4 py-2 text-xs font-bold shadow-soft md:flex md:items-center md:gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: "var(--svc)" }} />
        #1 Google • "agency KSA"
      </div>
    </div>
  );
}

function FunnelHeroVisual({ image }: { image: string }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      <FrameImage image={image} />
      <div className="absolute -end-6 top-12 hidden md:block animate-float">
        <div className="rounded-2xl border border-white/40 bg-white/95 p-4 shadow-pop backdrop-blur-xl">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ROAS</div>
          <div className="mt-1 text-3xl font-black tabular-nums text-ink">
            <CountUp to={5} suffix=".8x" />
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              { label: "Impressions", v: "1.2M" },
              { label: "Clicks", v: "48K" },
              { label: "Conversions", v: "2.4K" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-bold tabular-nums text-ink">{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -start-4 bottom-16 hidden rounded-full px-4 py-2 text-xs font-bold text-white shadow-soft md:flex md:items-center md:gap-2 animate-glow-pulse" style={{ background: "var(--svc)" }}>
        <span className="h-2 w-2 rounded-full bg-white animate-blink" />
        Live campaign
      </div>
    </div>
  );
}

function GalleryHeroVisual({ image }: { image: string }) {
  return (
    <div className="relative mx-auto grid aspect-[4/5] w-full max-w-md grid-cols-3 grid-rows-3 gap-3">
      <div className="col-span-2 row-span-2 overflow-hidden rounded-3xl border border-border shadow-elegant">
        <img src={image} alt="" className="h-full w-full object-cover" loading="eager" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
        <img src="https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=400&q=80" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-soft animate-float" style={{ background: "var(--svc)" }}>
        <div className="grid h-full place-items-center text-3xl font-black text-white">A</div>
      </div>
      <div className="col-span-3 grid grid-cols-5 gap-2 rounded-2xl border border-border bg-white p-3 shadow-soft">
        {["#6048d8", "#ff5b8a", "#f7b731", "#1a1a2e", "#ffffff"].map((c, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg border border-border"
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

function CodeHeroVisual({ image }: { image: string }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      <FrameImage image={image} />
      <div className="absolute -end-4 top-10 hidden w-72 rounded-2xl border border-white/40 bg-ink/95 p-4 font-mono text-[11px] text-white shadow-pop backdrop-blur-xl md:block animate-float">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ms-2 text-[10px] text-white/60">~ fikra/site</span>
        </div>
        <div className="space-y-1.5 leading-relaxed">
          <div><span className="text-pink-300">npm</span> run build</div>
          <div className="text-emerald-300">✓ 0 errors · 43 routes</div>
          <div><span className="text-cyan-300">lighthouse</span> --score</div>
          <div className="text-emerald-300">✓ 99 / 100 / 100 / 100</div>
          <div className="flex items-center"><span>$</span><span className="ms-1 inline-block h-3 w-1.5 bg-white animate-blink" /></div>
        </div>
      </div>
      <div className="absolute -start-4 bottom-16 hidden rounded-full bg-white px-4 py-2 text-xs font-bold shadow-soft md:flex md:items-center md:gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: "var(--svc)" }} />
        Lighthouse 99
      </div>
    </div>
  );
}

function GridHeroVisual({ image }: { image: string }) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
      <div className="absolute inset-x-10 inset-y-0 overflow-hidden rounded-[2.5rem] border-8 border-ink bg-card shadow-elegant">
        <div className="flex items-center justify-center bg-ink py-1.5">
          <span className="h-1 w-12 rounded-full bg-white/30" />
        </div>
        <img src={image} alt="" className="h-full w-full object-cover" loading="eager" />
      </div>
      <div className="absolute -end-2 top-16 hidden rounded-2xl border border-white/40 bg-white/95 p-3 shadow-pop backdrop-blur md:flex md:items-center md:gap-2 animate-float">
        <span className="grid h-9 w-9 place-items-center rounded-full text-lg" style={{ background: "var(--svc-soft)" }}>❤️</span>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Engagement</div>
          <div className="text-sm font-black tabular-nums text-ink">+312%</div>
        </div>
      </div>
      <div className="absolute -start-4 bottom-20 hidden rounded-2xl border border-white/40 bg-white/95 p-3 text-xs shadow-pop backdrop-blur md:block animate-float [animation-delay:1s]">
        <div className="font-bold text-ink">12.4K reels views</div>
        <div className="mt-1 flex gap-1">
          {[1,2,3,4,5].map((i) => <span key={i} className="h-1 w-6 rounded-full" style={{ background: i <= 4 ? "var(--svc)" : "var(--border)" }} />)}
        </div>
      </div>
    </div>
  );
}

function MagazineHeroVisual({ image }: { image: string }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border bg-card shadow-elegant">
        <div className="relative h-1/2 overflow-hidden">
          <img src={image} alt="" className="h-full w-full object-cover" loading="eager" />
          <span className="absolute end-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-soft" style={{ color: "var(--svc)" }}>Issue 24</span>
        </div>
        <div className="p-6">
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--svc)" }}>Editorial</div>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-ink">The art of telling stories that convert.</h3>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Read more</span>
          </div>
        </div>
      </div>
    </div>
  );
}
