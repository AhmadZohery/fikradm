import { useLocale } from "@/i18n/useLocale";

const logos = ["Aramco", "Sabic", "stc", "AlRajhi", "noon", "Jarir", "Lulu", "Almarai", "Mobily", "SaudiPost"];

export function LogosStrip() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="border-y border-border bg-card py-10">
      <div className="container-app">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {isAr ? "علامات وثقت بنا" : "Trusted by leading brands"}
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-12">
            {[...logos, ...logos].map((l, i) => (
              <span
                key={i}
                className="select-none whitespace-nowrap text-2xl font-extrabold tracking-tight text-muted-foreground/60 transition hover:text-primary"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
