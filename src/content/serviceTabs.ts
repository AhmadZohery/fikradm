import type { LocalizedString, FaqItem } from "./types";

const ls = (ar: string, en: string): LocalizedString => ({ ar, en });

/**
 * Visual personality of a service page — drives the tabbed section's look.
 * Each personality changes accent gradient, decorative motif, icon set, and tab style.
 */
export type ServicePersonality =
  | "data"        // SEO       — charts, search bars, metrics
  | "rocket"      // Performance Ads — speed, ROI, energy
  | "palette"     // Branding  — color swatches, typography
  | "frame"       // Video/Motion — storyboard, film strip
  | "code"        // Web Dev   — terminal, grid
  | "blueprint"   // Strategy  — grid lines, blueprint
  | "feed"        // Social Media — phone mock, posts
  | "device"      // Mobile Apps — phone device frame
  | "dashboard"   // CRM/ERP   — kanban, dashboard widgets
  | "neural"      // AI Agents — futuristic gradient mesh
  | "conversation"; // Consulting — minimal premium chat

export type ServiceTabContent = {
  slug: string;
  hero: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    tagline: LocalizedString;
    intro: LocalizedString;
  };
  features: { ar: string[]; en: string[] };
  deliverables: { ar: string[]; en: string[] };
  process: Array<{ step: LocalizedString; detail: LocalizedString }>;
  audience: { ar: string[]; en: string[] };
  faqs: FaqItem[];
  cta: LocalizedString;
  personality: ServicePersonality;
};

