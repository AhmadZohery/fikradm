import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

/**
 * Dynamic end-of-article CTA. Picks the service that best matches the post's
 * category and renders a focused, single-action card optimised for CTR.
 * No competing links, strong contrast, value-first copy.
 */

type Offer = {
  href: string;
  eyebrow: { ar: string; en: string };
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  bullets: { ar: string; en: string }[];
  button: { ar: string; en: string };
};

const OFFERS: Record<string, Offer> = {
  seo: {
    href: "/services/seo",
    eyebrow: { ar: "خدمة SEO المتخصصة", en: "Specialized SEO service" },
    title: {
      ar: "تصدّر جوجل قبل منافسيك بخطة SEO مبنية على بياناتك.",
      en: "Outrank competitors with an SEO plan built on your data.",
    },
    description: {
      ar: "نراجع موقعك تقنيًا، نبني محتوى يستهدف نية الشراء، ونرفع ترتيبك للكلمات اللي تجيب عملاء فعلًا.",
      en: "We audit you technically, build buyer-intent content, and rank you for keywords that actually convert.",
    },
    bullets: [
      { ar: "تدقيق سيو تقني مجاني", en: "Free technical SEO audit" },
      { ar: "خطة محتوى بأولويات واضحة", en: "Prioritized content roadmap" },
      { ar: "تقارير شهرية قابلة للقياس", en: "Measurable monthly reports" },
    ],
    button: { ar: "احجز جلسة SEO مجانية", en: "Book a free SEO session" },
  },
  performance: {
    href: "/services/performance",
    eyebrow: { ar: "إدارة الحملات المدفوعة", en: "Paid media management" },
    title: {
      ar: "حوّل ميزانيتك الإعلانية إلى عملاء، مش مجرد نقرات.",
      en: "Turn your ad budget into customers — not just clicks.",
    },
    description: {
      ar: "حملات Meta وGoogle وTikTok بإعداد تتبّع كامل، تحسين أسبوعي، وتقارير ROAS واضحة.",
      en: "Meta, Google & TikTok campaigns with full tracking, weekly optimisation and clear ROAS reports.",
    },
    bullets: [
      { ar: "تشخيص مجاني لحساباتك الحالية", en: "Free audit of current accounts" },
      { ar: "إعداد تتبّع وأحداث احترافي", en: "Pro tracking & events setup" },
      { ar: "تحسين على ROAS وليس CPC فقط", en: "Optimised for ROAS, not just CPC" },
    ],
    button: { ar: "اطلب تشخيص حملاتك مجانًا", en: "Get a free campaign diagnosis" },
  },
  ecommerce: {
    href: "/services/ecommerce",
    eyebrow: { ar: "نمو المتاجر الإلكترونية", en: "E-commerce growth" },
    title: {
      ar: "ضاعف مبيعات متجرك بدون زيادة في ميزانية الإعلانات.",
      en: "Double your store sales without raising ad spend.",
    },
    description: {
      ar: "نشتغل على معدّل التحويل، متوسط الطلب، ومعدّل الاحتفاظ — في سلة، زد، وشوبيفاي.",
      en: "We move the needle on CR, AOV and retention — across Salla, Zid and Shopify.",
    },
    bullets: [
      { ar: "مراجعة CRO لصفحات المنتجات", en: "Product page CRO review" },
      { ar: "خطة Email/SMS لرفع LTV", en: "Email/SMS plan to lift LTV" },
      { ar: "تكامل تتبّع المبيعات بدقة", en: "Accurate sales tracking integration" },
    ],
    button: { ar: "احجز جلسة نمو لمتجرك", en: "Book a store growth session" },
  },
  creative: {
    href: "/services/creative",
    eyebrow: { ar: "محتوى وإبداع يبيع", en: "Creative that sells" },
    title: {
      ar: "محتوى وفيديوهات تخلّي علامتك تتذكر — وتبيع.",
      en: "Content & video that make your brand remembered — and bought.",
    },
    description: {
      ar: "كتابة، تصميم، وموشن جرافيك مبني على رسائل بيعية مختبرة، مش مجرد جماليات.",
      en: "Copy, design and motion built on tested sales messages — not just aesthetics.",
    },
    bullets: [
      { ar: "سكربتات إعلانية بمعادلات Hook–Story–Offer", en: "Hook–Story–Offer ad scripts" },
      { ar: "هوية بصرية متّسقة", en: "Consistent visual identity" },
      { ar: "تسليم سريع وجودة استوديو", en: "Studio quality, fast turnaround" },
    ],
    button: { ar: "اطلب نماذج وعرض سعر", en: "Request samples & a quote" },
  },
  web: {
    href: "/services/web",
    eyebrow: { ar: "تطوير وتحسين المواقع", en: "Web build & optimisation" },
    title: {
      ar: "موقع سريع، يبيع، ومتوافق مع جوجل من اليوم الأول.",
      en: "A fast, selling, Google-friendly website from day one.",
    },
    description: {
      ar: "نبني/نحسّن موقعك على ووردبريس أو Headless مع Core Web Vitals خضراء وتحويل عالي.",
      en: "We build/optimise your site on WordPress or Headless with green Core Web Vitals and high CR.",
    },
    bullets: [
      { ar: "فحص سرعة وCWV مجاني", en: "Free speed & CWV check" },
      { ar: "بنية SEO جاهزة من البداية", en: "SEO-ready architecture" },
      { ar: "تكامل تتبّع وتحليلات كامل", en: "Full analytics & tracking" },
    ],
    button: { ar: "احجز فحص مجاني للموقع", en: "Get a free website check" },
  },
};

const FALLBACK: Offer = {
  href: "/contact",
  eyebrow: { ar: "جلسة تشخيص مجانية", en: "Free diagnosis session" },
  title: {
    ar: "خلّي خبراء فكرة يبنوا لك خطة نمو مخصصة.",
    en: "Let Fikra experts craft a custom growth plan for you.",
  },
  description: {
    ar: "30 دقيقة بدون التزام: نفهم وضعك، نحدّد أكبر الفرص، ونرسم لك خطوات عملية.",
    en: "30 minutes, no strings: we understand your situation, find the biggest opportunities, and map clear next steps.",
  },
  bullets: [
    { ar: "تشخيص رقمي شامل", en: "Comprehensive digital diagnosis" },
    { ar: "أولويات قابلة للتنفيذ فورًا", en: "Actionable priorities" },
    { ar: "بدون عروض بيعية مزعجة", en: "Zero pushy sales pitches" },
  ],
  button: { ar: "احجز جلستك المجانية", en: "Book your free session" },
};

export function BlogDynamicCta({ categorySlug }: { categorySlug: string }) {
  const { locale, buildHref } = useLocale();
  const isAr = locale === "ar";
  const offer = OFFERS[categorySlug] ?? FALLBACK;
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <aside
      aria-label={isAr ? "دعوة للتواصل" : "Call to action"}
      className="my-12 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-background p-7 shadow-elegant md:p-10"
      data-cta="blog-dynamic"
      data-category={categorySlug}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        {offer.eyebrow[isAr ? "ar" : "en"]}
      </span>
      <h3 className="mt-4 text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
        {offer.title[isAr ? "ar" : "en"]}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-foreground/80 md:text-lg">
        {offer.description[isAr ? "ar" : "en"]}
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-3">
        {offer.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{b[isAr ? "ar" : "en"]}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          to={buildHref(locale, offer.href)}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.03] active:scale-95 md:text-base"
          data-cta-action="primary"
        >
          {offer.button[isAr ? "ar" : "en"]}
          <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </aside>
  );
}