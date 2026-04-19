import type { ServiceMeta, IndustryMeta, PricingPlan, LocalizedString, SubServiceMeta, SubIndustryMeta } from "./types";

const ls = (ar: string, en: string): LocalizedString => ({ ar, en });
const ll = (ar: string[], en: string[]) => ({ ar, en });

// ---------- Reusable plan templates ----------

const seoPlans: PricingPlan[] = [
  {
    id: "starter",
    name: ls("بذرة النمو", "Growth Seed"),
    description: ls("ابدأ بسيو تقني نظيف وكلمات مستهدفة لأول 6 صفحات.", "Clean technical SEO and targeted keywords for your first 6 pages."),
    priceSar: 1490,
    originalPriceSar: 1990,
    discountPct: 25,
    features: ll(
      ["مراجعة سيو تقنية كاملة", "بحث كلمات مفتاحية (50)", "تحسين 6 صفحات", "تقرير شهري", "إعداد Search Console"],
      ["Full technical audit", "Keyword research (50)", "Optimize 6 pages", "Monthly report", "Search Console setup"],
    ),
  },
  {
    id: "growth",
    name: ls("شجرة الأرباح", "Profit Tree"),
    description: ls("سيو احترافي بمحتوى شهري وبناء روابط لتسريع الترتيب.", "Pro SEO with monthly content and links to accelerate rankings."),
    priceSar: 3490,
    originalPriceSar: 4490,
    discountPct: 22,
    highlighted: true,
    features: ll(
      ["كل ما في الباقة السابقة", "تحسين 15 صفحة", "4 مقالات سيو شهرياً", "بناء روابط (5 شهرياً)", "السيو المحلي + GBP", "مكالمة استراتيجية شهرية"],
      ["Everything in Seed", "Optimize 15 pages", "4 SEO articles / month", "Link building (5/mo)", "Local SEO + GBP", "Monthly strategy call"],
    ),
  },
  {
    id: "enterprise",
    name: ls("غابة الانتشار", "Authority Forest"),
    description: ls("نمو سيو متقدم لمتاجر وعلامات تجارية ضخمة.", "Advanced SEO for large stores and brands."),
    priceSar: 7990,
    originalPriceSar: 9990,
    discountPct: 20,
    features: ll(
      ["تحسين غير محدود للصفحات", "8 مقالات + Topical Authority", "بناء روابط متقدم (15)", "Schema متقدم وتحسين CRO", "مدير حساب مخصص"],
      ["Unlimited page optimization", "8 articles + topical authority", "Advanced link building (15)", "Advanced schema & CRO", "Dedicated account manager"],
    ),
  },
];

const performancePlans: PricingPlan[] = [
  {
    id: "spark",
    name: ls("شرارة الإطلاق", "Launch Spark"),
    description: ls("حملات إعلانية مدارة احترافياً لميزانيات الانطلاق.", "Professionally managed campaigns for starting budgets."),
    priceSar: 1990,
    originalPriceSar: 2490,
    discountPct: 20,
    features: ll(
      ["إدارة منصة واحدة (Meta أو Google)", "حتى 3 حملات", "تتبع التحويلات", "تقرير نصف شهري"],
      ["1 platform (Meta or Google)", "Up to 3 campaigns", "Conversion tracking", "Bi-weekly report"],
    ),
  },
  {
    id: "scale",
    name: ls("محرك التوسع", "Scale Engine"),
    description: ls("حملات متعددة المنصات مع تحسين متواصل وكرييتيف شهري.", "Multi-platform campaigns with creative & ongoing optimization."),
    priceSar: 4490,
    originalPriceSar: 5490,
    discountPct: 18,
    highlighted: true,
    features: ll(
      ["Meta + Google + TikTok", "حتى 8 حملات", "كرييتيف شهري (8 إعلانات)", "A/B testing", "تقارير أسبوعية", "مدير حملات مخصص"],
      ["Meta + Google + TikTok", "Up to 8 campaigns", "Monthly creatives (8 ads)", "A/B testing", "Weekly reports", "Dedicated campaign manager"],
    ),
  },
  {
    id: "dominate",
    name: ls("سيطرة السوق", "Market Dominator"),
    description: ls("استراتيجية إعلانية متكاملة بميزانيات ضخمة وفريق مخصص.", "Full-funnel strategy with large budgets and a dedicated team."),
    priceSar: 9990,
    originalPriceSar: 12990,
    discountPct: 23,
    features: ll(
      ["كل المنصات الإعلانية", "حملات غير محدودة", "كرييتيف غير محدود", "تحسين CRO للصفحات الهابطة", "تقارير يومية + Dashboard"],
      ["All ad platforms", "Unlimited campaigns", "Unlimited creatives", "Landing page CRO", "Daily reports + dashboard"],
    ),
  },
];

const creativePlans: PricingPlan[] = [
  {
    id: "essence",
    name: ls("جوهر الهوية", "Brand Essence"),
    description: ls("هوية بصرية احترافية وأساسيات سوشيال ميديا.", "Pro brand identity and social media essentials."),
    priceSar: 2490,
    originalPriceSar: 3490,
    discountPct: 28,
    features: ll(
      ["تصميم شعار + 3 إصدارات", "لوحة ألوان وخطوط", "Brand mini guide", "12 تصميم سوشيال ميديا"],
      ["Logo + 3 variations", "Color & typography palette", "Brand mini guide", "12 social designs"],
    ),
  },
  {
    id: "studio",
    name: ls("استوديو الإبداع", "Creative Studio"),
    description: ls("هوية كاملة ومحتوى بصري شهري وفيديوهات قصيرة.", "Full identity, monthly visual content and short videos."),
    priceSar: 5990,
    originalPriceSar: 7490,
    discountPct: 20,
    highlighted: true,
    features: ll(
      ["هوية بصرية كاملة + Brand Book", "30 تصميم سوشيال شهرياً", "4 ريلز/فيديوهات قصيرة", "كتابة محتوى للمنشورات"],
      ["Full brand identity + Brand Book", "30 social designs / month", "4 reels / short videos", "Caption copywriting"],
    ),
  },
  {
    id: "production",
    name: ls("ماكينة الإنتاج", "Production Powerhouse"),
    description: ls("إنتاج بصري احترافي للحملات الكبرى والفيديو التسويقي.", "Premium visual production for major campaigns and video marketing."),
    priceSar: 11990,
    originalPriceSar: 14990,
    discountPct: 20,
    features: ll(
      ["تصوير + موشن جرافيك", "60 تصميم شهرياً", "10 فيديوهات احترافية", "Storyboarding واستراتيجية بصرية"],
      ["Photography + motion graphics", "60 designs / month", "10 pro videos", "Storyboarding & visual strategy"],
    ),
  },
];

const webPlans: PricingPlan[] = [
  {
    id: "launch",
    name: ls("إطلاق سريع", "Quick Launch"),
    description: ls("موقع وردبريس احترافي حتى 6 صفحات.", "Pro WordPress site up to 6 pages."),
    priceSar: 4990,
    originalPriceSar: 6490,
    discountPct: 23,
    features: ll(
      ["تصميم مخصص (6 صفحات)", "ريسبونسف كامل", "تحسين سرعة وSEO أساسي", "نموذج تواصل + WhatsApp", "تدريب على الإدارة"],
      ["Custom design (6 pages)", "Fully responsive", "Speed + base SEO", "Contact form + WhatsApp", "Admin training"],
    ),
  },
  {
    id: "store",
    name: ls("متجر النمو", "Growth Store"),
    description: ls("متجر إلكتروني متكامل بدفع وشحن وتقارير.", "Complete e-commerce store with payments, shipping, and analytics."),
    priceSar: 9990,
    originalPriceSar: 12490,
    discountPct: 20,
    highlighted: true,
    features: ll(
      ["متجر حتى 200 منتج", "بوابات دفع محلية", "ربط شركات الشحن", "Conversion tracking", "تكامل مع Meta وGoogle"],
      ["Store up to 200 products", "Local payment gateways", "Shipping integrations", "Conversion tracking", "Meta + Google integration"],
    ),
  },
  {
    id: "platform",
    name: ls("منصة المؤسسات", "Enterprise Platform"),
    description: ls("حلول مخصصة، تكاملات ERP/CRM، وأداء عالي.", "Custom builds, ERP/CRM integrations, and high performance."),
    priceSar: 19990,
    originalPriceSar: 24990,
    discountPct: 20,
    features: ll(
      ["تطوير مخصص", "تكاملات ERP/CRM", "Headless / SSR", "أمان متقدم وحماية", "اتفاقية SLA ودعم 24/7"],
      ["Custom development", "ERP/CRM integrations", "Headless / SSR", "Advanced security", "SLA + 24/7 support"],
    ),
  },
];

// Industry plans - per industry naming
const industryPlans = (a: string, b: string, c: string, en1: string, en2: string, en3: string): PricingPlan[] => [
  {
    id: "starter",
    name: ls(a, en1),
    description: ls("باقة بدء قوية بأساسيات النمو الرقمي.", "Strong starter pack covering digital growth essentials."),
    priceSar: 2990,
    originalPriceSar: 3990,
    discountPct: 25,
    features: ll(
      ["تدقيق رقمي للقطاع", "إعلان على منصة واحدة", "تحسين سيو محلي", "8 تصاميم سوشيال"],
      ["Industry digital audit", "1 ad platform", "Local SEO optimization", "8 social designs"],
    ),
  },
  {
    id: "growth",
    name: ls(b, en2),
    description: ls("نمو متكامل بإعلانات متعددة ومحتوى شهري.", "Integrated growth with multi-platform ads and monthly content."),
    priceSar: 5990,
    originalPriceSar: 7490,
    discountPct: 20,
    highlighted: true,
    features: ll(
      ["كل ما في الباقة السابقة", "إعلانات على 3 منصات", "20 تصميم + 4 فيديو", "صفحة هبوط مخصصة", "تقارير أسبوعية"],
      ["Everything in starter", "Ads on 3 platforms", "20 designs + 4 videos", "Custom landing page", "Weekly reports"],
    ),
  },
  {
    id: "enterprise",
    name: ls(c, en3),
    description: ls("حل مؤسسي شامل بمدير حساب مخصص واستراتيجية كاملة.", "Full enterprise solution with dedicated account manager and strategy."),
    priceSar: 11990,
    originalPriceSar: 14990,
    discountPct: 20,
    features: ll(
      ["استراتيجية متكاملة", "إعلانات غير محدودة", "إنتاج بصري كامل", "تحسين CRO", "مدير حساب مخصص"],
      ["Integrated strategy", "Unlimited ads", "Full visual production", "CRO optimization", "Dedicated manager"],
    ),
  },
];

// ------------- Services -------------

