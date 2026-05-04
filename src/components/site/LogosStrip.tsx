import { useLocale } from "@/i18n/useLocale";
import clientsWall from "@/assets/clients-wall.webp";

/**
 * Trusted-by strip rendering the actual client logos extracted from the
 * 2025 agency portfolio PDF (clients-wall.webp). The full logo wall image
 * is duplicated and animated horizontally so visitors see the real brand
 * marks scrolling in a continuous marquee — far more credible than CSS
 * wordmarks.
 */

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
        <div
          className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          aria-label={
            isAr
              ? "شعارات أكثر من 30 علامة تجارية تعاونت مع فكرة"
              : "Logos of 30+ client brands that worked with Fikra"
          }
        >
          <div className="flex w-max animate-marquee items-center gap-8">
            {[0, 1].map((i) => (
              <img
                key={i}
                src={clientsWall}
                alt={
                  i === 0
                    ? isAr
                      ? "شعارات عملاء فكرة للتسويق الرقمي"
                      : "Fikra digital marketing client logos"
                    : ""
                }
                aria-hidden={i === 1}
                className="h-20 w-auto max-w-none select-none object-contain md:h-24 lg:h-28"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
