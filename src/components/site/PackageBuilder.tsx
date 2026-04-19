import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Plus, Calculator, ArrowUpRight, Search, Megaphone, Palette, Code2, Share2, FileText } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

type Module = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  priceSar: number;
};

const MODULES: Module[] = [
  { id: "seo", icon: Search, name: { ar: "سيو احترافي", en: "Pro SEO" }, desc: { ar: "تحسين تقني + محتوى + روابط", en: "Technical + content + links" }, priceSar: 3490 },
  { id: "ads", icon: Megaphone, name: { ar: "إدارة إعلانات", en: "Ads management" }, desc: { ar: "Meta + Google + TikTok", en: "Meta + Google + TikTok" }, priceSar: 4490 },
  { id: "social", icon: Share2, name: { ar: "إدارة سوشيال ميديا", en: "Social media mgmt" }, desc: { ar: "محتوى يومي + تفاعل", en: "Daily content + engagement" }, priceSar: 2990 },
  { id: "design", icon: Palette, name: { ar: "إنتاج كرييتيف", en: "Creative production" }, desc: { ar: "تصاميم + ريلز شهرياً", en: "Designs + reels monthly" }, priceSar: 3490 },
  { id: "content", icon: FileText, name: { ar: "محتوى تسويقي", en: "Marketing content" }, desc: { ar: "مقالات + كتابة محترفة", en: "Articles + pro copywriting" }, priceSar: 1990 },
  { id: "web", icon: Code2, name: { ar: "صيانة الموقع", en: "Website care" }, desc: { ar: "تحديثات + سرعة + أمان", en: "Updates + speed + security" }, priceSar: 1490 },
];

const BUNDLE_DISCOUNT: Record<number, number> = { 2: 10, 3: 15, 4: 20, 5: 25, 6: 30 };

export function PackageBuilder() {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";
  const [selected, setSelected] = useState<Set<string>>(new Set(["seo", "ads"]));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { subtotal, discount, total } = useMemo(() => {
    const sub = MODULES.filter((m) => selected.has(m.id)).reduce((s, m) => s + m.priceSar, 0);
    const pct = BUNDLE_DISCOUNT[selected.size] ?? 0;
    const disc = Math.round((sub * pct) / 100);
    return { subtotal: sub, discount: disc, total: sub - disc };
  }, [selected]);

  return (
    <section id="builder" className="section">
      <div className="container-app">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionEyebrow>{isAr ? "ابنِ باقتك" : "Build your bundle"}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {isAr ? (
                <>
                  اختر <span className="marker-line px-2">خدماتك</span> واحسب باقتك المخصصة
                </>
              ) : (
                <>
                  Pick your <span className="marker-line px-2">services</span> & price your bundle
                </>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              {isAr
                ? "كل خدمة إضافية = خصم أكبر. اجمع 3 خدمات واحصل على 15% خصم، 6 خدمات تعني 30% خصم."
                : "Each added service = bigger discount. Bundle 3 for 15% off, all 6 for 30% off."}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {MODULES.map((m) => {
                const Icon = m.icon;
                const active = selected.has(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={active}
                    className={
                      "group relative overflow-hidden rounded-2xl border p-5 text-start transition " +
                      (active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card hover:border-primary/40 hover:bg-surface-soft")
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={
                          "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition " +
                          (active ? "bg-gradient-primary text-white shadow-soft" : "bg-primary/10 text-primary group-hover:scale-110")
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-extrabold text-ink">{isAr ? m.name.ar : m.name.en}</h3>
                          <span
                            className={
                              "grid h-6 w-6 place-items-center rounded-full border transition " +
                              (active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground")
                            }
                          >
                            {active ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{isAr ? m.desc.ar : m.desc.en}</p>
                        <p className="mt-2 text-sm font-bold tabular-nums text-primary">
                          {m.priceSar.toLocaleString()} {isAr ? "ر.س" : "SAR"} <span className="font-medium text-muted-foreground">/ {isAr ? "شهر" : "mo"}</span>
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky calculator */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
              <div className="bg-gradient-primary p-6 text-primary-foreground">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                  <Calculator className="h-3.5 w-3.5" />
                  {isAr ? "ملخّص باقتك" : "Your bundle summary"}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-black tabular-nums">{total.toLocaleString()}</span>
                  <span className="text-sm font-semibold opacity-90">{isAr ? "ر.س / شهر" : "SAR / mo"}</span>
                </div>
                {discount > 0 && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                    <span className="line-through opacity-70">{subtotal.toLocaleString()}</span>
                    <span>—</span>
                    <span>{isAr ? `وفّرت ${discount.toLocaleString()} ر.س` : `Saved ${discount.toLocaleString()} SAR`}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                {selected.size === 0 ? (
                  <p className="text-sm text-muted-foreground">{isAr ? "اختر خدمة لبدء حساب باقتك." : "Pick a service to start pricing."}</p>
                ) : (
                  <ul className="space-y-3">
                    {MODULES.filter((m) => selected.has(m.id)).map((m) => (
                      <li key={m.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{isAr ? m.name.ar : m.name.en}</span>
                        <span className="font-semibold tabular-nums text-muted-foreground">{m.priceSar.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {selected.size >= 2 && (
                  <div className="mt-5 rounded-xl bg-success/10 p-3 text-xs font-bold text-success">
                    {isAr
                      ? `🎉 خصم ${BUNDLE_DISCOUNT[selected.size]}% على ${selected.size} خدمات`
                      : `🎉 ${BUNDLE_DISCOUNT[selected.size]}% off for ${selected.size} services`}
                  </div>
                )}
                {selected.size === 1 && (
                  <div className="mt-5 rounded-xl bg-primary/5 p-3 text-xs font-semibold text-primary">
                    {isAr ? "أضف خدمة ثانية واحصل على 10% خصم 👇" : "Add a second service to unlock 10% off 👇"}
                  </div>
                )}

                <Link
                  to={buildHref(locale, "/contact")}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:opacity-95"
                >
                  {isAr ? "احجز استشارة لباقتك" : "Book consultation for this bundle"}
                  <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
                </Link>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  {isAr ? "لا التزام — استشارة مجانية 30 دقيقة" : "No commitment — free 30-min consultation"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
