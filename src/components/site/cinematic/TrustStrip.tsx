import { Award, ShieldCheck, BadgeCheck, Star, Verified, TrendingUp } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./SectionEyebrow";

const BADGES = [
  { icon: ShieldCheck, ar: "وكالة مرخّصة", en: "Licensed agency" },
  { icon: BadgeCheck, ar: "Meta Business Partner", en: "Meta Business Partner" },
  { icon: Verified, ar: "Google Partner", en: "Google Partner" },
  { icon: Award, ar: "TikTok Marketing Partner", en: "TikTok Marketing Partner" },
  { icon: Star, ar: "Top Clutch Agency 2025", en: "Top Clutch Agency 2025" },
  { icon: TrendingUp, ar: "HubSpot Solutions", en: "HubSpot Solutions" },
];

export function TrustStrip() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-soft py-10">
      <div className="container-app">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="text-center lg:text-start">
            <SectionEyebrow>{isAr ? "موثوقون من" : "Trusted by"}</SectionEyebrow>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {isAr
                ? "شركاء معتمدون مع كبرى المنصات وعملاء يثقون بجودة العمل."
                : "Certified partners of major platforms and clients who trust the work."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {BADGES.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="group flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="leading-tight">{isAr ? b.ar : b.en}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
