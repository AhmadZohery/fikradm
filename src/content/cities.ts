/**
 * City + Service catalog for local SEO landing pages.
 * Each combination produces a unique landing page with LocalBusiness schema.
 */

export type CityKey =
  | "riyadh" | "jeddah" | "dammam"
  | "dubai" | "abu-dhabi"
  | "cairo" | "kuwait" | "doha";

export type ServiceKey =
  | "seo" | "performance-marketing" | "creative" | "web-development" | "social-media";

export type Bilingual = { ar: string; en: string };

export type City = {
  key: CityKey;
  slug: { ar: string; en: string };
  name: Bilingual;
  country: Bilingual;
  countryCode: string;          // ISO 3166-1 alpha-2
  region: Bilingual;
  latitude: number;
  longitude: number;
  phone: string;
  currency: string;
  // Marketing copy
  tagline: Bilingual;
  marketInsight: Bilingual;
  // Local trust signals
  population: string;            // e.g. "7.5M"
  internetPenetration: string;   // e.g. "98%"
  topIndustries: Bilingual[];    // 3 sectors
};

export type ServiceMeta = {
  key: ServiceKey;
  slug: string;            // matches /services/<slug>
  name: Bilingual;
  shortDesc: Bilingual;
  benefits: Bilingual[];   // 4 bullet points
  serviceType: string;     // schema.org serviceType
  // KPIs the service is judged on (used for local result cards)
  kpis: { label: Bilingual; baseValue: number; suffix: string }[];
  // Sample case-study briefs (anonymized, generic)
  caseBrief: Bilingual;
};

