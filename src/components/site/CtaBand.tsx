import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export function CtaBand() {
  const { locale, t, buildHref } = useLocale();
  return (
    <section className="section">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant md:p-14">
          <div className="pointer-events-none absolute -end-10 -top-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -start-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-4xl">
                {locale === "ar" ? "جاهز لتحويل تسويقك إلى محرك نمو حقيقي؟" : "Ready to turn marketing into a real growth engine?"}
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
                {locale === "ar"
                  ? "احجز استشارة مجانية مع فريقنا الاستراتيجي — نحلل وضعك ونعطيك خطة عمل خلال أيام."
                  : "Book a free strategy call — we'll analyze your situation and deliver a concrete action plan within days."}
              </p>
            </div>
            <Link
              to={buildHref(locale, "/contact")}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary shadow-soft transition hover:scale-[1.02]"
            >
              {t("cta.primary")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
