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
};

export function findServiceTabs(slug: string): ServiceTabContent | undefined {
  return SERVICE_TAB_CONTENT[slug];
}