export const services: ServiceMeta[] = [
  {
    slug: "seo",
    group: "seo",
    title: ls("تحسين محركات البحث (SEO)", "Search Engine Optimization"),
    metaTitle: ls(
      "خدمات السيو وتحسين محركات البحث للشركات | فكرة",
      "SEO Services for Brands & E-commerce | Fikra",
    ),
    metaDescription: ls(
      "نرفع ترتيبك في جوجل بسيو تقني واحترافي ومحتوى مدروس وبناء روابط آمن. خدمات SEO للشركات في السعودية ومصر والإمارات.",
      "Climb Google rankings with technical SEO, expert content and safe link building. SEO services for brands in KSA, Egypt and UAE.",
    ),
    intro: ls(
      "نبني لك نمواً عضوياً مستداماً عبر سيو تقني نظيف، محتوى يجيب نية البحث، وبناء روابط آمن — لتصبح صفحاتك أول ما يراه عميلك في جوجل.",
      "We build sustainable organic growth through clean technical SEO, intent-driven content, and safe link building — so your pages become the first thing your customer sees on Google.",
    ),
    highlights: ll(
      ["تدقيق سيو تقني شامل", "بحث كلمات مفتاحية حقيقي", "محتوى مبني على نية البحث", "بناء روابط آمن", "تحسين Core Web Vitals"],
      ["Comprehensive technical audit", "Real keyword research", "Intent-driven content", "Safe link building", "Core Web Vitals optimization"],
    ),
    process: [
      { step: ls("الاكتشاف والتحليل", "Discovery & Audit"), detail: ls("تدقيق تقني شامل وتحليل المنافسين والكلمات المفتاحية.", "Full technical audit, competitor and keyword analysis.") },
      { step: ls("الاستراتيجية", "Strategy"), detail: ls("خريطة كلمات مفتاحية وخطة محتوى شهرية وأهداف KPIs.", "Keyword map, monthly content plan and KPIs.") },
      { step: ls("التنفيذ", "Execution"), detail: ls("تحسين الصفحات، إنتاج المحتوى، بناء الروابط، تحسين السرعة.", "On-page, content, link building, and speed optimization.") },
      { step: ls("القياس والتطوير", "Measure & Iterate"), detail: ls("تقارير شهرية مفصّلة وتحسين مستمر بناءً على البيانات.", "Detailed monthly reports and data-driven iteration.") },
    ],
    deliverables: ll(
      ["تقرير تدقيق سيو شامل", "خريطة كلمات مفتاحية", "خطة محتوى ربع سنوية", "تقارير شهرية", "وصول كامل لـ Search Console و Analytics"],
      ["Comprehensive audit report", "Keyword map", "Quarterly content plan", "Monthly reports", "Full Search Console & Analytics access"],
    ),
    audience: ll(
      ["المتاجر الإلكترونية الراغبة بزيادة المبيعات العضوية", "الشركات الخدمية التي تريد ليدز مستمرة", "العلامات التجارية الباحثة عن سلطة في مجالها"],
      ["E-commerce stores seeking organic sales", "Service businesses needing steady leads", "Brands building authority in their niche"],
    ),
    faqs: [
      { q: ls("متى تظهر نتائج السيو؟", "When will SEO results show?"), a: ls("النتائج الأولى تظهر خلال 3 شهور، والنمو الواضح بعد 6-9 شهور حسب المنافسة.", "First results appear within 3 months; significant growth after 6-9 months depending on competition.") },
      { q: ls("هل تضمنون المركز الأول؟", "Do you guarantee #1 rankings?"), a: ls("لا أحد يضمن جوجل بشكل مطلق، لكن منهجيتنا أوصلت عملاءنا للصفحة الأولى لمئات الكلمات.", "No one can absolutely guarantee Google. Our methodology has driven clients to page one for hundreds of keywords.") },
      { q: ls("هل تشمل الخدمة كتابة المحتوى؟", "Does the service include content writing?"), a: ls("نعم، باقاتنا الاحترافية والمؤسسية تشمل محتوى سيو شهري بقلم متخصصين.", "Yes — our Pro and Enterprise plans include monthly SEO content by specialists.") },
    ],
    plans: seoPlans,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "performance",
    group: "performance",
    title: ls("الأداء والإعلانات الممولة", "Performance Marketing & Paid Ads"),
    metaTitle: ls(
      "إدارة حملات إعلانية | جوجل وميتا وتيك توك | فكرة",
      "Paid Ads Management | Google, Meta & TikTok | Fikra",
    ),
    metaDescription: ls(
      "نُدير حملاتك على جوجل وميتا وتيك توك وسناب شات بأعلى عائد ممكن. خدمة Performance Marketing احترافية في السعودية.",
      "We manage Google, Meta, TikTok and Snapchat ads with maximum ROI. Pro performance marketing in KSA.",
    ),
    intro: ls(
      "كل ريال إعلاني له هدف واضح. ندير حملاتك على جوجل وميتا وتيك توك وسناب بمنهجية مبنية على البيانات وكرييتيف يبيع.",
      "Every ad dollar has a clear goal. We manage Google, Meta, TikTok and Snap with data-driven methodology and creative that sells.",
    ),
    highlights: ll(
      ["إدارة Meta + Google + TikTok + Snap", "تتبع تحويلات متقدم", "كرييتيف يومي/أسبوعي", "A/B testing مستمر", "تقارير شفافة"],
      ["Manage Meta + Google + TikTok + Snap", "Advanced conversion tracking", "Daily/weekly creative", "Continuous A/B testing", "Transparent reporting"],
    ),
    process: [
      { step: ls("الاستراتيجية", "Strategy"), detail: ls("تحديد المنصات، الجمهور، الميزانية ومسارات التحويل.", "Define platforms, audience, budget and funnels.") },
      { step: ls("الإعداد التقني", "Tech Setup"), detail: ls("تثبيت Pixels، GTM، Conversions API وحماية الجودة.", "Pixels, GTM, Conversions API and quality safeguards.") },
      { step: ls("الإطلاق", "Launch"), detail: ls("إنتاج الكرييتيف، إعداد الحملات، إطلاق منظم بمراحل.", "Creative production, campaign setup, staged launch.") },
      { step: ls("التحسين", "Optimization"), detail: ls("اختبارات يومية وتعديل المزايدات والكرييتيف.", "Daily tests, bid and creative tuning.") },
    ],
    deliverables: ll(
      ["إعداد كامل للحملات والتتبع", "كرييتيف شهري", "Dashboard أداء", "تقارير منتظمة", "مكالمات استراتيجية"],
      ["Full campaign + tracking setup", "Monthly creative", "Performance dashboard", "Regular reports", "Strategy calls"],
    ),
    audience: ll(
      ["المتاجر الإلكترونية", "العيادات والخدمات الطبية", "العقار والمشاريع", "B2B وLeads عالية القيمة"],
      ["E-commerce stores", "Clinics & medical services", "Real estate & projects", "B2B & high-value leads"],
    ),
    faqs: [
      { q: ls("ما الحد الأدنى للميزانية الإعلانية؟", "Minimum ad spend?"), a: ls("ننصح بـ 3000 ر.س شهرياً كحد أدنى لمنصة واحدة لتحقيق نتائج مدروسة.", "We recommend SAR 3,000/month minimum per platform for measurable results.") },
      { q: ls("هل تكتفون بالإدارة أم تنتجون الكرييتيف؟", "Do you also produce creatives?"), a: ls("ننتج الكرييتيف ضمن الباقات المتقدمة (تصاميم وفيديوهات قصيرة).", "Yes — Pro plans include creative (designs and short videos).") },
      { q: ls("متى أرى نتائج؟", "When will I see results?"), a: ls("نتائج البيع المباشر تظهر من الأسبوع الأول، وتستقر بعد 30-45 يوم.", "Direct sales typically start in week 1 and stabilize after 30-45 days.") },
    ],
    plans: performancePlans,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "creative",
    group: "creative",
    title: ls("الإنتاج الإبداعي", "Creative Production"),
    metaTitle: ls(
      "تصميم هوية بصرية وإنتاج فيديو ومحتوى إبداعي | فكرة",
      "Brand Identity, Video & Creative Content | Fikra",
    ),
    metaDescription: ls(
      "هوية بصرية احترافية، فيديو وموشن جرافيك، ومحتوى إبداعي يبني علامتك ويحرّك المبيعات.",
      "Pro brand identity, video, motion graphics and creative content that builds your brand and drives sales.",
    ),
    intro: ls(
      "في 7 ثوانٍ يقرر العميل إن كان سيتعامل معك. ننتج لك هوية بصرية وفيديوهات ومحتوى يجعلك خياره الأول.",
      "Customers decide in 7 seconds. We craft identity, videos, and content that make you their first choice.",
    ),
    highlights: ll(
      ["تصميم شعار وهوية بصرية", "إنتاج فيديو وموشن جرافيك", "تصاميم سوشيال ميديا", "كتابة محتوى إبداعي", "Brand book متكامل"],
      ["Logo & brand identity design", "Video & motion graphics", "Social media designs", "Creative copywriting", "Comprehensive brand book"],
    ),
    process: [
      { step: ls("الاكتشاف", "Discovery"), detail: ls("جلسة عميقة لفهم العلامة والجمهور والمنافسين.", "Deep session to understand brand, audience and competitors.") },
      { step: ls("الاتجاه الإبداعي", "Creative Direction"), detail: ls("Mood boards، حلول بصرية مقترحة، اختيار الاتجاه.", "Mood boards, visual concepts, direction selection.") },
      { step: ls("التنفيذ", "Production"), detail: ls("تصاميم وفيديوهات احترافية بمراجعتين رئيسيتين.", "Pro designs and videos with 2 main rounds of revision.") },
      { step: ls("التسليم", "Delivery"), detail: ls("ملفات نهائية + Brand book + استشارة استخدام.", "Final files + brand book + usage consultation.") },
    ],
    deliverables: ll(
      ["شعار + إصدارات", "Brand book PDF", "قوالب سوشيال", "فيديوهات MP4 جاهزة", "ملفات مفتوحة المصدر"],
      ["Logo + variations", "Brand book PDF", "Social templates", "Ready MP4 videos", "Source files"],
    ),
    audience: ll(
      ["العلامات الجديدة", "الشركات الراغبة بإعادة بناء هويتها", "المتاجر التي تريد كرييتيف منتظم"],
      ["New brands", "Companies rebranding", "Stores needing regular creative"],
    ),
    faqs: [
      { q: ls("كم يستغرق تصميم الهوية الكاملة؟", "How long does full identity take?"), a: ls("من 14 إلى 21 يوم عمل، تشمل الاكتشاف والمراجعات.", "14 to 21 business days including discovery and revisions.") },
      { q: ls("هل تنتجون فيديوهات Reels قصيرة؟", "Do you produce short Reels?"), a: ls("نعم، ضمن باقتي Studio و Powerhouse بكميات شهرية.", "Yes — included in Studio and Powerhouse plans monthly.") },
      { q: ls("هل أحصل على ملفات Source؟", "Will I get source files?"), a: ls("بالتأكيد، نسلم AI/PSD/PR بعد الاعتماد النهائي.", "Yes — AI/PSD/PR delivered after final approval.") },
    ],
    plans: creativePlans,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "web",
    group: "web",
    title: ls("الحلول البرمجية والمواقع", "Web Solutions & Development"),
    metaTitle: ls(
      "تصميم وتطوير مواقع ومتاجر إلكترونية | فكرة",
      "Web & E-commerce Development | Fikra",
    ),
    metaDescription: ls(
      "نطور مواقع ومتاجر إلكترونية سريعة وآمنة قابلة للتوسع، مع تكاملات CRM/ERP وحلول مخصصة.",
      "We build fast, secure and scalable websites and stores with CRM/ERP integrations and custom solutions.",
    ),
    intro: ls(
      "موقع سريع وآمن وقابل للتوسع — هو أساس أي نمو رقمي حقيقي. نبني لك حلولاً تقنية تعمل لصالح أعمالك.",
      "A fast, secure and scalable site is the foundation of real digital growth. We build tech that works for your business.",
    ),
    highlights: ll(
      ["تصميم وردبريس مخصص", "متاجر WooCommerce و Shopify", "تطوير مخصص (Headless/SSR)", "تكاملات CRM/ERP", "صيانة ودعم 24/7"],
      ["Custom WordPress design", "WooCommerce & Shopify stores", "Custom dev (Headless/SSR)", "CRM/ERP integrations", "24/7 maintenance & support"],
    ),
    process: [
      { step: ls("Discovery & UX", "Discovery & UX"), detail: ls("جلسة احتياجات، خرائط رحلة، Wireframes.", "Requirements session, journey maps, wireframes.") },
      { step: ls("التصميم", "Design"), detail: ls("UI احترافي مبني على نظام تصميم وثابت العلامة.", "Brand-consistent UI on a design system.") },
      { step: ls("التطوير", "Development"), detail: ls("كود نظيف، أداء عالٍ، أمان وحماية.", "Clean code, high performance, security.") },
      { step: ls("الإطلاق", "Launch"), detail: ls("اختبار شامل، نقل آمن، تدريب وتسليم كامل.", "Full testing, safe migration, training and handover.") },
    ],
    deliverables: ll(
      ["موقع جاهز للنشر", "تدريب على الإدارة", "وثائق فنية", "ضمان أداء وأمان"],
      ["Production-ready site", "Admin training", "Tech documentation", "Performance & security warranty"],
    ),
    audience: ll(
      ["المتاجر الإلكترونية", "الشركات الخدمية", "العقار والصحة", "الشركات الكبرى التي تحتاج تكاملات"],
      ["E-commerce", "Service businesses", "Real estate & healthcare", "Enterprises needing integrations"],
    ),
    faqs: [
      { q: ls("ما المنصة الأنسب لمتجري؟", "Best platform for my store?"), a: ls("نوصي بالأنسب حسب حجمك: WooCommerce للمرونة أو Shopify للسرعة.", "We recommend the best fit: WooCommerce for flexibility or Shopify for speed.") },
      { q: ls("هل تشمل صيانة لاحقة؟", "Is post-launch maintenance included?"), a: ls("نعم — عقود صيانة شهرية متاحة بكل الباقات.", "Yes — monthly maintenance contracts are available on all plans.") },
      { q: ls("كم يستغرق المتجر؟", "How long for a store?"), a: ls("من 30 إلى 60 يوم حسب التعقيد والتكاملات.", "30 to 60 days depending on complexity and integrations.") },
    ],
    plans: webPlans,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1600&q=80",
  },
];

