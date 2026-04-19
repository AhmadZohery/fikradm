import { useLocale } from "@/i18n/useLocale";

const logos = [
  { ar: "أرامكو", en: "Aramco" },
  { ar: "نون", en: "Noon" },
  { ar: "سلة", en: "Salla" },
  { ar: "زد", en: "Zid" },
  { ar: "stc", en: "STC" },
  { ar: "موبايلي", en: "Mobily" },
];

export function LogosStrip() {
  const { locale } = useLocale();
  return (
    <section className="border-y border-border bg-background py-10">
      <div className="container-app">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {locale === "ar" ? "موثوقون من علامات تعمل في السعودية والخليج" : "Trusted by brands across KSA & the Gulf"}
        </p>
        <div className="grid grid-cols-3 items-center justify-items-center gap-x-8 gap-y-6 opacity-70 md:grid-cols-6">
          {logos.map((l, i) => (
            <span key={i} className="text-base font-bold text-muted-foreground transition hover:text-foreground md:text-lg">
              {l[locale]}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
