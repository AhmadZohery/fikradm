import { useLocale } from "@/i18n/useLocale";

/**
 * Trusted-by marquee — visible on mobile.
 *
 * We render each client as a styled "logo card" (typographic wordmark on a
 * white card) instead of raw inline text. Each card is large enough to read
 * comfortably on a 360px viewport and uses brand-style typography pulled
 * from the 2025 Fikra agency portfolio so the marquee FEELS like a real
 * client logo strip rather than a list of names.
 */
type ClientLogo = {
  name: string;
  /** Optional secondary tag rendered as a small badge (e.g. BOSCH partner) */
  tag?: string;
  /** Visual treatment of the wordmark */
  variant:
    | "monogram-circle" // SHS-style stacked initials in a thin ring
    | "stencil-block"   // GARAGE 90, FIX IT, NEW CITY, KSR
    | "sans-bold"       // MaTicAuto, cardoO, Crystal Dental, NBA Outlet
    | "serif-italic"    // Artistry Living, La Béauté, Dr. Amir
    | "ar-bold"         // التميّز, د. رفا القاضي, النادي
    | "wide-fashion"    // TULIP, KERVANO, BASSANT
    | "rounded-soft";   // Car Care, ECO CLEAN
  /** Brand accent color */
  color?: string;
};

const CLIENTS: ClientLogo[] = [
  { name: "MaTicAuto", variant: "sans-bold", color: "#1a1a1a" },
  { name: "GARAGE 90", variant: "stencil-block", color: "#1e3a8a" },
  { name: "AL AMIN", tag: "BOSCH", variant: "sans-bold", color: "#dc2626" },
  { name: "SHS", variant: "monogram-circle", color: "#0f172a" },
  { name: "Car Care", variant: "rounded-soft", color: "#1d4ed8" },
  { name: "cardoO", variant: "sans-bold", color: "#0f172a" },
  { name: "د. رفا القاضي", variant: "ar-bold", color: "#0d9488" },
  { name: "Artistry Living", variant: "serif-italic", color: "#a16207" },
  { name: "Crystal Dental", variant: "sans-bold", color: "#10b981" },
  { name: "TULIP", variant: "wide-fashion", color: "#0f172a" },
  { name: "KERVANO", variant: "wide-fashion", color: "#0f172a" },
  { name: "ECO CLEAN", variant: "rounded-soft", color: "#16a34a" },
  { name: "YShot", variant: "sans-bold", color: "#dc2626" },
  { name: "MCC", variant: "serif-italic", color: "#1e3a8a" },
  { name: "BASSANT", variant: "wide-fashion", color: "#9f1239" },
  { name: "Egypt Career", variant: "sans-bold", color: "#0284c7" },
  { name: "La Béauté", variant: "serif-italic", color: "#be185d" },
  { name: "PartTech", variant: "sans-bold", color: "#ea580c" },
  { name: "NBA Outlet", variant: "sans-bold", color: "#ea580c" },
  { name: "النادي", variant: "ar-bold", color: "#0f766e" },
  { name: "FIX IT", variant: "stencil-block", color: "#b45309" },
  { name: "KSR Motors", variant: "stencil-block", color: "#dc2626" },
  { name: "NEW CITY", variant: "stencil-block", color: "#0f172a" },
  { name: "التميّز العقارية", variant: "ar-bold", color: "#0f766e" },
];

const VARIANT_CLASS: Record<ClientLogo["variant"], string> = {
  "monogram-circle": "font-serif italic font-black tracking-tight",
  "stencil-block": "font-sans font-black uppercase tracking-[0.18em]",
  "sans-bold": "font-sans font-extrabold tracking-tight",
  "serif-italic": "font-serif italic font-bold",
  "ar-bold": "font-sans font-black tracking-tight",
  "wide-fashion": "font-sans font-black uppercase tracking-[0.32em]",
  "rounded-soft": "font-sans font-extrabold tracking-tight",
};

function LogoCard({ logo }: { logo: ClientLogo }) {
  const isAr = logo.variant === "ar-bold";
  return (
    <div
      className="flex h-20 min-w-[160px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-border/60 bg-white px-5 shadow-sm transition hover:shadow-md sm:h-24 sm:min-w-[200px] sm:px-7"
      title={logo.name}
    >
      {logo.variant === "monogram-circle" ? (
        <span
          className="grid h-12 w-12 place-items-center rounded-full border-2 sm:h-14 sm:w-14"
          style={{ borderColor: logo.color, color: logo.color }}
        >
          <span className={`text-xl sm:text-2xl ${VARIANT_CLASS[logo.variant]}`}>
            {logo.name}
          </span>
        </span>
      ) : (
        <span
          className={`whitespace-nowrap text-2xl leading-none sm:text-3xl ${VARIANT_CLASS[logo.variant]}`}
          style={{ color: logo.color }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {logo.name}
        </span>
      )}
      {logo.tag && (
        <span
          className="rounded-sm border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest"
          style={{ borderColor: logo.color, color: logo.color }}
        >
          {logo.tag}
        </span>
      )}
    </div>
  );
}

export function LogosStrip() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  // RTL-aware speed: Arabic users read right-to-left, so the reversed
  // direction of the marquee feels slightly faster perceptually. We slow
  // it down a touch in RTL to keep the perceived motion identical.
  const durationSec = isAr ? 60 : 48;

  return (
    <section
      className="border-y border-border bg-surface-soft py-10 sm:py-14"
      aria-labelledby="logos-strip-heading"
    >
      <div className="container-app">
        <p
          id="logos-strip-heading"
          className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:text-sm"
        >
          {isAr
            ? "موثوقون من +30 علامة سعودية ومصرية"
            : "Trusted by 30+ Saudi & Egyptian brands"}
        </p>

        <div
          className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          aria-label={
            isAr ? "شعارات عملاء فكرة" : "Fikra client logos"
          }
        >
          {/* Track is duplicated so the -50% translate produces a seamless loop */}
          <div
            className="flex w-max items-center gap-4 animate-marquee pause-on-hover sm:gap-6"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <LogoCard key={`${c.name}-${i}`} logo={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