export const SERVICE_TAB_CONTENT: Record<string, ServiceTabContent> = {
  // 1) SEO — تهيئة محركات البحث
  seo: {
    slug: "seo",
    personality: "data",
    hero: {
      eyebrow: ls("تهيئة محركات البحث (SEO)", "Search Engine Optimization"),
      title: ls("خدمات SEO لتحسين محركات البحث", "Professional SEO Services"),
      tagline: ls(
        "حضور عضوي قوي في جوجل يجلب عملاء مجانيين لأشهر وسنوات",
        "Strong organic presence on Google that brings free customers for months and years",
      ),
      intro: ls(
        "بينما تتوقف الإعلانات فور انتهاء الميزانية، يستمر الـ SEO في جلب العملاء لأشهر وسنوات. في فكرة، نبني حضوراً قوياً في جوجل يستهدف عملاءك في اللحظة التي يبحثون فيها عن خدماتك.",
        "While ads stop the moment the budget ends, SEO keeps bringing customers for months and years. At Fikra, we build a strong Google presence that targets your customers exactly when they are searching for your services.",
      ),
    },
    features: {
      ar: [
        "Technical SEO: تدقيق تقني كامل وإصلاح كل ما يمنع الفهرسة الصحيحة",
        "On-Page SEO: تحسين عناوين الصفحات والوصف والمحتوى والروابط الداخلية",
        "Keyword Research بالعربي: بحث معمق عن الكلمات التي يستخدمها عملاؤك الفعليون",
        "Content SEO: محتوى عربي يستهدف كلمات مفتاحية حقيقية ويبني سلطة موضوعية",
        "Off-Page SEO: بناء باك لينكس من مصادر موثوقة عربية ودولية",
        "Local SEO: تحسين الظهور في نتائج البحث المحلية لكل مدينة",
        "تقارير شهرية شفافة بالترتيب والزيارات والتحسينات المنجزة",
      ],
      en: [
        "Technical SEO: full technical audit and fixes that unblock proper indexing",
        "On-Page SEO: optimized titles, meta descriptions, content and internal links",
        "Arabic keyword research: deep discovery of the queries your real customers use",
        "Content SEO: Arabic content that targets real keywords and builds topical authority",
        "Off-Page SEO: backlinks from trusted Arabic and international sources",
        "Local SEO: visibility in local results for every target city",
        "Transparent monthly reports with rankings, traffic and completed improvements",
      ],
    },
    deliverables: {
      ar: [
        "SEO Audit شامل (أكثر من 100 نقطة تقنية)",
        "خريطة كلمات مفتاحية (Keyword Map)",
        "Content Map لكل مراحل رحلة العميل",
        "تقرير شهري بالأداء الحقيقي",
      ],
      en: [
        "Comprehensive SEO audit (100+ technical checks)",
        "Full keyword map",
        "Content map for every customer-journey stage",
        "Monthly report with real performance numbers",
      ],
    },
    process: [
      {
        step: ls("SEO Audit الشامل", "Comprehensive SEO audit"),
        detail: ls("فحص أكثر من 100 نقطة تقنية وتحديد أولويات الإصلاح حسب الأثر المتوقع.", "100+ technical checks and prioritized fixes ranked by expected impact."),
      },
      {
        step: ls("الكلمات المفتاحية وخريطة المحتوى", "Keywords & content map"),
        detail: ls("نحدد الكلمات الأنسب لكل صفحة ونبني خريطة محتوى تغطي رحلة العميل كاملة.", "We pick the right keywords per page and map content across the full customer journey."),
      },
      {
        step: ls("التحسين التقني والمحتوى", "Technical & content optimization"),
        detail: ls("ننفذ الإصلاحات التقنية ونحسّن المحتوى ونبني الروابط بمنهجية واضحة.", "We ship technical fixes, refine content, and build links on a clear methodology."),
      },
      {
        step: ls("المتابعة والتحسين المستمر", "Tracking & continuous iteration"),
        detail: ls("متابعة شهرية لأداء الكلمات وتعديل الاستراتيجية حسب البيانات الفعلية.", "Monthly monitoring of keyword performance with strategy tuning based on real data."),
      },
    ],
    audience: {
      ar: [
        "المواقع التي تريد ترتيباً أفضل في جوجل وزيارات مجانية",
        "الأعمال التي تنفق على إعلانات وتريد بناء مصدر مجاني موازٍ",
        "المتاجر الإلكترونية التي تريد ظهوراً أفضل في نتائج البحث",
        "الشركات الجديدة التي تبني حضورها الرقمي من الصفر",
      ],
      en: [
        "Websites that want better Google rankings and free traffic",
        "Businesses spending on ads and wanting a free parallel channel",
        "E-commerce stores that want stronger search visibility",
        "New companies building their digital presence from scratch",
      ],
    },
    faqs: [
      {
        q: ls("هل تضمنون الوصول للصفحة الأولى في جوجل؟", "Do you guarantee a #1 ranking on Google?"),
        a: ls(
          "لا توجد شركة SEO أمينة تضمن ترتيباً محدداً. ما نضمنه هو عمل احترافي ومنهجي وشفاف يمنحك أفضل فرصة للتقدم بشكل مستدام.",
          "No honest SEO company guarantees a fixed ranking. What we guarantee is professional, methodical, transparent work that gives you the best chance to grow sustainably.",
        ),
      },
      {
        q: ls("متى تبدأ نتائج SEO في الظهور؟", "When do SEO results start showing?"),
        a: ls(
          "الكلمات Long-tail تبدأ في الظهور خلال 30 إلى 45 يوماً. نتائج أكثر اتساعاً بين الشهر الثالث والسادس.",
          "Long-tail keywords begin moving in 30–45 days. Broader results appear between months 3 and 6.",
        ),
      },
      {
        q: ls("هل تعملون على SEO باللغة العربية؟", "Do you do Arabic SEO?"),
        a: ls(
          "نعم. متخصصون في SEO عربي لأسواق مصر والسعودية والإمارات والكويت، بما يشمل الكلمات المفتاحية العربية وخصائص البحث في كل سوق.",
          "Yes. We specialize in Arabic SEO for Egypt, KSA, UAE and Kuwait — including Arabic keywords and per-market search behavior.",
        ),
      },
      {
        q: ls("كم تكلفة خدمات SEO شهرياً؟", "How much does SEO cost per month?"),
        a: ls(
          "التكلفة تتوقف على حجم الموقع وعدد الكلمات المستهدفة. تواصل معنا للحصول على تدقيق SEO أولي مجاني وعرض سعر مخصص.",
          "It depends on site size and keyword count. Contact us for a free initial SEO audit and a tailored quote.",
        ),
      },
    ],
    cta: ls("ابدأ بتدقيق SEO مجاني لموقعك — تواصل معنا الآن.", "Start with a free SEO audit — talk to us now."),
  },

  // 2) Performance Marketing — إعلانات مدفوعة
  performance: {
    slug: "performance",
    personality: "rocket",
    hero: {
      eyebrow: ls("الأداء والإعلانات الممولة", "Performance Marketing"),
      title: ls("إعلانات مدفوعة بعائد حقيقي", "Paid ads with real ROI"),
      tagline: ls(
        "كل ريال إعلاني له هدف، وكل حملة تُقاس بالنتائج لا بالانطباعات",
        "Every ad dollar has a goal — every campaign measured by results, not impressions",
      ),
      intro: ls(
        "ندير حملاتك على Meta وGoogle وTikTok وSnap بمنهجية مبنية على البيانات وكرييتيف يبيع — لتحويل الميزانية الإعلانية إلى أرباح قابلة للقياس.",
        "We run your Meta, Google, TikTok and Snap campaigns with data-driven methodology and selling creative — turning ad budget into measurable profit.",
      ),
    },
    features: {
      ar: [
        "إدارة احترافية لـ Meta و Google و TikTok و Snapchat في مكان واحد",
        "تتبع تحويلات متقدم (Server-side + Conversions API) لبيانات أنظف",
        "إنتاج كرييتيف يومي/أسبوعي يختبر زوايا بيع متعددة",
        "اختبارات A/B مستمرة على الجمهور والكرييتيف وصفحات الهبوط",
        "تحسين CRO على Funnel كامل من الإعلان حتى الدفع",
        "تقارير شفافة بـ ROAS وCAC وLTV — لا أرقام تجميل",
        "مدير حساب مخصص ومكالمات استراتيجية أسبوعية",
      ],
      en: [
        "Pro management for Meta, Google, TikTok and Snapchat in one place",
        "Advanced server-side tracking + Conversions API for cleaner data",
        "Daily/weekly creative testing multiple selling angles",
        "Continuous A/B tests on audience, creative and landing pages",
        "Funnel-wide CRO from ad through checkout",
        "Transparent ROAS, CAC and LTV reporting — no vanity metrics",
        "Dedicated account manager and weekly strategy calls",
      ],
    },
    deliverables: {
      ar: [
        "إعداد كامل للحملات وبنية التتبع (Pixels/GTM/CAPI)",
        "كرييتيف شهري (تصاميم + فيديوهات قصيرة)",
        "Dashboard أداء مباشر بأهم المؤشرات",
        "تقارير منتظمة + جلسات استراتيجية",
      ],
      en: [
        "Full campaign + tracking setup (Pixels/GTM/CAPI)",
        "Monthly creative (designs + short-form video)",
        "Live performance dashboard with key KPIs",
        "Regular reports + strategy sessions",
      ],
    },
    process: [
      { step: ls("الاستراتيجية والتجزئة", "Strategy & segmentation"), detail: ls("تحديد المنصات والجمهور والميزانية ومسارات التحويل المثلى.", "Choose platforms, audiences, budgets and the right funnels.") },
      { step: ls("الإعداد التقني", "Tech setup"), detail: ls("تثبيت Pixels وGTM وConversions API لجودة بيانات تتحمل iOS14+.", "Pixels, GTM, CAPI — data quality that survives iOS14+.") },
      { step: ls("الإطلاق المنظم", "Staged launch"), detail: ls("إنتاج الكرييتيف وإطلاق على مراحل لتقليل المخاطر وتسريع التعلّم.", "Creative production and staged rollout to reduce risk and learn fast.") },
      { step: ls("التحسين اليومي", "Daily optimization"), detail: ls("تعديل المزايدات والكرييتيف يومياً وتوسيع ما يربح فقط.", "Daily bid + creative tuning, scaling only what wins.") },
    ],
    audience: {
      ar: [
        "المتاجر الإلكترونية الباحثة عن نمو ROAS مستدام",
        "العيادات والخدمات الطبية التي تحتاج ليدز عالية الجودة",
        "العقار والمشاريع بدورات بيع طويلة",
        "B2B وLeads عالية القيمة",
      ],
      en: [
        "E-commerce stores chasing sustainable ROAS growth",
        "Clinics and medical services needing quality leads",
        "Real estate and projects with long sales cycles",
        "B2B and high-value lead businesses",
      ],
    },
    faqs: [
      { q: ls("ما الحد الأدنى للميزانية الإعلانية؟", "Minimum ad spend?"), a: ls("نوصي بـ 3,000 ر.س شهرياً كحد أدنى لمنصة واحدة لتحقيق نتائج قابلة للقياس.", "We recommend SAR 3,000/month minimum per platform for measurable results.") },
      { q: ls("هل تنتجون الكرييتيف أم تكتفون بالإدارة؟", "Do you produce creative or only manage?"), a: ls("ننتج الكرييتيف ضمن الباقات المتقدمة — تصاميم وفيديوهات قصيرة شهرية.", "We produce creative on Pro plans — monthly designs and short-form videos.") },
      { q: ls("متى تظهر النتائج؟", "When do results show?"), a: ls("البيع المباشر يظهر من الأسبوع الأول، ويستقر الأداء بعد 30 إلى 45 يوم تعلّم.", "Direct sales appear in week 1; performance stabilizes after 30–45 days of learning.") },
      { q: ls("هل أمتلك حسابات الإعلان؟", "Do I own the ad accounts?"), a: ls("نعم. كل الحسابات والبيانات والملكية الفكرية تبقى لك بالكامل.", "Yes. Accounts, data and IP remain fully yours.") },
    ],
    cta: ls("اطلب مراجعة مجانية لحساباتك الإعلانية الآن.", "Request a free ad-account review now."),
  },

  // 3) Creative Production — إنتاج إبداعي
  creative: {
    slug: "creative",
    personality: "palette",
    hero: {
      eyebrow: ls("الإنتاج الإبداعي", "Creative Production"),
      title: ls("هوية وفيديو وكرييتيف يبيع", "Identity, video & creative that sells"),
      tagline: ls(
        "في 7 ثوانٍ يقرر العميل إن كان سيتعامل معك — اجعلها لصالحك",
        "Customers decide in 7 seconds — make them count",
      ),
      intro: ls(
        "نصمم لك هوية بصرية احترافية وننتج فيديوهات وكرييتيف سوشيال بمنهجية تخدم البيع لا الجوائز فقط — لتصبح علامتك خياره الأول من النظرة الأولى.",
        "We craft a professional brand identity and produce video + social creative built to sell — so your brand becomes their first choice at first glance.",
      ),
    },
    features: {
      ar: [
        "تصميم شعار وهوية بصرية كاملة بنظام تصميم مرن",
        "إنتاج فيديو احترافي وموشن جرافيك جذاب",
        "كرييتيف سوشيال ميديا منتظم يخدم خطة المحتوى",
        "كتابة محتوى إبداعي بصياغة تباع",
        "Brand book متكامل يضمن اتساق العلامة عبر القنوات",
        "تصوير منتجات ولايف ستايل احترافي",
        "ملفات Source كاملة بعد الاعتماد",
      ],
      en: [
        "Logo + full identity built on a flexible design system",
        "Pro video production and engaging motion graphics",
        "Regular social creative that serves the content plan",
        "Creative copywriting that sells",
        "Comprehensive brand book ensuring channel-wide consistency",
        "Pro product and lifestyle photography",
        "Full source files delivered on approval",
      ],
    },
    deliverables: {
      ar: [
        "شعار + إصدارات + استخدامات",
        "Brand book PDF كامل",
        "قوالب سوشيال ميديا جاهزة",
        "فيديوهات MP4 جاهزة للنشر",
      ],
      en: [
        "Logo + variations + usage guidelines",
        "Full brand book PDF",
        "Ready-to-use social templates",
        "Publish-ready MP4 videos",
      ],
    },
    process: [
      { step: ls("الاكتشاف", "Discovery"), detail: ls("جلسة عميقة لفهم العلامة والجمهور والمنافسين.", "Deep session to understand brand, audience and competitors.") },
      { step: ls("الاتجاه الإبداعي", "Creative direction"), detail: ls("Mood boards وحلول بصرية مقترحة واختيار الاتجاه.", "Mood boards, visual concepts, direction lock.") },
      { step: ls("الإنتاج", "Production"), detail: ls("تنفيذ احترافي بمراجعتين رئيسيتين قبل التسليم.", "Pro execution with two main rounds of revision.") },
      { step: ls("التسليم", "Handover"), detail: ls("ملفات نهائية + Brand book + استشارة استخدام.", "Final files + brand book + usage consultation.") },
    ],
    audience: {
      ar: [
        "العلامات الجديدة التي تبني هويتها من الصفر",
        "الشركات الراغبة بإعادة بناء هوية متقادمة",
        "المتاجر التي تحتاج كرييتيف منتظم بجودة ثابتة",
        "وكالات الإعلام التي تحتاج شريك إنتاج",
      ],
      en: [
        "New brands building identity from scratch",
        "Companies rebranding outdated identities",
        "Stores needing regular consistent creative",
        "Media agencies needing a production partner",
      ],
    },
    faqs: [
      { q: ls("كم يستغرق تصميم الهوية الكاملة؟", "How long for full identity?"), a: ls("من 14 إلى 21 يوم عمل تشمل الاكتشاف والاتجاه والمراجعات.", "14–21 business days including discovery, direction and revisions.") },
      { q: ls("هل تنتجون فيديوهات Reels قصيرة؟", "Do you produce short Reels?"), a: ls("نعم، ضمن باقتي Studio و Powerhouse بكميات شهرية متفق عليها.", "Yes — included in Studio and Powerhouse plans at agreed monthly volumes.") },
      { q: ls("هل أحصل على ملفات Source؟", "Do I get source files?"), a: ls("بالتأكيد، نسلّم AI/PSD/PR بعد الاعتماد النهائي.", "Yes — AI/PSD/PR delivered after final approval.") },
      { q: ls("هل تشمل تصوير منتجات؟", "Is product photography included?"), a: ls("متاح كـ Add-on أو ضمن باقات الإنتاج المتقدمة.", "Available as add-on or within advanced production plans.") },
    ],
    cta: ls("احجز جلسة اتجاه إبداعي مجانية لعلامتك.", "Book a free creative-direction session for your brand."),
  },

  // 4) Web Solutions — مواقع وتطوير
  web: {
    slug: "web",
    personality: "code",
    hero: {
      eyebrow: ls("الحلول البرمجية والمواقع", "Web & Development"),
      title: ls("مواقع ومتاجر سريعة وآمنة", "Fast, secure, scalable websites"),
      tagline: ls(
        "موقع سريع وآمن وقابل للتوسع — أساس أي نمو رقمي حقيقي",
        "A fast, secure and scalable site is the foundation of real digital growth",
      ),
      intro: ls(
        "نبني لك مواقع ومتاجر تخدم البيع وتُدار بسهولة وتنمو معك — بكود نظيف وأداء عالٍ وأمان حقيقي وتكاملات تربط أعمالك بالكامل.",
        "We build sites and stores that sell, that you can manage easily and that scale with you — clean code, top performance, real security and integrations that connect your whole business.",
      ),
    },
    features: {
      ar: [
        "تصميم WordPress مخصص أو Headless حسب الحاجة",
        "متاجر WooCommerce و Shopify محسّنة للتحويل",
        "Core Web Vitals ممتازة وLCP < 2.5s",
        "أمان متقدم وحماية من الهجمات الشائعة",
        "تكاملات CRM/ERP وبوابات دفع محلية",
        "لوحات تحكم سهلة لفريقك بدون تعقيد",
        "صيانة ودعم 24/7 ضمن باقات الصيانة",
      ],
      en: [
        "Custom WordPress or Headless setups when it fits",
        "Conversion-tuned WooCommerce and Shopify stores",
        "Excellent Core Web Vitals and LCP under 2.5s",
        "Advanced security against common attacks",
        "CRM/ERP integrations and local payment gateways",
        "Easy admin dashboards your team can actually use",
        "24/7 maintenance and support on care plans",
      ],
    },
    deliverables: {
      ar: [
        "موقع جاهز للنشر مع نقل آمن",
        "تدريب فريقك على إدارة المحتوى",
        "وثائق فنية كاملة",
        "ضمان أداء وأمان ودعم بعد الإطلاق",
      ],
      en: [
        "Production-ready site with safe migration",
        "Admin training for your team",
        "Full technical documentation",
        "Performance + security warranty and post-launch support",
      ],
    },
    process: [
      { step: ls("الاكتشاف وUX", "Discovery & UX"), detail: ls("جلسة احتياجات وخرائط رحلة المستخدم وWireframes واضحة.", "Requirements session, journey mapping, clear wireframes.") },
      { step: ls("التصميم", "Design"), detail: ls("UI احترافي مبني على نظام تصميم متسق مع العلامة.", "Pro UI on a brand-consistent design system.") },
      { step: ls("التطوير", "Development"), detail: ls("كود نظيف وأداء عالٍ ومعمارية قابلة للتوسع.", "Clean code, high performance, scalable architecture.") },
      { step: ls("الإطلاق", "Launch"), detail: ls("اختبار شامل ونقل آمن وتدريب وتسليم كامل.", "Full QA, safe migration, training and complete handover.") },
    ],
    audience: {
      ar: [
        "المتاجر الإلكترونية التي تحتاج أداءً ومصداقية",
        "الشركات الخدمية التي تريد موقعاً يحوّل الزوار",
        "العقار والصحة بمتطلبات تكامل خاصة",
        "الشركات الكبرى التي تحتاج CRM/ERP وتكاملات",
      ],
      en: [
        "E-commerce stores that need speed and credibility",
        "Service businesses wanting a site that converts",
        "Real estate and healthcare with custom integrations",
        "Enterprises needing CRM/ERP and integrations",
      ],
    },
    faqs: [
      { q: ls("ما المنصة الأنسب لمتجري؟", "Which platform fits my store?"), a: ls("نوصي بالأنسب لحجمك: WooCommerce للمرونة أو Shopify للسرعة، وHeadless للأحجام الكبيرة.", "We recommend the right fit: WooCommerce for flexibility, Shopify for speed, Headless for scale.") },
      { q: ls("هل تشمل صيانة بعد الإطلاق؟", "Is post-launch maintenance included?"), a: ls("نعم — عقود صيانة شهرية متاحة لكل الباقات بنفس مستوى الجودة.", "Yes — monthly care plans are available across all packages at the same quality.") },
      { q: ls("كم يستغرق تطوير المتجر؟", "How long to ship a store?"), a: ls("من 30 إلى 60 يوم حسب التعقيد والتكاملات المطلوبة.", "30 to 60 days depending on complexity and required integrations.") },
      { q: ls("هل أمتلك الكود بالكامل؟", "Do I own the full code?"), a: ls("نعم. الكود والملكية الفكرية وحقوق النشر تنتقل لك بعد الاعتماد.", "Yes. Code, IP and publishing rights transfer to you on approval.") },
    ],
    cta: ls("احجز استشارة فنية مجانية لمشروعك الآن.", "Book a free technical consultation for your project."),
  },
};

export function findServiceTabs(slug: string): ServiceTabContent | undefined {
  return SERVICE_TAB_CONTENT[slug];
}