export const CITIES: City[] = [
  {
    key: "riyadh",
    slug: { ar: "الرياض", en: "riyadh" },
    name: { ar: "الرياض", en: "Riyadh" },
    country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
    countryCode: "SA",
    region: { ar: "منطقة الرياض", en: "Riyadh Province" },
    latitude: 24.7136, longitude: 46.6753,
    phone: "+966-50-000-0000", currency: "SAR",
    tagline: {
      ar: "وكالتك الرقمية في قلب الرياض — نتائج محلية بمعايير عالمية.",
      en: "Your digital agency in the heart of Riyadh — local results, global standards.",
    },
    marketInsight: {
      ar: "سوق الرياض هو الأسرع نمواً في الخليج رقمياً، مع تحول ملحوظ نحو البحث الصوتي والـ AI Overviews.",
      en: "Riyadh is the fastest-growing digital market in the Gulf, with a noticeable shift toward voice search and AI Overviews.",
    },
  },
  {
    key: "jeddah",
    slug: { ar: "جدة", en: "jeddah" },
    name: { ar: "جدة", en: "Jeddah" },
    country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
    countryCode: "SA",
    region: { ar: "منطقة مكة المكرمة", en: "Makkah Region" },
    latitude: 21.4858, longitude: 39.1925,
    phone: "+966-50-000-0000", currency: "SAR",
    tagline: {
      ar: "تسويق رقمي في جدة بفهم عميق لسوق الساحل الغربي.",
      en: "Digital marketing in Jeddah with deep understanding of the West Coast market.",
    },
    marketInsight: {
      ar: "المستهلك الجداوي يعتمد بشكل أكبر على Instagram وTikTok مقارنة بمدن المملكة الأخرى.",
      en: "Jeddah consumers rely more on Instagram and TikTok than other Saudi cities.",
    },
  },
  {
    key: "dammam",
    slug: { ar: "الدمام", en: "dammam" },
    name: { ar: "الدمام", en: "Dammam" },
    country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
    countryCode: "SA",
    region: { ar: "المنطقة الشرقية", en: "Eastern Province" },
    latitude: 26.4207, longitude: 50.0888,
    phone: "+966-50-000-0000", currency: "SAR",
    tagline: {
      ar: "خدمات تسويق رقمي للشركات في المنطقة الشرقية وقطاع الطاقة.",
      en: "Digital marketing for Eastern Province businesses and the energy sector.",
    },
    marketInsight: {
      ar: "اقتصاد المنطقة الشرقية يقوده B2B وخدمات الطاقة، ويتطلب محتوى تقني متخصص.",
      en: "The Eastern economy is B2B and energy-led, requiring specialized technical content.",
    },
  },
  {
    key: "dubai",
    slug: { ar: "دبي", en: "dubai" },
    name: { ar: "دبي", en: "Dubai" },
    country: { ar: "الإمارات العربية المتحدة", en: "United Arab Emirates" },
    countryCode: "AE",
    region: { ar: "إمارة دبي", en: "Emirate of Dubai" },
    latitude: 25.2048, longitude: 55.2708,
    phone: "+971-50-000-0000", currency: "AED",
    tagline: {
      ar: "نموّ رقمي في دبي بمزيج من السرعة، التصميم، والـ ROI.",
      en: "Digital growth in Dubai blending speed, design, and ROI.",
    },
    marketInsight: {
      ar: "سوق دبي تنافسي بشكل استثنائي، وتكلفة النقرة فيه أعلى بـ 2-3 أضعاف عن متوسط الخليج.",
      en: "Dubai's market is exceptionally competitive — CPC runs 2–3× the Gulf average.",
    },
  },
  {
    key: "abu-dhabi",
    slug: { ar: "أبوظبي", en: "abu-dhabi" },
    name: { ar: "أبوظبي", en: "Abu Dhabi" },
    country: { ar: "الإمارات العربية المتحدة", en: "United Arab Emirates" },
    countryCode: "AE",
    region: { ar: "إمارة أبوظبي", en: "Emirate of Abu Dhabi" },
    latitude: 24.4539, longitude: 54.3773,
    phone: "+971-50-000-0000", currency: "AED",
    tagline: {
      ar: "حلول تسويق رقمي للقطاع الحكومي والشركات الكبرى في أبوظبي.",
      en: "Digital marketing solutions for government and enterprise in Abu Dhabi.",
    },
    marketInsight: {
      ar: "أبوظبي تعتمد على المحتوى المتعدد اللغات والامتثال لمعايير TDRA.",
      en: "Abu Dhabi requires multilingual content and TDRA compliance standards.",
    },
  },
  {
    key: "cairo",
    slug: { ar: "القاهرة", en: "cairo" },
    name: { ar: "القاهرة", en: "Cairo" },
    country: { ar: "جمهورية مصر العربية", en: "Egypt" },
    countryCode: "EG",
    region: { ar: "محافظة القاهرة", en: "Cairo Governorate" },
    latitude: 30.0444, longitude: 31.2357,
    phone: "+20-10-0000-0000", currency: "EGP",
    tagline: {
      ar: "تسويق رقمي في القاهرة بميزانيات ذكية وعائد مدروس.",
      en: "Smart-budget digital marketing in Cairo with measurable ROI.",
    },
    marketInsight: {
      ar: "السوق المصري يقوده Facebook وTikTok بأرخص تكلفة وصول في الشرق الأوسط.",
      en: "The Egyptian market is led by Facebook and TikTok with the lowest reach cost in the Middle East.",
    },
  },
  {
    key: "kuwait",
    slug: { ar: "الكويت", en: "kuwait" },
    name: { ar: "الكويت", en: "Kuwait City" },
    country: { ar: "دولة الكويت", en: "Kuwait" },
    countryCode: "KW",
    region: { ar: "محافظة العاصمة", en: "Capital Governorate" },
    latitude: 29.3759, longitude: 47.9774,
    phone: "+965-0000-0000", currency: "KWD",
    tagline: {
      ar: "خدمات تسويق رقمي للشركات الكويتية بميزانيات تنافسية.",
      en: "Digital marketing for Kuwaiti businesses with competitive budgets.",
    },
    marketInsight: {
      ar: "المستخدم الكويتي من أعلى المستخدمين إنفاقاً على المتاجر الإلكترونية في الخليج.",
      en: "Kuwaiti users are among the highest e-commerce spenders in the Gulf.",
    },
  },
  {
    key: "doha",
    slug: { ar: "الدوحة", en: "doha" },
    name: { ar: "الدوحة", en: "Doha" },
    country: { ar: "دولة قطر", en: "Qatar" },
    countryCode: "QA",
    region: { ar: "بلدية الدوحة", en: "Doha Municipality" },
    latitude: 25.2854, longitude: 51.5310,
    phone: "+974-0000-0000", currency: "QAR",
    tagline: {
      ar: "تسويق رقمي في الدوحة لقطاعات الضيافة والعقار والـ B2B.",
      en: "Digital marketing in Doha for hospitality, real-estate, and B2B sectors.",
    },
    marketInsight: {
      ar: "السوق القطري متعدد الجنسيات ويتطلب استراتيجيات بثلاث لغات على الأقل.",
      en: "Qatar's multinational market needs strategies in at least three languages.",
    },
  },
];

