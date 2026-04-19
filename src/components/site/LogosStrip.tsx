import type { ReactNode } from "react";
import { useLocale } from "@/i18n/useLocale";

// Fictional brand logos rendered as inline SVG so they look like real wordmarks.
const LOGOS: { name: string; svg: ReactNode }[] = [
  {
    name: "Lumora",
    svg: (
      <svg viewBox="0 0 140 30" className="h-7 w-auto">
        <circle cx="14" cy="15" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="14" cy="15" r="3" fill="currentColor" />
        <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="20" fill="currentColor" letterSpacing="-0.5">
          Lumora
        </text>
      </svg>
    ),
  },
  {
    name: "Northpeak",
    svg: (
      <svg viewBox="0 0 160 30" className="h-7 w-auto">
        <path d="M4 24 L14 8 L20 17 L26 11 L34 24 Z" fill="currentColor" />
        <text x="42" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="18" fill="currentColor" letterSpacing="-0.3">
          Northpeak
        </text>
      </svg>
    ),
  },
  {
    name: "Velora",
    svg: (
      <svg viewBox="0 0 130 30" className="h-7 w-auto">
        <path d="M4 6 L14 24 L24 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="32" y="22" fontFamily="Georgia, serif" fontWeight="700" fontStyle="italic" fontSize="20" fill="currentColor">
          Velora
        </text>
      </svg>
    ),
  },
  {
    name: "Arkive",
    svg: (
      <svg viewBox="0 0 140 30" className="h-7 w-auto">
        <rect x="3" y="6" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="8" y="11" width="8" height="8" fill="currentColor" />
        <text x="28" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="20" fill="currentColor">
          ARKIVE
        </text>
      </svg>
    ),
  },
  {
    name: "Solune",
    svg: (
      <svg viewBox="0 0 140 30" className="h-7 w-auto">
        <path d="M14 4 A11 11 0 1 0 14 26 A8 8 0 1 1 14 4 Z" fill="currentColor" />
        <text x="30" y="22" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="20" fill="currentColor" letterSpacing="2">
          SOLUNE
        </text>
      </svg>
    ),
  },
  {
    name: "Pivora",
    svg: (
      <svg viewBox="0 0 140 30" className="h-7 w-auto">
        <path d="M4 22 L14 6 L24 22 M9 16 H19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="20" fill="currentColor">
          Pivora
        </text>
      </svg>
    ),
  },
  {
    name: "Helio",
    svg: (
      <svg viewBox="0 0 130 30" className="h-7 w-auto">
        <circle cx="14" cy="15" r="6" fill="currentColor" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1="14" y1="15" x2={14 + 11 * Math.cos((a * Math.PI) / 180)} y2={15 + 11 * Math.sin((a * Math.PI) / 180)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ))}
        <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="20" fill="currentColor" letterSpacing="-0.3">
          Helio
        </text>
      </svg>
    ),
  },
  {
    name: "Brava",
    svg: (
      <svg viewBox="0 0 140 30" className="h-7 w-auto">
        <text x="0" y="22" fontFamily="Georgia, serif" fontWeight="900" fontSize="22" fill="currentColor" letterSpacing="-1">
          B
        </text>
        <text x="20" y="22" fontFamily="Inter, sans-serif" fontWeight="300" fontSize="20" fill="currentColor" letterSpacing="6">
          RAVA
        </text>
      </svg>
    ),
  },
  {
    name: "Quanta",
    svg: (
      <svg viewBox="0 0 140 30" className="h-7 w-auto">
        <circle cx="14" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="20" y1="22" x2="26" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="20" fill="currentColor">
          Quanta
        </text>
      </svg>
    ),
  },
  {
    name: "Kavira",
    svg: (
      <svg viewBox="0 0 140 30" className="h-7 w-auto">
        <path d="M4 6 L14 6 L24 24 L14 24 Z M14 6 L24 6 L14 24" fill="currentColor" />
        <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="20" fill="currentColor" letterSpacing="1">
          Kavira
        </text>
      </svg>
    ),
  },
];

export function LogosStrip() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="border-y border-border bg-card py-12">
      <div className="container-app">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {isAr ? "علامات وثقت بنا" : "Trusted by leading brands"}
        </p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-16">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <div
                key={i}
                className="text-muted-foreground/60 transition hover:text-primary"
                title={l.name}
              >
                {l.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
