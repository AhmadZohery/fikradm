import type { Locale } from "@/i18n/types";

export type LocalizedString = { ar: string; en: string };
export type LocalizedList = { ar: string[]; en: string[] };

export function pick(loc: Locale, v: LocalizedString): string {
  return v[loc];
}
export function pickList(loc: Locale, v: LocalizedList): string[] {
  return v[loc];
}

export type PricingPlan = {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  priceSar: number; // monthly
  originalPriceSar?: number; // for discount strike
  discountPct?: number;
  features: LocalizedList;
  highlighted?: boolean;
  ctaLabel?: LocalizedString;
};

export type FaqItem = { q: LocalizedString; a: LocalizedString };

export type ServiceMeta = {
  slug: string;
  title: LocalizedString;
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  intro: LocalizedString;
  highlights: LocalizedList;
  process: { step: LocalizedString; detail: LocalizedString }[];
  deliverables: LocalizedList;
  audience: LocalizedList;
  faqs: FaqItem[];
  plans: PricingPlan[];
  image: string;
  group?: string;
  subServices?: SubServiceMeta[];
};

export type SubServiceMeta = {
  slug: string;
  parentSlug: string;
  title: LocalizedString;
  shortLabel: LocalizedString;
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  intro: LocalizedString;
  highlights: LocalizedList;
  process: { step: LocalizedString; detail: LocalizedString }[];
  deliverables: LocalizedList;
  faqs: FaqItem[];
  plans: PricingPlan[];
  image: string;
  icon?: string;
};

export type IndustryMeta = {
  slug: string;
  title: LocalizedString;
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  intro: LocalizedString;
  pains: LocalizedList;
  solutions: LocalizedList;
  outcomes: { value: string; label: LocalizedString }[];
  faqs: FaqItem[];
  plans: PricingPlan[];
  image: string;
};
