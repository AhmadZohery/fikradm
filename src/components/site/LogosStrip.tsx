import { useLocale } from "@/i18n/useLocale";

const logos = [
  { ar: "أرامكو", en: "Aramco" },
  { ar: "نون", en: "Noon" },
  { ar: "سلة", en: "Salla" },
  { ar: "زد", en: "Zid" },
  { ar: "stc", en: "STC" },
  { ar: "موبايلي", en: "Mobily" },
  { ar: "تمارا", en: "Tamara" },
  { ar: "تابي", en: "Tabby" },
];

export function LogosStrip() {
  const { locale } = useLocale();
  const list = [...logos, ...logos];
  return (
    <section className="border-y border-border/60 bg-surface/40 py-12">
      <div className="container-app">
        <p className="mb-7 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {locale === "ar" ? "موثوقون من علامات تعمل في السعودية والخليج" : "Trusted by brands across KSA & the Gulf"}
        </p>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-12 px-6">
          {list.map((l, i) => (
            <div
              key={i}
              className="flex h-10 shrink-0 items-center justify-center rounded-lg px-6 text-2xl font-black tracking-tight text-muted-foreground/70 transition hover:text-primary md:text-3xl"
            >
              {l[locale]}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
