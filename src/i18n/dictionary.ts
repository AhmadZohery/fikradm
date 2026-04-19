import type { Locale } from "./types";

type Dict = Record<string, string>;

const ar: Dict = {
  // Brand
  "brand.name": "فكرة",
  "brand.tagline": "للتسويق الرقمي",
  "brand.full": "فكرة للتسويق الرقمي",

  // Nav
  "nav.home": "الرئيسية",
  "nav.about": "من نحن",
  "nav.services": "خدماتنا",
  "nav.industries": "حلول حسب القطاع",
  "nav.cases": "قصص النجاح",
  "nav.blog": "المدونة",
  "nav.contact": "تواصل معنا",
  "nav.cta": "احجز استشارتك",
  "nav.menu": "القائمة",

  // Mega menu groups
  "menu.services.seo": "السيو والنمو العضوي",
  "menu.services.performance": "الأداء والإعلانات",
  "menu.services.creative": "الإنتاج الإبداعي",
  "menu.services.web": "الحلول البرمجية",
  "menu.industries.ecom": "نمو المتاجر الإلكترونية",
  "menu.industries.logistics": "اللوجستيات والتخليص",
  "menu.industries.healthcare": "القطاع الطبي والعيادات",
  "menu.industries.realestate": "القطاع العقاري",

  // Common
  "cta.primary": "احجز استشارتك المجانية",
  "cta.secondary": "اكتشف المزيد",
  "cta.contact": "تواصل معنا",
  "cta.choose": "اختر هذه الباقة",
  "common.popular": "الأكثر طلباً",
  "common.discount": "خصم {value}%",
  "common.from": "ابتداءً من",
  "common.month": "/شهر",
  "common.sar": "ر.س",
  "common.readmore": "اقرأ المزيد",
  "common.viewall": "عرض الكل",

  // Footer
  "footer.about": "وكالة تسويق رقمي مرخّصة في السعودية. نقدم حلول نمو متكاملة للمتاجر الإلكترونية والعلامات التجارية في الخليج.",
  "footer.quicklinks": "روابط سريعة",
  "footer.services": "الخدمات",
  "footer.locations": "خدماتنا في",
  "footer.contact": "للتواصل",
  "footer.rights": "جميع الحقوق محفوظة لـ فكرة للتسويق الرقمي",
  "footer.privacy": "سياسة الخصوصية",
  "footer.terms": "الشروط والأحكام",

  // Cookie
  "cookie.text": "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. باستمرارك في التصفح، فإنك توافق على استخدامنا لها.",
  "cookie.accept": "موافق",
  "cookie.decline": "رفض",
};

const en: Dict = {
  "brand.name": "Fikra",
  "brand.tagline": "Digital Marketing",
  "brand.full": "Fikra Digital Marketing",

  "nav.home": "Home",
  "nav.about": "About",
  "nav.services": "Services",
  "nav.industries": "Industries",
  "nav.cases": "Case Studies",
  "nav.blog": "Blog",
  "nav.contact": "Contact",
  "nav.cta": "Book Consultation",
  "nav.menu": "Menu",

  "menu.services.seo": "SEO & Organic Growth",
  "menu.services.performance": "Performance Marketing",
  "menu.services.creative": "Creative Production",
  "menu.services.web": "Web Solutions",
  "menu.industries.ecom": "E-commerce Growth",
  "menu.industries.logistics": "Logistics & Customs",
  "menu.industries.healthcare": "Healthcare Marketing",
  "menu.industries.realestate": "Real Estate Marketing",

  "cta.primary": "Book a Free Consultation",
  "cta.secondary": "Learn More",
  "cta.contact": "Contact Us",
  "cta.choose": "Choose this plan",
  "common.popular": "Most Popular",
  "common.discount": "{value}% OFF",
  "common.from": "Starting from",
  "common.month": "/month",
  "common.sar": "SAR",
  "common.readmore": "Read more",
  "common.viewall": "View all",

  "footer.about": "A licensed digital marketing agency in Saudi Arabia. We deliver integrated growth solutions for e-commerce and brands across the Gulf.",
  "footer.quicklinks": "Quick Links",
  "footer.services": "Services",
  "footer.locations": "We serve",
  "footer.contact": "Contact",
  "footer.rights": "All rights reserved · Fikra Digital Marketing",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms & Conditions",

  "cookie.text": "We use cookies to improve your experience. By continuing, you agree to our use of cookies.",
  "cookie.accept": "Accept",
  "cookie.decline": "Decline",
};

const dict: Record<Locale, Dict> = { ar, en };

export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const value = dict[locale][key] ?? dict.ar[key] ?? key;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