export const SERVICES: ServiceMeta[] = [
  {
    key: "seo",
    slug: "seo",
    name: { ar: "تحسين محركات البحث (SEO)", en: "Search Engine Optimization (SEO)" },
    shortDesc: {
      ar: "ظهور أعلى في Google ونمو عضوي مستدام عبر استراتيجية SEO تقنية ومحتوى محلي.",
      en: "Higher Google rankings and sustainable organic growth via technical SEO + local content.",
    },
    benefits: [
      { ar: "بحث الكلمات المفتاحية المحلية", en: "Local keyword research" },
      { ar: "تحسين تقني وسرعة الموقع", en: "Technical & speed optimization" },
      { ar: "ملف Google Business مُدار", en: "Managed Google Business Profile" },
      { ar: "بناء روابط محلية موثوقة", en: "Trusted local link-building" },
    ],
    serviceType: "Search Engine Optimization",
  },
  {
    key: "performance-marketing",
    slug: "performance-marketing",
    name: { ar: "إعلانات الأداء", en: "Performance Marketing" },
    shortDesc: {
      ar: "حملات Google وMeta وTikTok مدارة بدقة لخفض CPA ورفع الـ ROAS.",
      en: "Tightly-managed Google, Meta and TikTok campaigns to lower CPA and lift ROAS.",
    },
    benefits: [
      { ar: "استهداف جغرافي دقيق", en: "Precise geo-targeting" },
      { ar: "تحسين معدلات التحويل (CRO)", en: "Conversion-rate optimization" },
      { ar: "تتبع كامل للأحداث وReporting", en: "Full event tracking & reporting" },
      { ar: "اختبارات A/B إبداعية مستمرة", en: "Continuous creative A/B testing" },
    ],
    serviceType: "Performance Marketing",
  },
  {
    key: "creative",
    slug: "creative",
    name: { ar: "الإنتاج الإبداعي", en: "Creative Production" },
    shortDesc: {
      ar: "إنتاج فيديو وصور ومحتوى يعبّر عن الهوية المحلية ويرفع التفاعل.",
      en: "Video, photo and content production that captures local identity and lifts engagement.",
    },
    benefits: [
      { ar: "تصوير احترافي بمواقع داخل المدينة", en: "Pro on-location shoots in-city" },
      { ar: "إنتاج Reels وTikToks بتنسيق عالي", en: "High-tempo Reels & TikTok production" },
      { ar: "هوية بصرية متماسكة", en: "Cohesive visual identity" },
      { ar: "صياغة عربية وإنجليزية", en: "Arabic + English copywriting" },
    ],
    serviceType: "Creative Production",
  },
  {
    key: "web-development",
    slug: "web-development",
    name: { ar: "تصميم وتطوير المواقع", en: "Web Design & Development" },
    shortDesc: {
      ar: "مواقع سريعة، آمنة، ومحسّنة لمحركات البحث ومتوافقة مع التجارة الإلكترونية المحلية.",
      en: "Fast, secure, SEO-ready websites compatible with local e-commerce stacks.",
    },
    benefits: [
      { ar: "Core Web Vitals خضراء", en: "Green Core Web Vitals" },
      { ar: "تكامل مع mada وApple Pay", en: "mada & Apple Pay integration" },
      { ar: "دعم RTL/LTR كامل", en: "Full RTL/LTR support" },
      { ar: "بنية SEO جاهزة", en: "SEO-ready architecture" },
    ],
    serviceType: "Web Development",
  },
  {
    key: "social-media",
    slug: "social-media",
    name: { ar: "إدارة وسائل التواصل", en: "Social Media Management" },
    shortDesc: {
      ar: "إدارة كاملة لحساباتك مع محتوى أصلي، ردود سريعة، ونمو عضوي.",
      en: "End-to-end management with original content, fast replies, and organic growth.",
    },
    benefits: [
      { ar: "تقويم محتوى شهري", en: "Monthly content calendar" },
      { ar: "إدارة مجتمع وردود يومية", en: "Daily community management" },
      { ar: "تقارير أداء أسبوعية", en: "Weekly performance reports" },
      { ar: "تعاون مع مؤثرين محليين", en: "Local influencer collaborations" },
    ],
    serviceType: "Social Media Management",
  },
];

export function findCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug.ar === slug || c.slug.en === slug || c.key === slug);
}
export function findService(slug: string): ServiceMeta | undefined {
  return SERVICES.find((s) => s.slug === slug || s.key === slug);
}

/** Build the canonical landing page slug for a city × service combo. */
export function cityServicePath(city: City, service: ServiceMeta, locale: "ar" | "en"): string {
  return `/${locale}/locations/${city.slug.en}/${service.slug}`;
}
