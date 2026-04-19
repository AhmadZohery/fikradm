import type { ServiceMeta, IndustryMeta, PricingPlan, LocalizedString } from "./types";

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
    title: ls("السيو والنمو العضوي", "SEO & Organic Growth"),
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

export function findService(slug: string) {
  return services.find((s) => s.slug === slug);
}
export function findIndustry(slug: string) {
  return industries.find((s) => s.slug === slug);
}