export const industries: IndustryMeta[] = [
  {
    slug: "ecommerce",
    title: ls("نمو المتاجر الإلكترونية", "E-commerce Growth"),
    metaTitle: ls("تسويق المتاجر الإلكترونية في السعودية والخليج | فكرة", "E-commerce Marketing in KSA & Gulf | Fikra"),
    metaDescription: ls(
      "نمو متكامل لمتاجر الأزياء والإلكترونيات والأجهزة الذكية: إعلانات، سيو، كرييتيف وCRO.",
      "Integrated growth for fashion, electronics and smart-home stores: ads, SEO, creative and CRO.",
    ),
    intro: ls(
      "نمو حقيقي للمتاجر الإلكترونية في السعودية والخليج. نوحد الإعلانات والسيو والكرييتيف والـCRO لرفع المبيعات وتقليل تكلفة الاكتساب.",
      "Real growth for e-commerce in KSA and the Gulf. We unify ads, SEO, creative and CRO to lift revenue and cut CAC.",
    ),
    pains: ll(
      ["ارتفاع تكلفة الإعلان وقلة العائد", "ترك السلة وضعف التحويل", "اعتماد كامل على الإعلانات بدون نمو عضوي"],
      ["High ad costs, low ROAS", "Cart abandonment & weak conversion", "Total ad dependency, no organic growth"],
    ),
    solutions: ll(
      ["استراتيجية متعددة القنوات (سيو + إعلانات + بريد)", "تحسين التحويل (CRO) وصفحات هبوط احترافية", "كرييتيف بيعي وكتالوج محسّن", "تقارير ربحية وحدوية وLTV"],
      ["Multi-channel strategy (SEO + ads + email)", "CRO and pro landing pages", "Sales-driven creative and optimized catalog", "Unit economics and LTV reporting"],
    ),
    outcomes: [
      { value: "+220%", label: ls("متوسط نمو المبيعات", "Avg sales growth") },
      { value: "-38%", label: ls("تكلفة اكتساب العميل", "Customer acquisition cost") },
      { value: "x4.5", label: ls("عائد الإعلان", "Return on ad spend") },
    ],
    faqs: [
      { q: ls("هل تعملون مع متاجر سلة وZid؟", "Do you work with Salla & Zid?"), a: ls("نعم، نمتلك خبرة قوية في سلة، Zid، Shopify وWooCommerce.", "Yes — strong experience with Salla, Zid, Shopify and WooCommerce.") },
      { q: ls("هل تساعدون في تصوير المنتجات؟", "Do you help with product photography?"), a: ls("نعم، ضمن باقاتنا الإبداعية الكاملة.", "Yes, included in our full creative plans.") },
    ],
    plans: industryPlans("بداية المتجر", "نمو المتجر", "إمبراطورية المتاجر", "Store Starter", "Store Growth", "Store Empire"),
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "logistics",
    title: ls("اللوجستيات والتخليص الجمركي", "Logistics & Customs"),
    metaTitle: ls("تسويق شركات الشحن والتخليص الجمركي | فكرة", "Marketing for Logistics & Customs | Fikra"),
    metaDescription: ls(
      "نولّد ليدز B2B لشركات الشحن والتخليص بحملات مدروسة، صفحات هبوط متخصصة وسيو محلي.",
      "We generate B2B leads for shipping & customs companies via targeted ads, niche landing pages and local SEO.",
    ),
    intro: ls(
      "تسويق B2B متخصص لقطاع اللوجستيات والتخليص الجمركي. نولد ليدز عالية الجودة من شركات حقيقية لا فضوليين.",
      "Specialized B2B marketing for logistics and customs. We generate high-quality leads from real businesses, not tire-kickers.",
    ),
    pains: ll(
      ["ليدز رديئة من المنصات العامة", "صعوبة الوصول لصنّاع القرار", "غياب موقع B2B قوي يولّد ثقة"],
      ["Low-quality leads from generic platforms", "Hard to reach decision makers", "No strong B2B site building trust"],
    ),
    solutions: ll(
      ["LinkedIn + Google ads مستهدفة لـ B2B", "صفحات هبوط لكل خدمة (شحن بحري/جوي/بري/تخليص)", "محتوى يبني سلطة (مدونة + دراسات حالة)", "نظام CRM لمتابعة الليدز"],
      ["Targeted LinkedIn + Google B2B ads", "Service-specific landing pages", "Authority content (blog + case studies)", "CRM lead management"],
    ),
    outcomes: [
      { value: "+180%", label: ls("نمو الليدز المؤهلة", "Qualified leads growth") },
      { value: "-42%", label: ls("تكلفة الليد المؤهل", "Cost per qualified lead") },
      { value: "12+", label: ls("عقود B2B/شهر", "B2B contracts/month") },
    ],
    faqs: [
      { q: ls("هل تخدمون السوق الخليجي بالكامل؟", "Do you serve the entire Gulf?"), a: ls("نعم، خبرتنا تشمل السعودية، الإمارات، الكويت ومصر.", "Yes — KSA, UAE, Kuwait and Egypt.") },
    ],
    plans: industryPlans("انطلاقة لوجستية", "نمو لوجستي", "قائد اللوجستيات", "Logistics Launch", "Logistics Growth", "Logistics Leader"),
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "healthcare",
    title: ls("القطاع الطبي والعيادات", "Healthcare & Clinics"),
    metaTitle: ls("تسويق العيادات والمستشفيات في السعودية | فكرة", "Marketing for Clinics & Hospitals in KSA | Fikra"),
    metaDescription: ls(
      "ندير تسويق العيادات: حجوزات أونلاين، Google Local، إعلانات صحية متوافقة مع الأنظمة.",
      "We market clinics: online bookings, Google Local, compliant healthcare ads.",
    ),
    intro: ls(
      "نملأ جدول حجوزاتك بمرضى حقيقيين من منطقتك. نسوّق العيادات بكفاءة والتزام كامل بأنظمة الإعلان الطبي.",
      "We fill your booking calendar with real patients from your area. Effective marketing with full compliance.",
    ),
    pains: ll(
      ["نقص الحجوزات في الأيام الهادئة", "ضعف الظهور في خرائط جوجل", "إعلانات تُرفض لأسباب صحية"],
      ["Low bookings on slow days", "Weak Google Maps visibility", "Healthcare ads getting rejected"],
    ),
    solutions: ll(
      ["تحسين Google Business Profile للحجوزات", "حملات بحث محلية مستهدفة", "كتابة إعلانات متوافقة مع السياسات", "صفحات هبوط لكل تخصص + WhatsApp Booking"],
      ["GBP optimization for bookings", "Targeted local search campaigns", "Policy-compliant ad copy", "Per-specialty landing pages + WhatsApp booking"],
    ),
    outcomes: [
      { value: "+340%", label: ls("نمو الحجوزات", "Bookings growth") },
      { value: "+5x", label: ls("ظهور خرائط جوجل", "Google Maps visibility") },
      { value: "<48h", label: ls("متوسط الإطلاق", "Avg time to launch") },
    ],
    faqs: [
      { q: ls("هل لديكم خبرة بأنظمة الإعلان الصحي؟", "Healthcare ad compliance experience?"), a: ls("نعم، نلتزم بأنظمة هيئة الصحة وسياسات Meta وGoogle الطبية.", "Yes — fully aligned with health authority rules and Meta/Google medical policies.") },
    ],
    plans: industryPlans("بداية العيادة", "نمو العيادة", "سلسلة عيادات", "Clinic Starter", "Clinic Growth", "Clinic Network"),
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "real-estate",
    title: ls("القطاع العقاري", "Real Estate"),
    metaTitle: ls("تسويق المشاريع العقارية في السعودية والخليج | فكرة", "Real Estate Marketing in KSA & Gulf | Fikra"),
    metaDescription: ls(
      "ليدز عقارية مؤهلة، صفحات مشروع احترافية، إعلانات Meta وGoogle مع متابعة CRM.",
      "Qualified real estate leads, pro project pages, Meta & Google ads with CRM tracking.",
    ),
    intro: ls(
      "نولّد ليدز عقارية حقيقية لمشاريعك بصفحات مبيعات احترافية، إعلانات بصرية مقنعة، ونظام متابعة لا يضيع فرصة.",
      "We deliver real estate leads with pro sales pages, compelling visual ads, and a follow-up system that never loses an opportunity.",
    ),
    pains: ll(
      ["ليدز كثيرة بدون جودة", "ضعف عرض المشروع بصرياً", "تأخر مكالمة المبيعات يفقد الفرصة"],
      ["Many low-quality leads", "Weak visual project presentation", "Slow sales callbacks losing deals"],
    ),
    solutions: ll(
      ["استهداف دقيق بالميزانية والاهتمامات", "صفحة مشروع بفيديو وجولة افتراضية", "Lead scoring وتنبيه فوري للمبيعات", "ريتارجتنج بصري احترافي"],
      ["Precise budget & interest targeting", "Project page with video + virtual tour", "Lead scoring with instant sales alerts", "Pro visual retargeting"],
    ),
    outcomes: [
      { value: "+260%", label: ls("ليدز مؤهلة", "Qualified leads") },
      { value: "-31%", label: ls("تكلفة الليد", "Cost per lead") },
      { value: "x3", label: ls("نسبة الإغلاق", "Close rate") },
    ],
    faqs: [
      { q: ls("هل تعملون مع المطورين الكبار؟", "Do you work with major developers?"), a: ls("نعم، عملنا يشمل المطورين والوسطاء وشركات الإدارة.", "Yes — we work with developers, brokers and management firms.") },
    ],
    plans: industryPlans("إطلاق المشروع", "نمو المبيعات", "هيمنة السوق", "Project Launch", "Sales Growth", "Market Domination"),
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
  },
];

