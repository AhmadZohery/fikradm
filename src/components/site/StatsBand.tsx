import { useLocale } from "@/i18n/useLocale";
import { TrendingUp, Users, BarChart3, Award } from "lucide-react";

const stats = [
  { value: "150+", label: { ar: "عميل في الخليج", en: "Gulf clients" }, icon: Users },
  { value: "220%", label: { ar: "نمو متوسط للمبيعات", en: "Avg sales growth" }, icon: TrendingUp },
  { value: "4.5x", label: { ar: "عائد متوسط للإعلانات", en: "Avg ad ROAS" }, icon: BarChart3 },
  { value: "9+", label: { ar: "سنوات خبرة جماعية", en: "Years of expertise" }, icon: Award },
];

export function StatsBand() {
  const { locale } = useLocale();
  return (
    <section className="relative -mt-8 md:-mt-12">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-elegant backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-50" aria-hidden />
          <div className="relative grid grid-cols-2 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0 rtl:divide-x-reverse">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.value} className="group flex items-center gap-4 px-6 py-7 md:px-7 md:py-8">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-gradient-brand group-hover:text-primary-foreground md:h-14 md:w-14">
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold tabular-nums tracking-tight text-foreground md:text-3xl lg:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
                      {s.label[locale]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
