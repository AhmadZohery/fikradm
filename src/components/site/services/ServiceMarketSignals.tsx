import { TrendingUp, Users, Search, ShoppingBag, Smartphone, Clock } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { SectionEyebrow } from "../cinematic/SectionEyebrow";
import { CountUp } from "../cinematic/CountUp";

type Signal = {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  prefix?: string;
  label: { ar: string; en: string };
  source?: { ar: string; en: string };
};

// Smart market signals tailored per service vertical (Saudi/GCC market data, illustrative)
const SIGNALS: Record<string, Signal[]> = {
  seo: [
    { icon: Search, value: 93, suffix: "%", label: { ar: "من رحلات الشراء تبدأ بالبحث في جوجل", en: "of buyer journeys start on Google" } },
    { icon: TrendingUp, value: 75, suffix: "%", label: { ar: "من المستخدمين لا يتجاوزون الصفحة الأولى", en: "of users never scroll past page one" } },
    { icon: ShoppingBag, value: 14, suffix: "x", label: { ar: "العائد على السيو مقارنة بالإعلانات على المدى الطويل", en: "long-term ROI of SEO vs paid ads" } },
    { icon: Clock, value: 6, suffix: "m", label: { ar: "متوسط الوقت لتظهر النتائج الحقيقية", en: "average time for real results" } },
  ],
  performance: [
    { icon: TrendingUp, value: 5, suffix: ".4x", label: { ar: "متوسط ROAS لعملائنا في 2024", en: "average ROAS for our 2024 clients" } },
    { icon: Smartphone, value: 78, suffix: "%", label: { ar: "من حملات الخليج الناجحة على Meta", en: "of winning GCC campaigns run on Meta" } },
    { icon: Users, value: 32, suffix: "M", label: { ar: "مستخدم نشط في السعودية على المنصات الإعلانية", en: "active SA users on ad platforms" } },
    { icon: Clock, value: 14, suffix: "d", label: { ar: "متوسط وقت تحقيق ROAS موجب", en: "average days to positive ROAS" } },
  ],
  creative: [
    { icon: TrendingUp, value: 80, suffix: "%", label: { ar: "من نجاح الإعلان مرتبط بجودة الكرييتيف", en: "of ad performance is creative-driven" } },
    { icon: Users, value: 65, suffix: "%", label: { ar: "من المستهلكين يثقون بالعلامات ذات الهوية القوية", en: "of consumers trust strong-brand identities more" } },
    { icon: Smartphone, value: 90, suffix: "%", label: { ar: "من المحتوى المُشاهد هو فيديو قصير", en: "of consumed content is short-form video" } },
    { icon: Clock, value: 3, suffix: "s", label: { ar: "ثوانٍ فقط لتُمسك انتباه المستخدم", en: "seconds to grab attention" } },
  ],
  web: [
    { icon: TrendingUp, value: 53, suffix: "%", label: { ar: "من الزوار يغادرون موقعاً يحتاج أكثر من 3 ثوانٍ", en: "of visitors leave a site that takes >3s" } },
    { icon: Smartphone, value: 71, suffix: "%", label: { ar: "من زيارات المواقع في الخليج عبر الموبايل", en: "of GCC web traffic is mobile" } },
    { icon: ShoppingBag, value: 38, suffix: "%", label: { ar: "زيادة في التحويلات بعد إعادة التصميم الاحترافي", en: "average conversion lift after redesign" } },
    { icon: Search, value: 99, suffix: "/100", label: { ar: "Lighthouse Score نضمنه لكل مشروع", en: "Lighthouse score we deliver" } },
  ],
  social: [
    { icon: Users, value: 95, suffix: "%", label: { ar: "نسبة انتشار سوشيال ميديا بين سكان السعودية", en: "social media penetration in KSA" } },
    { icon: Smartphone, value: 7, suffix: "h+", label: { ar: "متوسط وقت تصفح المنصات يومياً", en: "average daily social media time" } },
    { icon: TrendingUp, value: 4, suffix: ".2x", label: { ar: "نمو متوسط للمتابعين العضويين خلال 6 شهور", en: "avg organic follower growth in 6 months" } },
    { icon: ShoppingBag, value: 67, suffix: "%", label: { ar: "من قرارات الشراء تتأثر بالسوشيال ميديا", en: "of purchases influenced by social" } },
  ],
  content: [
    { icon: Search, value: 70, suffix: "%", label: { ar: "من المستخدمين يفضلون التعرف على العلامة عبر المحتوى", en: "prefer learning brands via content" } },
    { icon: TrendingUp, value: 3, suffix: "x", label: { ar: "ليدز أكثر من المحتوى مقارنة بالإعلانات التقليدية", en: "more leads than traditional ads" } },
    { icon: Users, value: 60, suffix: "%", label: { ar: "زيادة في التفاعل مع المحتوى المخصص للقطاع", en: "engagement lift with niche content" } },
    { icon: Clock, value: 8, suffix: "m", label: { ar: "متوسط وقت قراءة مقالاتنا الطويلة", en: "average read time on our long-form" } },
  ],
};

