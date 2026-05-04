import { useLocale } from "@/i18n/useLocale";

/**
 * Real Fikra clients (extracted from the 2025 agency portfolio PDF).
 * Rendered as styled wordmarks (CSS, not raster) so they stay crisp,
 * RTL-friendly, and load instantly without external image requests.
 */
type ClientWordmark = {
  name: string;
  /** Visual treatment hint */
  style?: "serif" | "sans" | "mono" | "italic" | "wide" | "ar";
  /** Optional badge tag rendered after the name (e.g. "BOSCH") */
  tag?: string;
};

const CLIENTS: ClientWordmark[] = [
  { name: "MaTicAuto", style: "sans" },
  { name: "GARAGE 90", style: "wide" },
  { name: "AL AMIN", style: "sans", tag: "BOSCH" },
  { name: "SHS", style: "serif" },
  { name: "Car Care", style: "italic" },
  { name: "cardoO", style: "sans" },
  { name: "د. رفا القاضي", style: "ar" },
  { name: "Artistry Living", style: "serif" },
  { name: "Crystal Dental", style: "sans" },
  { name: "TULIP", style: "wide" },
  { name: "KERVANO", style: "wide" },
  { name: "ECO CLEAN", style: "sans" },
  { name: "YShot", style: "italic" },
  { name: "MCC", style: "serif" },
  { name: "BASSANT", style: "wide" },
  { name: "Egypt Career", style: "sans" },
  { name: "La Béauté", style: "italic" },
  { name: "PartTech", style: "sans" },
  { name: "NBA Outlet", style: "sans" },
  { name: "النادي", style: "ar" },
  { name: "FIX IT", style: "wide" },
  { name: "KSR Motors", style: "sans" },
  { name: "NEW CITY", style: "wide" },
  { name: "التميّز العقارية", style: "ar" },
];

const STYLE_CLASS: Record<NonNullable<ClientWordmark["style"]>, string> = {
  serif: "font-serif italic font-bold tracking-tight",
  sans: "font-sans font-extrabold tracking-tight",
  mono: "font-mono font-bold tracking-tight",
  italic: "font-serif italic font-semibold",
  wide: "font-sans font-black uppercase tracking-[0.25em] text-[0.95em]",
  ar: "font-sans font-extrabold tracking-tight",
};

export function LogosStrip() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section
      className="border-y border-border bg-card py-12"
      aria-labelledby="logos-strip-heading"
    >
      <div className="container-app">
        <p
          id="logos-strip-heading"
          className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground"
        >
          {isAr
            ? "موثوقون من +30 علامة سعودية ومصرية"
            : "Trusted by 30+ Saudi & Egyptian brands"}
        </p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-12">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className="flex items-center gap-2 text-muted-foreground/70 transition hover:text-primary"
                title={c.name}
              >
                <span
                  className={`text-2xl leading-none ${STYLE_CLASS[c.style ?? "sans"]}`}
                  dir={c.style === "ar" ? "rtl" : "ltr"}
                >
                  {c.name}
                </span>
                {c.tag && (
                  <span className="rounded-sm border border-current px-1 py-0.5 text-[9px] font-bold uppercase tracking-widest opacity-70">
                    {c.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
