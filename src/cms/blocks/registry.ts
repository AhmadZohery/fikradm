import type { ComponentType } from "react";
import { HeroSlider } from "@/components/site/HeroSlider";
import { TrustStrip } from "@/components/site/cinematic/TrustStrip";
import { StatsBand } from "@/components/site/StatsBand";
import { LogosStrip } from "@/components/site/LogosStrip";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { ProcessSection } from "@/components/site/ProcessSection";
import { HomePackages } from "@/components/site/HomePackages";
import { PackageBuilder } from "@/components/site/PackageBuilder";
import { HomeBeforeAfter } from "@/components/site/HomeBeforeAfter";
import { HomeGuarantees } from "@/components/site/HomeGuarantees";
import { HomeResultsShowcase } from "@/components/site/HomeResultsShowcase";
import { IndustriesShowcase } from "@/components/site/IndustriesShowcase";
import { Testimonials } from "@/components/site/Testimonials";
import { HomeBlogTeaser } from "@/components/site/HomeBlogTeaser";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqSection } from "@/components/site/FaqSection";
import { HomeVideoTestimonials } from "@/components/site/HomeVideoTestimonials";
import { RichTextBlock } from "@/components/site/RichTextBlock";
import { HomeExpertiseTrust } from "@/components/site/HomeExpertiseTrust";
import { ClientsWall } from "@/components/site/ClientsWall";

/**
 * BlockInstance — the unit stored inside `pages.blocks` JSONB array.
 * `data` is optional: when omitted, the block uses its built-in static defaults
 * (sourced from src/content/data.ts). This lets admins reorder/show/hide blocks
 * immediately, while opening the door to per-block content overrides later.
 */
export type BlockInstance = {
  id: string;
  type: BlockType;
  visible?: boolean;
  data?: Record<string, unknown>;
  settings?: {
    paddingY?: "none" | "sm" | "md" | "lg";
    background?: "default" | "muted" | "primary";
    container?: "narrow" | "default" | "wide" | "full";
  };
};

type BlockEntry = {
  /** React component to render */
  component: ComponentType<any>;
  /** Human-readable label (Arabic) */
  label: string;
  /** Short description shown in the picker */
  description?: string;
  /** Lucide icon name (string — resolved in admin UI) */
  icon?: string;
  /** Category for the block library grouping */
  category: "hero" | "content" | "social" | "conversion" | "layout";
};

export const BLOCK_REGISTRY = {
  hero: {
    component: HeroSlider,
    label: "Hero — سلايدر رئيسي",
    description: "السلايدر الرئيسي لأعلى الصفحة",
    icon: "LayoutTemplate",
    category: "hero",
  },
  trust_strip: {
    component: TrustStrip,
    label: "شريط الثقة",
    description: "شارات الثقة وتحت الهيرو",
    icon: "ShieldCheck",
    category: "social",
  },
  stats_band: {
    component: StatsBand,
    label: "أرقام وإنجازات",
    description: "إحصائيات الشركة",
    icon: "BarChart3",
    category: "content",
  },
  services_grid: {
    component: ServicesGrid,
    label: "شبكة الخدمات",
    description: "كروت الخدمات الرئيسية",
    icon: "LayoutGrid",
    category: "content",
  },
  home_packages: {
    component: HomePackages,
    label: "الباقات المميزة",
    description: "باقات مختارة للعرض في الرئيسية",
    icon: "Package",
    category: "conversion",
  },
  before_after: {
    component: HomeBeforeAfter,
    label: "قبل وبعد",
    description: "مقارنة نتائج",
    icon: "GitCompare",
    category: "social",
  },
  results_showcase: {
    component: HomeResultsShowcase,
    label: "عرض النتائج",
    description: "نتائج العملاء",
    icon: "TrendingUp",
    category: "social",
  },
  package_builder: {
    component: PackageBuilder,
    label: "صانع الباقات",
    description: "أداة بناء باقة مخصصة",
    icon: "Wrench",
    category: "conversion",
  },
  guarantees: {
    component: HomeGuarantees,
    label: "ضماناتنا",
    description: "ضمانات وتعهدات الوكالة",
    icon: "BadgeCheck",
    category: "content",
  },
  process: {
    component: ProcessSection,
    label: "خطوات العمل",
    description: "خطوات منهجية العمل",
    icon: "ListChecks",
    category: "content",
  },
  testimonials: {
    component: Testimonials,
    label: "آراء العملاء",
    description: "Testimonials نصية",
    icon: "MessageSquareQuote",
    category: "social",
  },
  video_testimonials: {
    component: HomeVideoTestimonials,
    label: "فيديوهات العملاء",
    description: "آراء فيديو",
    icon: "Video",
    category: "social",
  },
  industries_showcase: {
    component: IndustriesShowcase,
    label: "الصناعات",
    description: "عرض الصناعات اللي بنخدمها",
    icon: "Building2",
    category: "content",
  },
  logos_strip: {
    component: LogosStrip,
    label: "شعارات الشركاء",
    description: "Trusted by",
    icon: "Tag",
    category: "social",
  },
  clients_wall: {
    component: ClientsWall,
    label: "جدار العملاء",
    description: "شبكة شعارات حقيقية + فلترة بالقطاع + رابط لكل العملاء",
    icon: "LayoutGrid",
    category: "social",
  },
  blog_teaser: {
    component: HomeBlogTeaser,
    label: "مقالات المدونة",
    description: "آخر المقالات",
    icon: "Newspaper",
    category: "content",
  },
  faq: {
    component: FaqSection,
    label: "الأسئلة الشائعة",
    description: "FAQ",
    icon: "HelpCircle",
    category: "content",
  },
  cta_band: {
    component: CtaBand,
    label: "شريط الـ CTA",
    description: "نداء للعمل",
    icon: "Megaphone",
    category: "conversion",
  },
  rich_text: {
    component: RichTextBlock,
    label: "نص حر (Rich Text)",
    description: "محرر نصوص متقدم بصور وروابط",
    icon: "Type",
    category: "content",
  },
  expertise_trust: {
    component: HomeExpertiseTrust,
    label: "الخبرة والتراخيص (EEAT)",
    description: "فريق + تراخيص + سياسات شفافية لرفع E-E-A-T و AI Overviews",
    icon: "ShieldCheck",
    category: "social",
  },
} as const satisfies Record<string, BlockEntry>;

export type BlockType = keyof typeof BLOCK_REGISTRY;

export function isKnownBlock(type: string): type is BlockType {
  return type in BLOCK_REGISTRY;
}

/** Default homepage block order (used as fallback when DB row is missing). */
export const DEFAULT_HOME_BLOCKS: BlockInstance[] = [
  { id: "b1", type: "hero" },
  { id: "b2", type: "trust_strip" },
  { id: "b3", type: "stats_band" },
  { id: "b4", type: "services_grid" },
  { id: "b5", type: "home_packages" },
  { id: "b6", type: "before_after" },
  { id: "b7", type: "results_showcase" },
  { id: "b8", type: "package_builder" },
  { id: "b9", type: "guarantees" },
  { id: "b10", type: "process" },
  { id: "b11", type: "expertise_trust" },
  { id: "b12", type: "testimonials" },
  { id: "b13", type: "industries_showcase" },
  { id: "b14", type: "clients_wall" },
  { id: "b15", type: "logos_strip" },
  { id: "b16", type: "blog_teaser" },
  { id: "b17", type: "cta_band" },
];
