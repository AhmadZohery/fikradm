import { useLocale } from "@/i18n/useLocale";
import { Quote } from "lucide-react";

const items = [
  {
    name: { ar: "أحمد العتيبي", en: "Ahmed Alotaibi" },
    role: { ar: "مدير تسويق · متجر إلكتروني", en: "Marketing Manager · E-commerce" },
    quote: {
      ar: "خلال 4 شهور تضاعفت مبيعاتنا الشهرية وانخفضت تكلفة الاكتساب بنسبة 35%.",
      en: "In 4 months our monthly sales doubled and CAC dropped 35%.",
    },
  },
  {
    name: { ar: "د. ليلى الحربي", en: "Dr. Laila Alharbi" },
    role: { ar: "صاحبة عيادة في الرياض", en: "Clinic Owner · Riyadh" },
    quote: {
      ar: "حجوزات العيادة امتلأت خلال 6 أسابيع. فريق فكرة محترف ويفهم القطاع الطبي بعمق.",
      en: "My clinic's bookings filled within 6 weeks. The team is professional and understands healthcare.",
    },
  },
  {
    name: { ar: "خالد منصور", en: "Khaled Mansour" },
    role: { ar: "مدير عام · شركة شحن", en: "GM · Logistics Company" },
    quote: {
      ar: "أخيراً ليدز B2B حقيقية وعقود فعلية. الشفافية في التقارير شيء نادر في السوق.",
      en: "Finally real B2B leads and actual contracts. The transparent reporting is rare in this market.",
    },
  },
];

export function Testimonials() {
  const { locale } = useLocale();
  return (
    <section className="section">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {locale === "ar" ? "آراء عملائنا" : "Client voices"}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            {locale === "ar" ? "نتائج حقيقية يتحدث عنها أصحابها" : "Real results, in our clients' own words"}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <figure key={i} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Quote className="h-8 w-8 text-primary/30" />
              <blockquote className="mt-3 text-sm leading-7 text-foreground">{t.quote[locale]}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {t.name[locale].charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold">{t.name[locale]}</div>
                  <div className="text-xs text-muted-foreground">{t.role[locale]}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
