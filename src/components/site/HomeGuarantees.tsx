import { ShieldCheck, Clock, RotateCcw, Lock, Sparkles } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "./cinematic/SectionEyebrow";

const ITEMS = [
  {
    icon: ShieldCheck,
    titleAr: "ضمان النتائج أو نُكمل مجاناً",
    titleEn: "Results guarantee — or we work free",
    descAr: "إذا لم نحقق المؤشرات المُتفق عليها خلال أول 90 يوم، نُكمل بدون تكلفة حتى نصل.",
    descEn: "If we miss the agreed KPIs in the first 90 days, we keep working at no cost until we hit them.",
  },
  {
    icon: Clock,
    titleAr: "استجابة خلال ساعات",
    titleEn: "Response within hours",
    descAr: "مدير حساب مخصص يرد على رسائلك في أقل من 4 ساعات في أيام العمل.",
    descEn: "A dedicated account manager replies in under 4 working hours.",
  },
  {
    icon: RotateCcw,
    titleAr: "بلا التزام طويل الأمد",
    titleEn: "No long-term lock-in",
    descAr: "اشتراك شهري مرن — تستمر معنا لأن النتائج تستحق، لا لأن العقد يجبرك.",
    descEn: "Flexible monthly plans — you stay because results deserve it, not because a contract forces you.",
  },
  {
    icon: Lock,
    titleAr: "ملكية كاملة لكل شيء",
    titleEn: "You own everything",
    descAr: "حسابات الإعلانات، الكود، التصاميم، والتقارير — كلها ملكك من اليوم الأول.",
    descEn: "Ad accounts, code, designs, and reports — all yours from day one.",
  },
];

export function HomeGuarantees() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" aria-hidden />
      <div className="container-app relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>{isAr ? "ضماناتنا لك" : "Our promises"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
            {isAr ? (
              <>
                نعمل بضمانات
                <span className="marker-line px-2"> صريحة</span> — لأنّ ثقتك ليست شعاراً
              </>
            ) : (
              <>
                We work with <span className="marker-line px-2">explicit guarantees</span> — your trust isn't a tagline
              </>
            )}
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            {isAr
              ? "كل عميل يستحق التزاماً واضحاً. هذه ضماناتنا الموثقة في كل عقد."
              : "Every client deserves a clear commitment. These are the guarantees written into every contract."}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-primary transition-transform duration-500 group-hover:scale-x-100" />
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary transition group-hover:rotate-[-8deg] group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-extrabold text-ink">
                  {isAr ? it.titleAr : it.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {isAr ? it.descAr : it.descEn}
                </p>
                <Sparkles
                  className="absolute -end-2 -top-2 h-16 w-16 text-primary opacity-0 blur-xl transition group-hover:opacity-30"
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
