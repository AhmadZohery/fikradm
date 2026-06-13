/**
 * Single source of truth for case studies / portfolio entries.
 *
 * HOW TO ADD A CASE STUDY
 * 1. Drop the cover image into `src/assets/case-studies/`:
 *      src/assets/case-studies/luxe-co.jpg   (1600x1000 recommended)
 * 2. Import it here and assign to `cover`:
 *      import luxeCo from "@/assets/case-studies/luxe-co.jpg";
 *      { slug: "luxe-co", cover: luxeCo, ... }
 * 3. `metrics` is optional — leave it empty `[]` until the client
 *    approves the numbers. The card renders cleanly either way.
 * 4. If `cover` is missing, the card falls back to a branded gradient
 *    placeholder using `accent` — safe to publish before the photo is ready.
 */

import type { ClientIndustry } from "./clients";

export type CaseStudy = {
  slug: string;
  industry: ClientIndustry;
  industryLabel: { ar: string; en: string };
  client: { ar: string; en: string };
  /** Optional link to a client in CLIENTS by slug — enables cross-linking. */
  clientSlug?: string;
  title: { ar: string; en: string };
  summary: { ar: string; en: string };
  /** Imported cover image. Falls back to gradient placeholder if missing. */
  cover?: string;
  /** Tailwind gradient classes used for accents + placeholder fallback. */
  accent: string;
  /**
   * Verified outcome metrics. Keep this empty until the client has
   * approved the numbers — the UI handles the empty state gracefully.
   */
  metrics: { value: string; label: { ar: string; en: string } }[];
  /** Services involved (chips). */
  services: string[];
  duration: { ar: string; en: string };
  /** Featured = surfaces on home page + at the top of the index. */
  featured?: boolean;
  /** When true, shows a "Approval pending" ribbon. */
  pendingApproval?: boolean;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "luxury-ecommerce",
    industry: "retail",
    industryLabel: { ar: "تجارة إلكترونية", en: "E-commerce" },
    client: { ar: "علامة فاخرة (سيُكشف بعد الموافقة)", en: "Luxury brand (name on approval)" },
    title: {
      ar: "إعادة هيكلة كاملة للحملات + CRO + برنامج ولاء",
      en: "Full ad restructure + CRO + a loyalty program",
    },
    summary: {
      ar: "Playbook عملي لمتجر فاخر: إعادة بناء قمع الإعلانات، تحسين تجربة صفحات المنتج، وإطلاق برنامج ولاء.",
      en: "A practical playbook for a luxury store: rebuild the ads funnel, optimize product page UX, and launch a loyalty program.",
    },
    accent: "from-fuchsia-500 to-violet-600",
    metrics: [],
    services: ["Meta Ads", "CRO", "Email"],
    duration: { ar: "6 أشهر", en: "6 months" },
    featured: true,
    pendingApproval: true,
  },
  {
    slug: "dental-network",
    industry: "healthcare",
    industryLabel: { ar: "قطاع طبي", en: "Healthcare" },
    client: { ar: "شبكة عيادات أسنان (بإذن العميل)", en: "Dental clinic network (name on approval)" },
    title: {
      ar: "قمع كامل + Conversions API لزيادة الحجوزات",
      en: "Full funnel + Conversions API to grow bookings",
    },
    summary: {
      ar: "بناء قمع تسويقي متكامل + كرييتيف يومي + ربط Conversions API لقياس دقيق للنتائج.",
      en: "End-to-end funnel build + daily creative + Conversions API for accurate measurement.",
    },
    accent: "from-rose-500 to-pink-600",
    metrics: [],
    services: ["Performance", "Creative"],
    duration: { ar: "4 أشهر", en: "4 months" },
    pendingApproval: true,
  },
  {
    slug: "real-estate-leads",
    industry: "real_estate",
    industryLabel: { ar: "عقاري", en: "Real Estate" },
    client: { ar: "مطور عقاري (بإذن العميل)", en: "Real estate developer (name on approval)" },
    title: {
      ar: "صفحات هبوط مخصصة لكل مشروع + سيو محلي + Google Ads",
      en: "Per-project landing pages + local SEO + Google Ads",
    },
    summary: {
      ar: "بنية صفحات هبوط لكل مشروع، سيو محلي، وحملات Google تقاس على مستوى الليد.",
      en: "A landing page per project, local SEO, and Google campaigns measured at the lead level.",
    },
    accent: "from-blue-500 to-cyan-600",
    metrics: [],
    services: ["SEO", "Landing", "Google"],
    duration: { ar: "9 أشهر", en: "9 months" },
    pendingApproval: true,
  },
  {
    slug: "education-tiktok",
    industry: "services",
    industryLabel: { ar: "أكاديمي", en: "Education" },
    client: { ar: "أكاديمية تعليم (بإذن العميل)", en: "Education academy (name on approval)" },
    title: { ar: "إعادة بناء قمع التسجيل عبر TikTok", en: "Enrolment funnel rebuild via TikTok" },
    summary: {
      ar: "إعادة بناء قمع التسجيل، إنتاج كرييتيف فيديو، وإدارة حملات TikTok بشكل تجريبي ومنهجي.",
      en: "Funnel rebuild, video creative production, and TikTok ads run with a structured experiment cadence.",
    },
    accent: "from-amber-500 to-orange-600",
    metrics: [],
    services: ["TikTok", "Funnel"],
    duration: { ar: "5 أشهر", en: "5 months" },
    pendingApproval: true,
  },
  {
    slug: "fb-content-engine",
    industry: "fb",
    industryLabel: { ar: "مطاعم وضيافة", en: "F&B" },
    client: { ar: "سلسلة مطاعم (بإذن العميل)", en: "Restaurant chain (name on approval)" },
    title: { ar: "هوية محدّثة + محرّك محتوى أسبوعي", en: "Refreshed identity + weekly content engine" },
    summary: {
      ar: "تحديث الهوية البصرية، إنتاج محتوى أسبوعي، وشراكات مع صنّاع محتوى محليين.",
      en: "Identity refresh, weekly content production, and partnerships with local creators.",
    },
    accent: "from-emerald-500 to-teal-600",
    metrics: [],
    services: ["Branding", "Social"],
    duration: { ar: "8 أشهر", en: "8 months" },
    pendingApproval: true,
  },
  {
    slug: "saas-topical-seo",
    industry: "tech",
    industryLabel: { ar: "B2B / SaaS", en: "B2B / SaaS" },
    client: { ar: "منصة SaaS (بإذن العميل)", en: "SaaS platform (name on approval)" },
    title: { ar: "Topical Authority + سيو تقني + بناء روابط آمن", en: "Topical authority + technical SEO + safe link building" },
    summary: {
      ar: "خريطة محتوى Topical Authority، إصلاح السيو التقني، وبناء روابط آمن خلال 9 أشهر.",
      en: "A topical authority content map, technical SEO fixes, and safe link building over 9 months.",
    },
    accent: "from-indigo-500 to-purple-600",
    metrics: [],
    services: ["SEO", "Content"],
    duration: { ar: "9 أشهر", en: "9 months" },
    pendingApproval: true,
  },
];

export function getFeaturedCaseStudies(): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.featured);
}