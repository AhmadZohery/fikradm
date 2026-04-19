import { useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    name: { ar: "أحمد العتيبي", en: "Ahmed Alotaibi" },
    role: { ar: "مدير تسويق · متجر إلكتروني", en: "Marketing Manager · E-commerce" },
    quote: {
      ar: "خلال 4 شهور تضاعفت مبيعاتنا الشهرية وانخفضت تكلفة الاكتساب بنسبة 35%. فريق فكرة لا يقدم وعوداً، بل يقدم أرقاماً.",
      en: "In 4 months our monthly sales doubled and CAC dropped 35%. The Fikra team doesn't make promises — they deliver numbers.",
    },
    metric: { value: "+220%", label: { ar: "نمو المبيعات", en: "Sales growth" } },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: { ar: "د. ليلى الحربي", en: "Dr. Laila Alharbi" },
    role: { ar: "صاحبة عيادة · الرياض", en: "Clinic Owner · Riyadh" },
    quote: {
      ar: "حجوزات العيادة امتلأت خلال 6 أسابيع. فريق محترف يفهم القطاع الطبي بعمق ويلتزم بأخلاقياته.",
      en: "My clinic's bookings filled within 6 weeks. A professional team that deeply understands healthcare ethics.",
    },
    metric: { value: "+180", label: { ar: "حجز شهرياً", en: "Bookings/mo" } },
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: { ar: "خالد منصور", en: "Khaled Mansour" },
    role: { ar: "مدير عام · شركة شحن", en: "GM · Logistics Company" },
    quote: {
      ar: "أخيراً ليدز B2B حقيقية وعقود فعلية. الشفافية في التقارير شيء نادر في السوق السعودي.",
      en: "Finally real B2B leads and actual contracts. Their reporting transparency is rare in the Saudi market.",
    },
    metric: { value: "x3.8", label: { ar: "ROAS", en: "ROAS" } },
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
];

export function Testimonials() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [active, setActive] = useState(0);
  const t = items[active];

  const next = () => setActive((a) => (a + 1) % items.length);
  const prev = () => setActive((a) => (a - 1 + items.length) % items.length);

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-40" aria-hidden />
      <div className="container-app relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {isAr ? "آراء عملائنا" : "Client voices"}
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {isAr ? (
                <>نتائج حقيقية يتحدث <span className="text-gradient">عنها أصحابها</span></>
              ) : (
                <>Real results, in our <span className="text-gradient">clients' words</span></>
              )}
            </h2>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-14">
            <div className="relative grid gap-8 overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-elegant md:grid-cols-[1.4fr_1fr] md:p-12">
              {/* Quote side */}
              <div className="relative">
                <Quote className="h-12 w-12 text-primary/15" />
                <blockquote
                  key={active}
                  className="mt-4 animate-fade-up font-serif text-2xl font-medium leading-relaxed text-foreground md:text-3xl md:leading-snug"
                >
                  "{t.quote[locale]}"
                </blockquote>

                <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                  <img
                    src={t.image}
                    alt={t.name[locale]}
                    loading="lazy"
                    className="h-14 w-14 rounded-full border-2 border-primary/20 object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-base font-bold text-foreground">{t.name[locale]}</div>
                    <div className="text-xs text-muted-foreground">{t.role[locale]}</div>
                  </div>
                  <div className="hidden items-center gap-1 text-amber-500 sm:flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Metric side */}
              <div className="relative grid place-items-center">
                <div className="absolute inset-0 bg-gradient-mesh opacity-60 [mask-image:radial-gradient(ellipse,black_40%,transparent_75%)]" aria-hidden />
                <div className="relative text-center">
                  <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    {isAr ? "النتيجة" : "Outcome"}
                  </div>
                  <div className="mt-3 text-7xl font-extrabold tabular-nums text-gradient md:text-8xl">
                    {t.metric.value}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-foreground">{t.metric.label[locale]}</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-7 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active ? "w-10 bg-primary" : "w-5 bg-primary/25 hover:bg-primary/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label={isAr ? "السابق" : "Previous"}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background text-foreground transition hover:border-primary hover:text-primary"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label={isAr ? "التالي" : "Next"}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background text-foreground transition hover:border-primary hover:text-primary"
                >
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
