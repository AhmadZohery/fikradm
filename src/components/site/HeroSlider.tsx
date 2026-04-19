import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { cn } from "@/lib/utils";

const slides = [
  {
    eyebrow: { ar: "نمو رقمي مدروس", en: "Data-driven growth" },
    title: {
      ar: "نحوّل أفكارك إلى نتائج تسويقية حقيقية",
      en: "We turn your ideas into real marketing results",
    },
    desc: {
      ar: "فكرة وكالة تسويق رقمي مرخّصة في السعودية، نقدم حلولاً متكاملة من السيو والإعلانات إلى الكرييتيف والتطوير.",
      en: "Fikra is a licensed digital marketing agency in KSA, delivering integrated solutions from SEO and ads to creative and development.",
    },
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: { ar: "حلول لكل قطاع", en: "Solutions for every industry" },
    title: {
      ar: "خبرة عميقة في المتاجر، الصحة، العقار واللوجستيات",
      en: "Deep expertise in e-commerce, healthcare, real estate & logistics",
    },
    desc: {
      ar: "كل قطاع له لغته وعملاؤه. نبني لك استراتيجية مخصصة تتحدث بلغة عميلك.",
      en: "Every industry has its own language. We build a tailored strategy that speaks your customer's language.",
    },
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: { ar: "أداء مقاس بالأرقام", en: "Performance measured in numbers" },
    title: {
      ar: "+220% نمو متوسط بالمبيعات لعملائنا",
      en: "+220% average sales growth for our clients",
    },
    desc: {
      ar: "نقيس كل ريال إعلاني، ونحسّن باستمرار، ونكشف لك الأرقام بشفافية.",
      en: "We measure every ad dollar, optimize relentlessly, and report transparently.",
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  },
];

export function HeroSlider() {
  const { locale, t, buildHref } = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden bg-gradient-hero"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* decorative glow */}
      <div className="pointer-events-none absolute -top-32 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 end-0 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="container-app relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:py-28">
        <div key={index} className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {slides[index].eyebrow[locale]}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {slides[index].title[locale]}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            {slides[index].desc[locale]}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={buildHref(locale, "/contact")}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-95"
            >
              {t("cta.primary")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              to={buildHref(locale, "/services")}
              className="inline-flex h-12 items-center rounded-full border border-border bg-background/60 px-6 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-accent"
            >
              {locale === "ar" ? "اكتشف خدماتنا" : "Explore our services"}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-10 bg-primary" : "w-5 bg-primary/25 hover:bg-primary/40",
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
            <img
              key={slides[index].image}
              src={slides[index].image}
              alt=""
              className="h-full w-full animate-fade-in object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -start-6 hidden rounded-2xl border border-border bg-popover p-4 shadow-elegant md:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">★</div>
              <div>
                <div className="text-sm font-bold">4.9/5</div>
                <div className="text-xs text-muted-foreground">{locale === "ar" ? "+150 عميل سعيد" : "150+ happy clients"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