// ------------- Sub-services (landing pages per discipline) -------------

const subPlan = (
  id: string,
  nameAr: string,
  nameEn: string,
  descAr: string,
  descEn: string,
  price: number,
  original: number,
  featuresAr: string[],
  featuresEn: string[],
  highlighted = false,
): PricingPlan => ({
  id,
  name: ls(nameAr, nameEn),
  description: ls(descAr, descEn),
  priceSar: price,
  originalPriceSar: original,
  discountPct: Math.round(((original - price) / original) * 100),
  highlighted,
  features: ll(featuresAr, featuresEn),
});

export const subServices: SubServiceMeta[] = [
  // ---------- SEO sub-services ----------
  {
    slug: "technical-audit",
    parentSlug: "seo",
    title: ls("مراجعة السيو التقني الشاملة", "Comprehensive Technical SEO Audit"),
    shortLabel: ls("السيو التقني", "Technical Audit"),
    metaTitle: ls(
      "مراجعة سيو تقني احترافية لموقعك | فكرة",
      "Pro Technical SEO Audit for Your Site | Fikra",
    ),
    metaDescription: ls(
      "تدقيق سيو تقني شامل: السرعة، الزحف، الفهرسة، Core Web Vitals، Schema، وخارطة عمل واضحة لرفع ترتيبك.",
      "Full technical SEO audit: speed, crawl, indexation, Core Web Vitals, schema, and a clear action plan.",
    ),
    intro: ls(
      "نفحص موقعك بأكثر من 200 نقطة تقنية ونسلّمك تقريراً تنفيذياً بأولويات واضحة وخارطة طريق لتحسين السرعة والزحف والترتيب.",
      "We audit your site against 200+ technical checks and deliver an executive report with prioritized fixes to boost speed, crawl and rankings.",
    ),
    highlights: ll(
      ["تدقيق Core Web Vitals", "تحليل الزحف والفهرسة", "مراجعة Schema و Rich Results", "اكتشاف الصفحات اليتيمة", "خارطة طريق بالأولويات"],
      ["Core Web Vitals audit", "Crawl & indexation analysis", "Schema & rich results review", "Orphan pages detection", "Prioritized roadmap"],
    ),
    process: [
      { step: ls("جمع البيانات", "Data collection"), detail: ls("ربط Search Console و Analytics وتشغيل الزحف الكامل.", "Connect Search Console & Analytics, run full crawl.") },
      { step: ls("التحليل", "Analysis"), detail: ls("فحص أكثر من 200 نقطة تقنية ومعمارية.", "Check 200+ technical and architectural points.") },
      { step: ls("التقرير", "Report"), detail: ls("تقرير تنفيذي + قائمة إصلاحات بالأولويات.", "Executive report + prioritized fix list.") },
      { step: ls("الجلسة التنفيذية", "Handover call"), detail: ls("جلسة شرح كاملة مع فريقك التقني.", "Full walkthrough call with your tech team.") },
    ],
    deliverables: ll(
      ["تقرير PDF تفصيلي (40+ صفحة)", "ملف Excel بقائمة الإصلاحات", "فيديو شرح", "جلسة استشارية ساعة"],
      ["Detailed PDF report (40+ pages)", "Excel fix list", "Walkthrough video", "1-hour consultation"],
    ),
    faqs: [
      { q: ls("كم يستغرق التدقيق؟", "How long does the audit take?"), a: ls("من 7 إلى 14 يوم عمل حسب حجم الموقع.", "7 to 14 business days depending on site size.") },
      { q: ls("هل تنفذون الإصلاحات؟", "Do you implement the fixes?"), a: ls("نعم، عبر باقات السيو الشهرية أو كمشروع تنفيذ منفصل.", "Yes, via our monthly SEO plans or as a separate implementation project.") },
    ],
    plans: [
      subPlan("audit-essential", "تدقيق أساسي", "Essential Audit", "للمواقع حتى 50 صفحة", "For sites up to 50 pages", 1990, 2490,
        ["زحف كامل للموقع", "تدقيق 100 نقطة", "تقرير PDF", "قائمة إصلاحات Excel"],
        ["Full site crawl", "100-point audit", "PDF report", "Excel fix list"],
      ),
      subPlan("audit-pro", "تدقيق احترافي", "Pro Audit", "للمواقع المتوسطة والمتاجر", "For mid-size sites and stores", 3990, 4990,
        ["زحف غير محدود", "تدقيق 200 نقطة", "تحليل المنافسين (3)", "تقرير + فيديو شرح", "جلسة 60 دقيقة"],
        ["Unlimited crawl", "200-point audit", "Competitor analysis (3)", "Report + walkthrough video", "60-min strategy call"],
        true,
      ),
      subPlan("audit-enterprise", "تدقيق المؤسسات", "Enterprise Audit", "للمواقع الكبيرة والمعقدة", "For large complex sites", 8990, 11990,
        ["كل ما في الاحترافي", "تدقيق Schema متقدم", "تحليل log files", "تدقيق International SEO", "ورشة عمل ليوم كامل"],
        ["Everything in Pro", "Advanced schema audit", "Log file analysis", "International SEO audit", "Full-day workshop"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "local-seo",
    parentSlug: "seo",
    title: ls("السيو المحلي وخرائط جوجل", "Local SEO & Google Maps"),
    shortLabel: ls("السيو المحلي", "Local SEO"),
    metaTitle: ls(
      "خدمة السيو المحلي وتحسين Google Business | فكرة",
      "Local SEO & Google Business Optimization | Fikra",
    ),
    metaDescription: ls(
      "تصدّر نتائج البحث المحلي وخرائط جوجل في مدينتك. تحسين Google Business، مراجعات، واستهداف جغرافي دقيق.",
      "Dominate local search and Google Maps in your city. GBP optimization, reviews, and precise geo targeting.",
    ),
    intro: ls(
      "نضع نشاطك في أعلى نتائج البحث المحلي وخرائط جوجل، نزيد المكالمات والزيارات الفعلية للفرع من خلال تحسين كامل لـ Google Business واستراتيجية مراجعات قوية.",
      "We put your business at the top of local search and Maps, increasing calls and visits through full GBP optimization and a strong reviews strategy.",
    ),
    highlights: ll(
      ["تحسين Google Business Profile", "إدارة المراجعات والردود", "بناء Citations محلية", "صفحات هبوط لكل مدينة/فرع", "تتبع المكالمات والاتجاهات"],
      ["GBP optimization", "Reviews management", "Local citations building", "Per-city/branch landing pages", "Call & directions tracking"],
    ),
    process: [
      { step: ls("التدقيق المحلي", "Local audit"), detail: ls("فحص ملفك الحالي وحضورك المحلي والمنافسين.", "Audit your current profile, presence and competitors.") },
      { step: ls("التحسين", "Optimization"), detail: ls("تحسين كامل لـ GBP وبيانات NAP والصور.", "Full GBP, NAP and media optimization.") },
      { step: ls("بناء السلطة", "Authority"), detail: ls("بناء Citations ومراجعات وروابط محلية.", "Build citations, reviews and local links.") },
      { step: ls("القياس", "Measurement"), detail: ls("تتبع المكالمات، الاتجاهات، والترتيب في الخريطة.", "Track calls, directions, and map rankings.") },
    ],
    deliverables: ll(
      ["GBP محسّن بالكامل", "10 Citations محلية شهرياً", "صفحة هبوط لكل فرع", "تقرير شهري بترتيب الخريطة"],
      ["Fully optimized GBP", "10 local citations / month", "Landing page per branch", "Monthly map ranking report"],
    ),
    faqs: [
      { q: ls("كم يستغرق ظهوري في خرائط جوجل؟", "How long to rank on Google Maps?"), a: ls("النتائج الأولية خلال 30-60 يوم، نتائج قوية بعد 3-4 شهور.", "Initial results in 30-60 days, strong results after 3-4 months.") },
      { q: ls("هل تشمل الخدمة عدة فروع؟", "Does it cover multiple branches?"), a: ls("نعم، باقاتنا تدعم من فرع واحد حتى سلاسل متعددة الفروع.", "Yes, our plans cover from one branch up to multi-branch chains.") },
    ],
    plans: [
      subPlan("local-single", "فرع واحد", "Single Location", "نشاط بفرع واحد", "Single-branch business", 1490, 1890,
        ["تحسين GBP كامل", "5 Citations شهرياً", "إدارة المراجعات", "تقرير شهري"],
        ["Full GBP optimization", "5 citations / month", "Reviews management", "Monthly report"],
      ),
      subPlan("local-multi", "متعدد الفروع", "Multi-Location", "حتى 5 فروع", "Up to 5 branches", 3490, 4490,
        ["كل ما سبق × 5 فروع", "10 Citations لكل فرع", "صفحة هبوط لكل فرع", "تتبع المكالمات", "مكالمة شهرية"],
        ["Everything above × 5 branches", "10 citations per branch", "Landing page per branch", "Call tracking", "Monthly call"],
        true,
      ),
      subPlan("local-chain", "سلسلة فروع", "Chain Network", "أكثر من 5 فروع", "More than 5 branches", 6990, 8990,
        ["فروع غير محدودة", "Citations مكثّفة", "استراتيجية مراجعات متقدمة", "Dashboard موحّد", "مدير حساب مخصص"],
        ["Unlimited branches", "Intensive citations", "Advanced reviews strategy", "Unified dashboard", "Dedicated manager"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "link-building",
    parentSlug: "seo",
    title: ls("بناء الروابط الآمن (Link Building)", "Safe Link Building"),
    shortLabel: ls("بناء الروابط", "Link Building"),
    metaTitle: ls(
      "خدمة بناء روابط احترافية وآمنة لموقعك | فكرة",
      "Safe & Authoritative Link Building Service | Fikra",
    ),
    metaDescription: ls(
      "نبني لك روابط خلفية عالية الجودة من مواقع موثوقة باستخدام Outreach حقيقي ومحتوى ضيف احترافي.",
      "We build high-quality backlinks from trusted sites via real outreach and pro guest content.",
    ),
    intro: ls(
      "روابط خلفية حقيقية من مواقع ذات سلطة (DR 40+) عبر Outreach يدوي ومحتوى ضيف عربي وإنجليزي، بدون شبكات PBN أو روابط ضارة.",
      "Real backlinks from authority sites (DR 40+) via manual outreach and quality guest content — no PBNs or risky tactics.",
    ),
    highlights: ll(
      ["روابط من مواقع DR 40+", "Outreach يدوي حقيقي", "محتوى ضيف عربي/إنجليزي", "تقرير شهري بكل رابط", "تنويع طبيعي للمصادر"],
      ["Links from DR 40+ sites", "Real manual outreach", "AR/EN guest content", "Monthly link report", "Natural source diversity"],
    ),
    process: [
      { step: ls("تحليل البروفايل", "Profile analysis"), detail: ls("دراسة بروفايل الروابط الحالي والفجوات.", "Analyze current backlink profile and gaps.") },
      { step: ls("الاستهداف", "Targeting"), detail: ls("بناء قائمة مواقع نوعية وكلمات Anchor متنوعة.", "Build a list of quality sites and varied anchors.") },
      { step: ls("Outreach", "Outreach"), detail: ls("تواصل بشري مع المحررين وكتابة محتوى ضيف.", "Human outreach to editors and guest content writing.") },
      { step: ls("التقرير", "Reporting"), detail: ls("تقرير شهري بكل رابط جديد ومقاييس السلطة.", "Monthly report with each new link and authority metrics.") },
    ],
    deliverables: ll(
      ["روابط من مواقع DR 40+", "محتوى ضيف أصلي", "تقرير شهري شامل", "تنويع Anchors آمن"],
      ["DR 40+ backlinks", "Original guest content", "Comprehensive monthly report", "Safe anchor diversity"],
    ),
    faqs: [
      { q: ls("هل الروابط آمنة من عقوبات جوجل؟", "Are the links safe from Google penalties?"), a: ls("نعم، نلتزم بإرشادات جوجل ولا نستخدم PBN أو شراء روابط مشبوهة.", "Yes — we follow Google guidelines and don't use PBNs or sketchy paid links.") },
      { q: ls("متى أرى تأثير الروابط؟", "When do I see link impact?"), a: ls("التأثير يبدأ بعد 60-90 يوم وينمو مع تراكم الروابط.", "Impact starts after 60-90 days and compounds over time.") },
    ],
    plans: [
      subPlan("links-starter", "5 روابط/شهر", "5 Links/Month", "للمواقع الجديدة", "For new sites", 2490, 2990,
        ["5 روابط DR 30+", "محتوى ضيف", "Outreach يدوي", "تقرير شهري"],
        ["5 links DR 30+", "Guest content", "Manual outreach", "Monthly report"],
      ),
      subPlan("links-growth", "10 روابط/شهر", "10 Links/Month", "للنمو السريع", "For fast growth", 4490, 5490,
        ["10 روابط DR 40+", "محتوى ضيف احترافي", "Skyscraper content", "تقرير شامل + استشارة"],
        ["10 links DR 40+", "Pro guest content", "Skyscraper content", "Full report + consultation"],
        true,
      ),
      subPlan("links-authority", "20 روابط/شهر", "20 Links/Month", "للمنافسة الشرسة", "For tough competition", 8490, 10490,
        ["20 روابط DR 50+", "روابط Editorial", "PR Outreach", "إدارة سمعة وذكر العلامة"],
        ["20 links DR 50+", "Editorial links", "PR outreach", "Brand mentions management"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1614064548237-096d7da10c44?auto=format&fit=crop&w=1600&q=80",
  },

  // ---------- Performance sub-services ----------
  {
    slug: "google-ads",
    parentSlug: "performance",
    title: ls("إدارة إعلانات جوجل (Search & Display)", "Google Ads Management (Search & Display)"),
    shortLabel: ls("إعلانات جوجل", "Google Ads"),
    metaTitle: ls(
      "خدمة إدارة إعلانات جوجل احترافية | فكرة",
      "Pro Google Ads Management Service | Fikra",
    ),
    metaDescription: ls(
      "إدارة احترافية لحملات Google Search و Display و Performance Max بأعلى عائد ممكن لميزانيتك.",
      "Pro management of Google Search, Display and Performance Max campaigns for maximum ROI.",
    ),
    intro: ls(
      "كل ريال إعلاني يصل لعميل في لحظة قراره الشرائي. نبني حملات Search و Performance Max بمنهجية data-driven وكلمات مفتاحية مدروسة وصفحات هبوط محسّنة للتحويل.",
      "Every dollar reaches a customer at their decision moment. We build Search and Performance Max campaigns with data-driven methodology, researched keywords and conversion-optimized landing pages.",
    ),
    highlights: ll(
      ["إعداد Conversion Tracking كامل", "بحث كلمات مفتاحية متقدم", "كتابة إعلانات A/B", "Performance Max محسّن", "تقارير شفافة"],
      ["Full conversion tracking setup", "Advanced keyword research", "A/B ad copy", "Optimized Performance Max", "Transparent reporting"],
    ),
    process: [
      { step: ls("الإعداد", "Setup"), detail: ls("تثبيت GTM، Conversions API، وتنظيم الحساب.", "GTM, Conversions API, account structure.") },
      { step: ls("البحث", "Research"), detail: ls("بحث كلمات مفتاحية وتحليل المنافسين.", "Keyword research and competitor analysis.") },
      { step: ls("الإطلاق", "Launch"), detail: ls("بناء الحملات وكتابة الإعلانات وإطلاق منظم.", "Build campaigns, write ads, staged launch.") },
      { step: ls("التحسين", "Optimization"), detail: ls("اختبارات يومية للكلمات والمزايدات والإعلانات.", "Daily tests on keywords, bids and ads.") },
    ],
    deliverables: ll(
      ["إعداد كامل للحملات", "إدارة شهرية احترافية", "تقارير أسبوعية", "Dashboard أداء مباشر"],
      ["Full campaign setup", "Pro monthly management", "Weekly reports", "Live performance dashboard"],
    ),
    faqs: [
      { q: ls("ما الحد الأدنى للميزانية؟", "Minimum budget?"), a: ls("ننصح بـ 3000 ر.س شهرياً كحد أدنى.", "We recommend SAR 3,000/month minimum.") },
      { q: ls("هل تنشئون صفحات هبوط؟", "Do you build landing pages?"), a: ls("نعم، ضمن باقاتنا المتقدمة أو كخدمة منفصلة.", "Yes, in advanced plans or as a separate service.") },
    ],
    plans: [
      subPlan("gads-starter", "حملة تأسيسية", "Foundation", "حملة Search واحدة", "Single Search campaign", 1490, 1890,
        ["إعداد كامل", "حملة Search واحدة", "تتبع التحويلات", "تقرير شهري"],
        ["Full setup", "1 Search campaign", "Conversion tracking", "Monthly report"],
      ),
      subPlan("gads-growth", "حملات متعددة", "Multi-Campaign", "Search + Display + Pmax", "Search + Display + Pmax", 3490, 4290,
        ["3-5 حملات", "Performance Max محسّن", "Remarketing", "تقارير أسبوعية", "مكالمة شهرية"],
        ["3-5 campaigns", "Optimized Performance Max", "Remarketing", "Weekly reports", "Monthly call"],
        true,
      ),
      subPlan("gads-pro", "إدارة مكثّفة", "Intensive", "حملات ميزانيات كبيرة", "Large-budget campaigns", 6990, 8990,
        ["حملات غير محدودة", "Bid strategies متقدم", "تحسين Feed للمتاجر", "Dashboard مخصص", "مدير حساب مخصص"],
        ["Unlimited campaigns", "Advanced bid strategies", "Shopping feed optimization", "Custom dashboard", "Dedicated manager"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "social-ads",
    parentSlug: "performance",
    title: ls("إعلانات السوشيال ميديا (Meta, TikTok, Snap)", "Social Media Ads (Meta, TikTok, Snap)"),
    shortLabel: ls("إعلانات السوشيال", "Social Ads"),
    metaTitle: ls(
      "إدارة إعلانات Meta و TikTok و Snapchat | فكرة",
      "Meta, TikTok & Snapchat Ads Management | Fikra",
    ),
    metaDescription: ls(
      "حملات Meta و TikTok و Snapchat بكرييتيف يبيع وتتبع تحويلات متقدم وعائد مدروس.",
      "Meta, TikTok and Snapchat campaigns with sales-driven creative and advanced conversion tracking.",
    ),
    intro: ls(
      "نبيع لك على فيسبوك وإنستغرام وتيك توك وسناب بكرييتيف يلفت ويُحوّل، استهداف دقيق وتتبع متقدم عبر Conversions API لاستعادة بيانات الـ iOS.",
      "We sell on Facebook, Instagram, TikTok and Snap with attention-grabbing creative, precise targeting and advanced tracking via Conversions API.",
    ),
    highlights: ll(
      ["Meta + TikTok + Snap", "Conversions API للـ iOS", "كرييتيف شهري متجدد", "A/B testing مستمر", "Lookalikes وReengagement"],
      ["Meta + TikTok + Snap", "Conversions API for iOS", "Monthly fresh creative", "Continuous A/B testing", "Lookalikes & re-engagement"],
    ),
    process: [
      { step: ls("الاستراتيجية", "Strategy"), detail: ls("تحديد المنصات والجمهور والـ Funnel.", "Define platforms, audience and funnel.") },
      { step: ls("الكرييتيف", "Creative"), detail: ls("إنتاج فيديو وتصاميم تناسب كل منصة.", "Produce videos and visuals per platform.") },
      { step: ls("الإطلاق", "Launch"), detail: ls("اختبار حملات Cold + Retargeting بمراحل.", "Test cold + retargeting campaigns in stages.") },
      { step: ls("التوسع", "Scaling"), detail: ls("توسيع الفائز وقتل الخاسر بشكل يومي.", "Scale winners, kill losers daily.") },
    ],
    deliverables: ll(
      ["إعداد Pixels و Conversions API", "كرييتيف شهري", "تقارير أسبوعية", "Dashboard أداء"],
      ["Pixels & Conversions API setup", "Monthly creative", "Weekly reports", "Performance dashboard"],
    ),
    faqs: [
      { q: ls("كم كرييتيف شهرياً؟", "How many creatives per month?"), a: ls("يبدأ من 6 ويصل لـ 30 حسب الباقة.", "Starts at 6 and scales to 30 per plan.") },
      { q: ls("هل تتعاملون مع متاجر سلة؟", "Do you support Salla stores?"), a: ls("نعم، نتكامل مع سلة وZid وShopify وWooCommerce.", "Yes — Salla, Zid, Shopify and WooCommerce integrations.") },
    ],
    plans: [
      subPlan("social-launch", "إطلاق منصة واحدة", "Single Platform", "Meta أو TikTok فقط", "Meta or TikTok only", 1790, 2290,
        ["منصة واحدة", "حتى 4 حملات", "6 كرييتيف شهرياً", "تقرير نصف شهري"],
        ["1 platform", "Up to 4 campaigns", "6 creatives / month", "Bi-weekly report"],
      ),
      subPlan("social-multi", "متعدد المنصات", "Multi-Platform", "Meta + TikTok + Snap", "Meta + TikTok + Snap", 3990, 4990,
        ["3 منصات", "حتى 8 حملات", "15 كرييتيف شهرياً", "Conversions API", "تقارير أسبوعية"],
        ["3 platforms", "Up to 8 campaigns", "15 creatives / month", "Conversions API", "Weekly reports"],
        true,
      ),
      subPlan("social-scale", "توسع تجاري", "Scale", "ميزانيات كبيرة", "Large budgets", 7990, 9990,
        ["كل المنصات", "حملات غير محدودة", "30 كرييتيف شهرياً", "Funnel كامل", "مدير حملات مخصص"],
        ["All platforms", "Unlimited campaigns", "30 creatives / month", "Full funnel", "Dedicated manager"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1600&q=80",
  },

  // ---------- Creative sub-services ----------
  {
    slug: "branding",
    parentSlug: "creative",
    title: ls("تصميم الهوية البصرية والشعار", "Brand Identity & Logo Design"),
    shortLabel: ls("الهوية البصرية", "Brand Identity"),
    metaTitle: ls(
      "تصميم هوية بصرية احترافية وشعار مميز | فكرة",
      "Pro Brand Identity & Logo Design | Fikra",
    ),
    metaDescription: ls(
      "هوية بصرية كاملة: شعار، ألوان، خطوط، Brand book، وقوالب تطبيقية لكل قنوات علامتك.",
      "Full brand identity: logo, colors, typography, brand book, and applied templates for every channel.",
    ),
    intro: ls(
      "نصمم لك هوية بصرية تعبّر عن قيم علامتك وتميّزك في السوق. شعار احترافي، نظام ألوان وخطوط، وBrand book متكامل يضمن استخدام موحد عبر كل القنوات.",
      "We design a brand identity that expresses your values and differentiates you. Pro logo, color and type system, and a comprehensive brand book for consistent application.",
    ),
    highlights: ll(
      ["شعار + 5 إصدارات", "نظام ألوان وخطوط", "Brand book PDF", "قوالب سوشيال جاهزة", "ملفات Source كاملة"],
      ["Logo + 5 variations", "Color & type system", "Brand book PDF", "Ready social templates", "Full source files"],
    ),
    process: [
      { step: ls("الاكتشاف", "Discovery"), detail: ls("جلسة عميقة لفهم قيمك وجمهورك ومنافسيك.", "Deep session on values, audience, competitors.") },
      { step: ls("الاتجاه", "Direction"), detail: ls("Mood boards واتجاهات بصرية للاختيار.", "Mood boards and visual directions to choose from.") },
      { step: ls("التصميم", "Design"), detail: ls("3 اتجاهات شعار + جولتي مراجعة.", "3 logo concepts + 2 revision rounds.") },
      { step: ls("التسليم", "Delivery"), detail: ls("Brand book + كل الملفات + جلسة استخدام.", "Brand book + all files + usage session.") },
    ],
    deliverables: ll(
      ["شعار بكل الصيغ (AI/SVG/PNG)", "Brand book 30+ صفحة", "قوالب سوشيال", "نماذج تطبيقية"],
      ["Logo in all formats (AI/SVG/PNG)", "Brand book 30+ pages", "Social templates", "Application mockups"],
    ),
    faqs: [
      { q: ls("كم يستغرق المشروع؟", "How long does it take?"), a: ls("من 14 إلى 21 يوم عمل.", "14 to 21 business days.") },
      { q: ls("هل أحصل على ملكية كاملة؟", "Do I own full rights?"), a: ls("نعم، تنتقل الملكية الكاملة بعد الاعتماد النهائي والدفع.", "Yes, full ownership transfers after final approval and payment.") },
    ],
    plans: [
      subPlan("brand-mini", "هوية مصغّرة", "Mini Identity", "للمشاريع الناشئة", "For new ventures", 1990, 2490,
        ["شعار + 3 إصدارات", "ألوان وخطوط أساسية", "Mini guide (8 صفحات)", "5 قوالب سوشيال"],
        ["Logo + 3 variations", "Basic colors & type", "Mini guide (8 pages)", "5 social templates"],
      ),
      subPlan("brand-pro", "هوية احترافية", "Pro Identity", "للشركات النامية", "For growing companies", 4990, 6490,
        ["شعار + 5 إصدارات", "نظام ألوان وخطوط كامل", "Brand book 30 صفحة", "15 قالب سوشيال", "نماذج تطبيقية"],
        ["Logo + 5 variations", "Full color & type system", "30-page brand book", "15 social templates", "Application mockups"],
        true,
      ),
      subPlan("brand-enterprise", "هوية مؤسسية", "Enterprise Identity", "للشركات الكبرى", "For large companies", 11990, 14990,
        ["نظام هوية شامل", "Brand book 60+ صفحة", "هوية صوتية ولغوية", "قوالب لكل القنوات", "ورشة تدريب فريقك"],
        ["Comprehensive identity system", "60+ page brand book", "Voice & verbal identity", "Templates for all channels", "Team training workshop"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "video-motion",
    parentSlug: "creative",
    title: ls("إنتاج الفيديو والموشن جرافيك", "Video Production & Motion Graphics"),
    shortLabel: ls("الفيديو والموشن", "Video & Motion"),
    metaTitle: ls(
      "إنتاج فيديو احترافي وموشن جرافيك للشركات | فكرة",
      "Pro Video Production & Motion Graphics | Fikra",
    ),
    metaDescription: ls(
      "إنتاج فيديو تسويقي، ريلز، موشن جرافيك، وإعلانات بصرية تجذب الانتباه وتُحوّل المشاهد لعميل.",
      "Marketing videos, reels, motion graphics, and visual ads that grab attention and convert viewers.",
    ),
    intro: ls(
      "في زمن الـ Scroll السريع، الفيديو هو الذي يوقف العميل. ننتج فيديوهات قصيرة وطويلة، موشن جرافيك، وإعلانات بصرية مبنية على Storyboarding احترافي وأهداف تسويقية واضحة.",
      "In the era of fast scrolling, video is what stops your customer. We produce short and long videos, motion graphics, and visual ads with pro storyboarding and clear goals.",
    ),
    highlights: ll(
      ["ريلز و TikToks قصيرة", "موشن جرافيك", "فيديو شركاتي", "إعلانات Performance", "Storyboarding احترافي"],
      ["Short reels & TikToks", "Motion graphics", "Corporate video", "Performance ads", "Pro storyboarding"],
    ),
    process: [
      { step: ls("الاستراتيجية", "Strategy"), detail: ls("تحديد الهدف والجمهور والرسالة.", "Define goal, audience and message.") },
      { step: ls("الـ Storyboard", "Storyboard"), detail: ls("سيناريو وStoryboard مفصّل.", "Script and detailed storyboard.") },
      { step: ls("الإنتاج", "Production"), detail: ls("تصوير أو موشن أو خليط احترافي.", "Filming, motion or pro hybrid.") },
      { step: ls("المونتاج", "Editing"), detail: ls("مونتاج، ألوان، صوت، Subtitles.", "Editing, color, sound, subtitles.") },
    ],
    deliverables: ll(
      ["فيديوهات MP4 جاهزة", "نسخ مربعة وعمودية", "Subtitles عربي/إنجليزي", "ملفات Source"],
      ["Ready MP4 videos", "Square & vertical versions", "AR/EN subtitles", "Source files"],
    ),
    faqs: [
      { q: ls("كم فيديو شهرياً؟", "How many videos per month?"), a: ls("من 4 إلى 15 فيديو حسب الباقة.", "From 4 to 15 videos per plan.") },
      { q: ls("هل تشمل التصوير؟", "Includes shooting?"), a: ls("نعم في الباقات الاحترافية والمؤسسية.", "Yes in Pro and Enterprise plans.") },
    ],
    plans: [
      subPlan("video-reels", "ريلز شهرية", "Monthly Reels", "محتوى قصير منتظم", "Regular short content", 2490, 2990,
        ["6 ريلز شهرياً", "موشن خفيف", "Subtitles", "نسخ مربعة وعمودية"],
        ["6 reels / month", "Light motion", "Subtitles", "Square & vertical versions"],
      ),
      subPlan("video-pro", "إنتاج احترافي", "Pro Production", "تصوير + موشن", "Filming + motion", 5990, 7490,
        ["10 فيديو شهرياً", "تصوير احترافي", "موشن جرافيك", "Storyboarding", "Subtitles AR/EN"],
        ["10 videos / month", "Pro filming", "Motion graphics", "Storyboarding", "AR/EN subtitles"],
        true,
      ),
      subPlan("video-cinema", "إنتاج سينمائي", "Cinematic", "حملات كبرى", "Major campaigns", 12990, 16490,
        ["إنتاج كامل بفريق سينمائي", "ممثلين ومواقع", "موشن متقدم وVFX", "نسخ متعددة لكل منصة"],
        ["Full production with cinematic team", "Talent & locations", "Advanced motion & VFX", "Multi-platform versions"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "content-writing",
    parentSlug: "creative",
    title: ls("كتابة المحتوى الإبداعي والتسويقي", "Creative & Marketing Copywriting"),
    shortLabel: ls("كتابة المحتوى", "Copywriting"),
    metaTitle: ls(
      "خدمة كتابة المحتوى التسويقي والإبداعي | فكرة",
      "Marketing & Creative Copywriting Service | Fikra",
    ),
    metaDescription: ls(
      "كتابة محتوى تسويقي وإبداعي بالعربي والإنجليزي: مقالات سيو، Captions، صفحات هبوط، وإعلانات تبيع.",
      "AR/EN marketing copywriting: SEO articles, captions, landing pages, and ads that sell.",
    ),
    intro: ls(
      "الكلمة الصحيحة تبيع أكثر من أي إعلان مدفوع. نكتب لك محتوى يخاطب جمهورك بلسانه، يبني الثقة، ويحوّل القارئ لعميل — بالعربي والإنجليزي.",
      "The right word sells more than any paid ad. We write content that speaks your audience's language, builds trust and converts — in Arabic and English.",
    ),
    highlights: ll(
      ["مقالات سيو طويلة", "Captions سوشيال ميديا", "كتابة صفحات هبوط", "كتابة إعلانات", "بريد إلكتروني تسويقي"],
      ["Long-form SEO articles", "Social media captions", "Landing page copy", "Ad copy", "Marketing emails"],
    ),
    process: [
      { step: ls("Brief", "Brief"), detail: ls("جلسة تحديد الجمهور والأهداف ونبرة العلامة.", "Define audience, goals and brand voice.") },
      { step: ls("البحث", "Research"), detail: ls("بحث كلمات مفتاحية ومنافسين وزوايا فريدة.", "Keyword, competitor and angle research.") },
      { step: ls("الكتابة", "Writing"), detail: ls("مسودة + جولة مراجعة + تحرير نهائي.", "Draft + revision round + final edit.") },
      { step: ls("التحسين", "Optimization"), detail: ls("تحسين سيو، CTAs، وتنسيق نهائي.", "SEO, CTAs and final formatting.") },
    ],
    deliverables: ll(
      ["مقالات Word/Google Docs", "Captions جدول شهري", "صفحات هبوط جاهزة", "نسخ إعلانات A/B"],
      ["Word/Google Docs articles", "Monthly captions calendar", "Ready landing pages", "A/B ad copy variants"],
    ),
    faqs: [
      { q: ls("هل المحتوى مكتوب بالذكاء الاصطناعي؟", "Is content AI-written?"), a: ls("الكتابة بشرية بالكامل مع استخدام مساعد للأبحاث فقط.", "Fully human-written; AI used only for research support.") },
      { q: ls("كم يستغرق المقال؟", "How long for one article?"), a: ls("من 3 إلى 7 أيام حسب الطول والبحث.", "3 to 7 days based on length and research.") },
    ],
    plans: [
      subPlan("copy-social", "محتوى سوشيال", "Social Pack", "للحضور المنتظم", "Regular presence", 1490, 1890,
        ["20 Caption شهرياً", "تقويم محتوى", "Hashtags وOptimization"],
        ["20 captions / month", "Content calendar", "Hashtags & optimization"],
      ),
      subPlan("copy-blog", "مقالات سيو", "SEO Articles", "للنمو العضوي", "For organic growth", 3490, 4290,
        ["6 مقالات شهرياً (1500+ كلمة)", "بحث كلمات مفتاحية", "تحسين سيو كامل", "صور توضيحية"],
        ["6 articles / month (1500+ words)", "Keyword research", "Full SEO optimization", "Visual support"],
        true,
      ),
      subPlan("copy-full", "محتوى متكامل", "Full Stack", "كل قنواتك", "All your channels", 6990, 8490,
        ["مقالات + Captions + إعلانات", "كتابة صفحات هبوط", "بريد إلكتروني تسويقي", "نبرة موحدة عبر القنوات"],
        ["Articles + captions + ads", "Landing page copy", "Marketing emails", "Unified voice across channels"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
  },

  // ---------- Web sub-services ----------
  {
    slug: "wordpress",
    parentSlug: "web",
    title: ls("تصميم وتطوير مواقع وردبريس", "WordPress Design & Development"),
    shortLabel: ls("مواقع وردبريس", "WordPress"),
    metaTitle: ls(
      "تصميم مواقع وردبريس احترافية وسريعة | فكرة",
      "Pro & Fast WordPress Website Design | Fikra",
    ),
    metaDescription: ls(
      "نصمم مواقع وردبريس مخصصة، سريعة، آمنة، ومحسّنة لمحركات البحث، مع لوحة إدارة سهلة ومرنة.",
      "Custom WordPress sites: fast, secure, SEO-optimized with an easy admin panel.",
    ),
    intro: ls(
      "موقع وردبريس مبني من الصفر بكود نظيف، تصميم مخصص يعكس علامتك، أداء عالٍ في Core Web Vitals، ولوحة إدارة سهلة تتيح لفريقك التحديث بدون مطورين.",
      "WordPress site built from scratch with clean code, custom design, high Core Web Vitals scores, and an easy admin panel your team can manage.",
    ),
    highlights: ll(
      ["تصميم مخصص 100%", "كود نظيف وسريع", "لوحة إدارة سهلة", "تحسين Core Web Vitals", "أمان متقدم وحماية"],
      ["100% custom design", "Clean fast code", "Easy admin panel", "Core Web Vitals optimized", "Advanced security"],
    ),
    process: [
      { step: ls("Discovery", "Discovery"), detail: ls("جلسة احتياجات وWireframes.", "Requirements and wireframes.") },
      { step: ls("التصميم", "Design"), detail: ls("UI احترافي على نظام تصميم.", "Pro UI on a design system.") },
      { step: ls("التطوير", "Development"), detail: ls("بناء بقالب مخصص أو Builder احترافي.", "Build with custom theme or pro builder.") },
      { step: ls("الإطلاق", "Launch"), detail: ls("اختبار، تدريب، نقل آمن، ضمان.", "Testing, training, safe migration, warranty.") },
    ],
    deliverables: ll(
      ["موقع جاهز للنشر", "تدريب فريقك", "وثائق فنية", "ضمان 60 يوم"],
      ["Production-ready site", "Team training", "Tech documentation", "60-day warranty"],
    ),
    faqs: [
      { q: ls("كم يستغرق المشروع؟", "How long does it take?"), a: ls("من 21 إلى 45 يوم حسب التعقيد.", "21 to 45 days depending on complexity.") },
      { q: ls("هل تشمل الاستضافة؟", "Includes hosting?"), a: ls("نوصي بالاستضافة الأنسب ونساعد بإعدادها.", "We recommend the best hosting and help set it up.") },
    ],
    plans: [
      subPlan("wp-starter", "موقع تأسيسي", "Starter Site", "حتى 5 صفحات", "Up to 5 pages", 3990, 4990,
        ["تصميم مخصص (5 صفحات)", "ريسبونسف كامل", "نموذج تواصل", "تحسين سرعة أساسي"],
        ["Custom design (5 pages)", "Fully responsive", "Contact form", "Basic speed optimization"],
      ),
      subPlan("wp-pro", "موقع احترافي", "Pro Site", "حتى 12 صفحة + مدونة", "Up to 12 pages + blog", 7990, 9990,
        ["تصميم مخصص (12 صفحة)", "مدونة كاملة", "تحسين Core Web Vitals", "سيو On-page", "تدريب فريقك"],
        ["Custom design (12 pages)", "Full blog", "Core Web Vitals optimization", "On-page SEO", "Team training"],
        true,
      ),
      subPlan("wp-corporate", "موقع مؤسسي", "Corporate Site", "صفحات غير محدودة + متعدد اللغات", "Unlimited pages + multilingual", 14990, 18990,
        ["صفحات غير محدودة", "متعدد اللغات", "تكاملات API", "أمان متقدم", "صيانة 6 شهور"],
        ["Unlimited pages", "Multilingual", "API integrations", "Advanced security", "6-month maintenance"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "ecommerce-dev",
    parentSlug: "web",
    title: ls("تطوير المتاجر الإلكترونية", "E-commerce Store Development"),
    shortLabel: ls("المتاجر الإلكترونية", "E-commerce Dev"),
    metaTitle: ls(
      "تطوير متاجر إلكترونية WooCommerce و Shopify | فكرة",
      "WooCommerce & Shopify Store Development | Fikra",
    ),
    metaDescription: ls(
      "متاجر إلكترونية متكاملة بدفع وشحن وتقارير، مبنية على WooCommerce أو Shopify أو سلة، جاهزة للبيع والنمو.",
      "Complete e-commerce stores with payments, shipping and analytics on WooCommerce, Shopify or Salla.",
    ),
    intro: ls(
      "متجر إلكتروني سريع وقابل للتوسع مع تكامل بوابات الدفع المحلية، شركات الشحن، التقارير، وتتبع التحويلات لـ Meta وGoogle — جاهز ليبدأ البيع من اليوم الأول.",
      "Fast scalable store with local payment gateways, shipping integrations, analytics, and Meta/Google conversion tracking — ready to sell from day one.",
    ),
    highlights: ll(
      ["WooCommerce / Shopify / سلة", "بوابات دفع محلية (Tap, HyperPay)", "تكامل شركات الشحن", "تتبع تحويلات Meta + Google", "تحسين CRO"],
      ["WooCommerce / Shopify / Salla", "Local payment gateways (Tap, HyperPay)", "Shipping integrations", "Meta + Google conversion tracking", "CRO optimization"],
    ),
    process: [
      { step: ls("الاختيار", "Platform"), detail: ls("اختيار المنصة الأنسب لحجمك ومتطلباتك.", "Pick the right platform for your size & needs.") },
      { step: ls("التصميم", "Design"), detail: ls("UI متجر مُحسّن للتحويل.", "Conversion-optimized store UI.") },
      { step: ls("التكاملات", "Integrations"), detail: ls("دفع، شحن، تتبع، CRM.", "Payments, shipping, tracking, CRM.") },
      { step: ls("الإطلاق", "Launch"), detail: ls("اختبار شامل، تدريب، إطلاق آمن.", "Full testing, training, safe launch.") },
    ],
    deliverables: ll(
      ["متجر جاهز للبيع", "تدريب الإدارة", "Conversion tracking", "وثائق وضمان"],
      ["Sell-ready store", "Admin training", "Conversion tracking", "Documentation & warranty"],
    ),
    faqs: [
      { q: ls("ما المنصة الأنسب لي؟", "Best platform for me?"), a: ls("نختار حسب احتياجك: Shopify للسرعة، WooCommerce للمرونة، سلة للسوق المحلي.", "Depends: Shopify for speed, WooCommerce for flexibility, Salla for local market.") },
      { q: ls("كم يستغرق المتجر؟", "How long for the store?"), a: ls("من 30 إلى 60 يوم حسب التعقيد.", "30 to 60 days depending on complexity.") },
    ],
    plans: [
      subPlan("ecom-starter", "متجر بداية", "Starter Store", "حتى 50 منتج", "Up to 50 products", 6990, 8490,
        ["متجر مخصص", "بوابة دفع محلية", "تكامل شحن واحد", "تتبع أساسي"],
        ["Custom store", "1 local gateway", "1 shipping integration", "Basic tracking"],
      ),
      subPlan("ecom-growth", "متجر النمو", "Growth Store", "حتى 500 منتج", "Up to 500 products", 12990, 15990,
        ["متجر متكامل", "بوابات دفع متعددة", "شركات شحن متعددة", "تتبع متقدم Meta+Google", "تكامل مع CRM"],
        ["Complete store", "Multiple gateways", "Multiple shipping", "Advanced Meta+Google tracking", "CRM integration"],
        true,
      ),
      subPlan("ecom-enterprise", "متجر المؤسسات", "Enterprise Store", "منتجات غير محدودة + Headless", "Unlimited products + Headless", 24990, 32990,
        ["Headless / SSR", "تكاملات ERP", "أداء عالٍ ومتعدد اللغات", "أمان مؤسسي", "SLA + دعم 24/7"],
        ["Headless / SSR", "ERP integrations", "High performance multilingual", "Enterprise security", "SLA + 24/7 support"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "crm-erp",
    parentSlug: "web",
    title: ls("أنظمة CRM و ERP وتكاملات الأعمال", "CRM, ERP & Business Integrations"),
    shortLabel: ls("CRM و ERP", "CRM & ERP"),
    metaTitle: ls(
      "تطوير أنظمة CRM و ERP وتكاملات الأعمال | فكرة",
      "Custom CRM, ERP & Business Integrations | Fikra",
    ),
    metaDescription: ls(
      "نطور وندمج أنظمة CRM و ERP مخصصة لتوحيد بيانات شركتك ورفع كفاءة فرق المبيعات والعمليات.",
      "Custom CRM and ERP systems & integrations to unify your data and boost sales/ops efficiency.",
    ),
    intro: ls(
      "نطوّر أنظمة CRM وERP مخصصة أو نُدمج الأنظمة الجاهزة (Zoho، Odoo، HubSpot) مع موقعك ومتجرك ومنصاتك الإعلانية لتوحيد بياناتك وأتمتة عملياتك.",
      "We build custom CRM/ERP systems or integrate ready ones (Zoho, Odoo, HubSpot) with your site, store and ad platforms to unify data and automate operations.",
    ),
    highlights: ll(
      ["CRM مخصص أو جاهز", "تكاملات API كاملة", "أتمتة المبيعات والعمليات", "Dashboards تنفيذية", "صلاحيات وأدوار"],
      ["Custom or ready CRM", "Full API integrations", "Sales & ops automation", "Executive dashboards", "Roles & permissions"],
    ),
    process: [
      { step: ls("التحليل", "Analysis"), detail: ls("تحليل عملياتك ومتطلباتك.", "Analyze your processes and requirements.") },
      { step: ls("التصميم", "Design"), detail: ls("تصميم النظام والتكاملات.", "System and integration design.") },
      { step: ls("التطوير", "Development"), detail: ls("بناء أو تخصيص + تكاملات.", "Build or customize + integrations.") },
      { step: ls("التدريب والإطلاق", "Training & launch"), detail: ls("تدريب فرقك وإطلاق منظم بمراحل.", "Train your teams and staged launch.") },
    ],
    deliverables: ll(
      ["نظام جاهز للاستخدام", "تدريب الفرق", "وثائق كاملة", "دعم ما بعد الإطلاق"],
      ["Ready-to-use system", "Team training", "Full documentation", "Post-launch support"],
    ),
    faqs: [
      { q: ls("هل تطورون من الصفر أم تستخدمون أنظمة جاهزة؟", "Custom build or ready system?"), a: ls("نوصي بما يناسب حجمك وميزانيتك: ربط جاهز للسريع، تطوير مخصص للمتطلبات الفريدة.", "We recommend what fits: ready integration for speed, custom for unique needs.") },
      { q: ls("هل تربطون مع متاجر سلة وZid؟", "Integrate with Salla & Zid?"), a: ls("نعم، نربط مع كل المنصات الكبرى عبر API.", "Yes — we integrate with all major platforms via API.") },
    ],
    plans: [
      subPlan("crm-ready", "تكامل جاهز", "Ready Integration", "Zoho / HubSpot / Pipedrive", "Zoho / HubSpot / Pipedrive", 4990, 6490,
        ["إعداد النظام", "تكامل مع موقعك", "تخصيص أساسي", "تدريب فريق المبيعات"],
        ["System setup", "Site integration", "Basic customization", "Sales team training"],
      ),
      subPlan("crm-custom", "تطوير مخصص", "Custom Build", "نظام مفصّل لاحتياجاتك", "System tailored to your needs", 14990, 18990,
        ["تحليل وتصميم كامل", "تطوير مخصص", "تكاملات API متعددة", "Dashboards", "تدريب وتوثيق"],
        ["Full analysis & design", "Custom development", "Multiple API integrations", "Dashboards", "Training & docs"],
        true,
      ),
      subPlan("crm-enterprise", "حل مؤسسي", "Enterprise Solution", "ERP + CRM متكامل", "Integrated ERP + CRM", 34990, 44990,
        ["ERP + CRM", "أتمتة عمليات شاملة", "تقارير تنفيذية متقدمة", "أمان مؤسسي", "SLA + دعم 24/7"],
        ["ERP + CRM", "End-to-end automation", "Advanced exec reporting", "Enterprise security", "SLA + 24/7 support"],
      ),
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
  },
];

// ------------- Sub-Industries (niche landing pages) -------------

export const subIndustries: SubIndustryMeta[] = [
  {
    slug: "fashion-eyewear",
    parentSlug: "ecommerce",
    title: ls("تسويق متاجر الأزياء والنظارات", "Fashion & Eyewear Stores Marketing"),
    shortLabel: ls("الأزياء والنظارات", "Fashion & Eyewear"),
    metaTitle: ls(
      "تسويق متاجر الأزياء والنظارات في السعودية والخليج | فكرة",
      "Fashion & Eyewear Store Marketing in KSA & Gulf | Fikra",
    ),
    metaDescription: ls(
      "نُسوّق متاجر الأزياء والنظارات بحملات بصرية، Influencers، وكتالوج إعلاني محسّن لرفع المبيعات.",
      "We market fashion & eyewear stores with visual campaigns, influencers, and optimized catalog ads.",
    ),
    intro: ls(
      "متاجر الأزياء والنظارات تنافس بالصورة قبل السعر. نبني لك حضوراً بصرياً قوياً، حملات Catalog وCollection ذكية، وتعاون مؤثرين مدروس لرفع المبيعات وتقليل الاسترجاع.",
      "Fashion & eyewear stores compete on visuals before price. We build a strong visual presence, smart catalog & collection campaigns, and curated influencer partnerships to lift sales and cut returns.",
    ),
    pains: ll(
      ["نسبة استرجاع عالية", "صعوبة التميز في سوق مزدحم", "ضعف عائد إعلانات الكتالوج"],
      ["High return rates", "Hard to stand out in a crowded market", "Weak catalog ad ROAS"],
    ),
    solutions: ll(
      ["تصوير منتجات وموديلز احترافي", "حملات Advantage+ Shopping محسّنة", "تعاون مؤثرين مدروس", "Reels و TikTok للمنتجات", "تقليل الاسترجاع بمحتوى مقاسات صحيح"],
      ["Pro product & model photography", "Optimized Advantage+ Shopping campaigns", "Curated influencer partnerships", "Reels & TikTok for products", "Returns reduction via accurate sizing content"],
    ),
    outcomes: [
      { value: "+260%", label: ls("نمو مبيعات الموسم", "Seasonal sales growth") },
      { value: "x5", label: ls("ROAS الكتالوج", "Catalog ROAS") },
      { value: "-22%", label: ls("نسبة الاسترجاع", "Return rate") },
    ],
    faqs: [
      { q: ls("هل تتعاملون مع متاجر سلة وZid؟", "Do you support Salla & Zid?"), a: ls("نعم، خبرة قوية مع سلة وZid وShopify وWooCommerce.", "Yes — strong experience with Salla, Zid, Shopify and WooCommerce.") },
      { q: ls("هل تساعدون بالتصوير؟", "Do you help with photography?"), a: ls("نعم، نقدم جلسات تصوير منتجات وموديلز ضمن باقاتنا الإبداعية.", "Yes — product & model shoots are included in our creative plans.") },
    ],
    plans: industryPlans("بداية الأزياء", "نمو الأزياء", "إمبراطورية الأزياء", "Fashion Starter", "Fashion Growth", "Fashion Empire"),
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "smart-home",
    parentSlug: "ecommerce",
    title: ls("تسويق متاجر الأجهزة الذكية", "Smart Home Devices Marketing"),
    shortLabel: ls("الأجهزة الذكية", "Smart Home"),
    metaTitle: ls(
      "تسويق متاجر الأجهزة الذكية والمنزل الذكي | فكرة",
      "Smart Home Devices Store Marketing | Fikra",
    ),
    metaDescription: ls(
      "نسوّق منتجات المنزل الذكي بمحتوى تعليمي وفيديوهات استخدام وحملات استهداف دقيقة لرفع التحويل.",
      "We market smart-home products with educational content, demo videos, and precise targeting to lift conversion.",
    ),
    intro: ls(
      "منتجات المنزل الذكي تحتاج تعليم العميل قبل بيعه. ننتج فيديوهات استخدام وUGC، صفحات هبوط بمقاطع شرح، وحملات استهداف دقيقة على Meta وTikTok وYouTube.",
      "Smart-home products need to educate before they sell. We produce demo videos & UGC, landing pages with how-to content, and precise targeting on Meta, TikTok and YouTube.",
    ),
    pains: ll(
      ["العميل لا يفهم المنتج بسهولة", "مقاومة شراء التقنية الجديدة", "تكلفة اكتساب مرتفعة"],
      ["Customers don't immediately get the product", "Resistance to buying new tech", "High customer acquisition cost"],
    ),
    solutions: ll(
      ["فيديوهات شرح وUGC", "صفحات هبوط تعليمية", "حملات YouTube مستهدفة", "Comparison و Bundle offers", "Email/WhatsApp Nurturing"],
      ["Demo videos & UGC", "Educational landing pages", "Targeted YouTube campaigns", "Comparisons & bundle offers", "Email/WhatsApp nurturing"],
    ),
    outcomes: [
      { value: "+190%", label: ls("نمو الطلبات", "Orders growth") },
      { value: "-34%", label: ls("تكلفة الاكتساب", "Acquisition cost") },
      { value: "x3.8", label: ls("ROAS", "ROAS") },
    ],
    faqs: [
      { q: ls("هل تنتجون فيديوهات شرح المنتجات؟", "Do you produce demo videos?"), a: ls("نعم، ضمن باقاتنا الإبداعية والإعلانية.", "Yes — included in our creative & ads plans.") },
    ],
    plans: industryPlans("بداية الذكية", "نمو الذكية", "هيمنة الذكية", "Smart Starter", "Smart Growth", "Smart Dominance"),
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "shipping-customs",
    parentSlug: "logistics",
    title: ls("تسويق شركات الشحن والتخليص الجمركي", "Shipping & Customs Clearance Marketing"),
    shortLabel: ls("الشحن والتخليص", "Shipping & Customs"),
    metaTitle: ls(
      "تسويق B2B لشركات الشحن والتخليص الجمركي | فكرة",
      "B2B Marketing for Shipping & Customs Clearance | Fikra",
    ),
    metaDescription: ls(
      "ليدز B2B عالية الجودة لشركات الشحن البحري والجوي والتخليص الجمركي في السعودية والخليج.",
      "High-quality B2B leads for sea, air freight and customs clearance companies in KSA & Gulf.",
    ),
    intro: ls(
      "نولّد لشركات الشحن والتخليص ليدز B2B حقيقية من شركات لها شحنات منتظمة، عبر LinkedIn Ads، Google Search لكلمات شراء عالية النية، وصفحات هبوط متخصصة لكل خدمة (بحري/جوي/بري/تخليص).",
      "We deliver real B2B leads from shipping-active businesses via LinkedIn Ads, high-intent Google Search, and service-specific landing pages (sea, air, road, customs).",
    ),
    pains: ll(
      ["ليدز رديئة من المنصات العامة", "صعوبة الوصول لمدراء العمليات والمشتريات", "موقع B2B غير مقنع"],
      ["Low-quality leads from generic platforms", "Hard to reach ops & procurement managers", "Unconvincing B2B website"],
    ),
    solutions: ll(
      ["LinkedIn Ads مستهدفة لقطاع المستوردين", "Google Search لكلمات شراء (تخليص، شحن من الصين...)", "صفحة هبوط لكل خدمة شحن", "محتوى دراسات حالة B2B", "نظام CRM لمتابعة الفرص"],
      ["Targeted LinkedIn Ads for importers", "Google Search on buying keywords (customs, shipping from China...)", "Landing page per shipping service", "B2B case study content", "CRM for opportunity tracking"],
    ),
    outcomes: [
      { value: "+210%", label: ls("ليدز مؤهلة", "Qualified leads") },
      { value: "-45%", label: ls("تكلفة الليد", "Cost per lead") },
      { value: "15+", label: ls("عقود B2B/شهر", "B2B contracts/month") },
    ],
    faqs: [
      { q: ls("هل تخدمون كل أنواع الشحن؟", "Do you cover all shipping types?"), a: ls("نعم، بحري وجوي وبري وتخليص جمركي ومستودعات.", "Yes — sea, air, road, customs and warehousing.") },
    ],
    plans: industryPlans("انطلاقة شحن", "نمو شحن", "قائد شحن", "Freight Launch", "Freight Growth", "Freight Leader"),
    image: "https://images.unsplash.com/photo-1577416412292-747c6607f055?auto=format&fit=crop&w=1600&q=80",
  },
];

// Attach sub-services to their parent service
for (const sub of subServices) {
  const parent = services.find((s) => s.slug === sub.parentSlug);
  if (parent) {
    if (!parent.subServices) parent.subServices = [];
    parent.subServices.push(sub);
  }
}

// Attach sub-industries to their parent industry
for (const sub of subIndustries) {
  const parent = industries.find((s) => s.slug === sub.parentSlug);
  if (parent) {
    if (!parent.subIndustries) parent.subIndustries = [];
    parent.subIndustries.push(sub);
  }
}

export function findService(slug: string) {
  return services.find((s) => s.slug === slug);
}
export function findIndustry(slug: string) {
  return industries.find((s) => s.slug === slug);
}
export function findSubService(parentSlug: string, slug: string) {
  return subServices.find((s) => s.parentSlug === parentSlug && s.slug === slug);
}
export function getSubServicesFor(parentSlug: string) {
  return subServices.filter((s) => s.parentSlug === parentSlug);
}
export function findSubIndustry(parentSlug: string, slug: string) {
  return subIndustries.find((s) => s.parentSlug === parentSlug && s.slug === slug);
}
export function getSubIndustriesFor(parentSlug: string) {
  return subIndustries.filter((s) => s.parentSlug === parentSlug);
}
