import { useLocale } from "@/i18n/useLocale";

const stats = [
  { value: "+150", label: { ar: "عميل في الخليج", en: "Clients in the Gulf" } },
  { value: "+220%", label: { ar: "نمو متوسط بالمبيعات", en: "Avg sales growth" } },
  { value: "x4.5", label: { ar: "عائد متوسط للإعلانات", en: "Avg ad ROAS" } },
  { value: "9+", label: { ar: "سنوات خبرة جماعية", en: "Years of expertise" } },
];

export function StatsBand() {
  const { locale } = useLocale();
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-app grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:py-14">
        {stats.map((s) => (
          <div key={s.value} className="text-center">
            <div className="text-3xl font-extrabold text-gradient md:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label[locale]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