const TITLES: Record<string, { ar: string; en: string; sub: { ar: string; en: string } }> = {
  seo: {
    ar: "السيو لم يعد رفاهية — إنه قناة الحياة",
    en: "SEO is no longer optional — it's your lifeline",
    sub: {
      ar: "أرقام السوق تكشف لماذا كل شركة جادّة تستثمر في السيو الآن قبل المنافسين.",
      en: "Market data reveals why every serious business is investing in SEO before competitors.",
    },
  },
  performance: {
    ar: "كل ريال إعلاني يجب أن يعود بأرباح",
    en: "Every ad dollar must return profit",
    sub: {
      ar: "إحصائيات السوق السعودي تُظهر أن الفرق بين الحملة الفاشلة والناجحة هو الإدارة الاحترافية.",
      en: "Saudi market data shows the difference between failure and success is professional management.",
    },
  },
  creative: {
    ar: "الكرييتيف هو من يبيع — ليس الميزانية",
    en: "Creative sells — not budget",
    sub: {
      ar: "الأرقام تثبت أن جودة الهوية البصرية والمحتوى تحدد نتيجة كل حملة إعلانية.",
      en: "Numbers prove visual identity and content quality determine every campaign's outcome.",
    },
  },
  web: {
    ar: "موقعك = واجهة عملك الحقيقية",
    en: "Your website = your real storefront",
    sub: {
      ar: "في الخليج، الموقع البطيء أو السيئ يعني خسارة عملاء كل ثانية.",
      en: "In the GCC, a slow or weak website means losing customers by the second.",
    },
  },
  social: {
    ar: "السوشيال ميديا = حيث يتواجد عملاؤك الآن",
    en: "Social media = where your customers live now",
    sub: {
      ar: "تواجدك القوي على المنصات لم يعد خياراً — هو شرط البقاء في السوق.",
      en: "A strong social presence isn't optional — it's how you stay in the game.",
    },
  },
  content: {
    ar: "المحتوى يبني الثقة قبل البيع",
    en: "Content builds trust before the sale",
    sub: {
      ar: "العلامات التي تنتج محتوى ذكياً تكسب ولاء العملاء وتقلل تكلفة الاكتساب.",
      en: "Brands producing smart content earn loyalty and lower acquisition cost.",
    },
  },
};

export function ServiceMarketSignals({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const signals = SIGNALS[slug] ?? SIGNALS.seo;
  const t = TITLES[slug] ?? TITLES.seo;

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" aria-hidden />
      <div className="container-app relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>{isAr ? "لماذا الآن" : "Why now"}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
            {isAr ? t.ar : t.en}
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{isAr ? t.sub.ar : t.sub.en}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <span
                  className="absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-10 transition group-hover:scale-150 group-hover:opacity-20"
                  style={{ background: "var(--svc)" }}
                  aria-hidden
                />
                <div
                  className="relative grid h-12 w-12 place-items-center rounded-2xl"
                  style={{ background: "var(--svc-soft)", color: "var(--svc-deep)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 text-4xl font-black tabular-nums text-ink md:text-5xl">
                  {s.prefix}<CountUp to={s.value} />{s.suffix}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {isAr ? s.label.ar : s.label.en}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
