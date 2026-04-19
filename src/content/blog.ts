import type { LocalizedString, LocalizedList } from "./types";

const ls = (ar: string, en: string): LocalizedString => ({ ar, en });
const ll = (ar: string[], en: string[]): LocalizedList => ({ ar, en });

export type BlogCategory = {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
};

export type BlogPost = {
  slug: string;
  categorySlug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  keywords: LocalizedList;
  author: LocalizedString;
  publishedAt: string; // ISO date
  readingMinutes: number;
  image: string;
  tableOfContents: LocalizedList;
  body: { heading: LocalizedString; paragraphs: LocalizedList }[];
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "seo",
    name: ls("السيو والنمو العضوي", "SEO & Organic Growth"),
    description: ls(
      "أدلة عملية لتصدّر نتائج جوجل ومضاعفة الزيارات المجانية.",
      "Practical guides to dominate Google and multiply organic traffic.",
    ),
  },
  {
    slug: "performance",
    name: ls("الإعلانات وأداء التسويق", "Performance Marketing"),
    description: ls(
      "استراتيجيات إعلانات Meta وGoogle وTikTok لتحقيق ROAS عالي.",
      "Meta, Google and TikTok ad strategies for high ROAS.",
    ),
  },
  {
    slug: "ecommerce",
    name: ls("نمو المتاجر الإلكترونية", "E-commerce Growth"),
    description: ls(
      "كل ما يخص متاجر سلة وزد وشوبيفاي: تحويل، CRO، ولاء العملاء.",
      "Everything for Salla, Zid and Shopify stores: conversion, CRO, retention.",
    ),
  },
  {
    slug: "creative",
    name: ls("المحتوى والإبداع", "Content & Creative"),
    description: ls(
      "كتابة، تصميم، وفيديوهات تبيع وتبني علامة تجارية قوية.",
      "Writing, design, and video that sells and builds a strong brand.",
    ),
  },
  {
    slug: "web",
    name: ls("الويب والتقنية", "Web & Tech"),
    description: ls(
      "ووردبريس، سرعة المواقع، Core Web Vitals، وتجربة المستخدم.",
      "WordPress, site speed, Core Web Vitals and UX.",
    ),
  },
];

const post = (p: BlogPost): BlogPost => p;

export const blogPosts: BlogPost[] = [
  post({
    slug: "technical-seo-checklist-2025",
    categorySlug: "seo",
    title: ls(
      "قائمة السيو التقني الكاملة لعام 2025",
      "The Complete Technical SEO Checklist for 2025",
    ),
    excerpt: ls(
      "30 نقطة فحص تقنية تحدد ما إذا كان موقعك سيتصدّر جوجل أم سيبقى في الصفحة الثانية.",
      "30 technical checks that decide whether your site ranks or sits on page two.",
    ),
    metaTitle: ls(
      "قائمة السيو التقني 2025: 30 فحص يرفع ترتيبك | فكرة",
      "Technical SEO Checklist 2025: 30 Checks That Boost Rankings | Fikra",
    ),
    metaDescription: ls(
      "تعلم خطوة بخطوة كيف تجري مراجعة سيو تقنية احترافية في 2025: السرعة، Core Web Vitals، الفهرسة، Schema، والربط الداخلي.",
      "Step-by-step guide to a pro technical SEO audit in 2025: speed, Core Web Vitals, indexing, schema, internal links.",
    ),
    keywords: ll(
      ["سيو تقني", "core web vitals", "schema", "مراجعة سيو", "فهرسة جوجل"],
      ["technical seo", "core web vitals", "schema", "seo audit", "google indexing"],
    ),
    author: ls("فريق فكرة", "Fikra Team"),
    publishedAt: "2025-01-12",
    readingMinutes: 9,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
    tableOfContents: ll(
      ["لماذا السيو التقني هو الأساس", "Core Web Vitals بالتفصيل", "الفهرسة وملف Robots", "Schema Markup الذكي", "بنية الروابط الداخلية"],
      ["Why technical SEO is the foundation", "Core Web Vitals deep dive", "Indexing & robots.txt", "Smart schema markup", "Internal link architecture"],
    ),
    body: [
      {
        heading: ls("لماذا السيو التقني هو الأساس", "Why technical SEO is the foundation"),
        paragraphs: ll(
          [
            "قبل أن تكتب مقالاً واحداً أو تبني أي رابط، يجب أن يكون موقعك قابلاً للزحف والفهرسة بسرعة وكفاءة. السيو التقني هو البنية التحتية التي تجعل كل جهد لاحق يثمر.",
            "في 2025، أصبح Googlebot أكثر صرامة مع المواقع البطيئة أو ذات الأخطاء. مراجعة تقنية واحدة احترافية يمكن أن تضاعف زياراتك خلال 60 يوماً دون كتابة كلمة جديدة.",
          ],
          [
            "Before writing a single article or building any link, your site must be crawlable and indexable — fast and efficiently. Technical SEO is the infrastructure that makes every future effort pay off.",
            "In 2025, Googlebot is stricter than ever with slow or error-prone sites. A single professional audit can double your traffic in 60 days without writing one new word.",
          ],
        ),
      },
      {
        heading: ls("Core Web Vitals بالتفصيل", "Core Web Vitals deep dive"),
        paragraphs: ll(
          [
            "LCP يجب أن يكون أقل من 2.5 ثانية، INP أقل من 200 مللي ثانية، وCLS أقل من 0.1. هذه ليست أرقاماً عشوائية، بل عتبات تحدد ترتيبك في نتائج البحث على الموبايل.",
            "ركّز على تحسين الصور (WebP/AVIF)، وتأجيل JavaScript غير الحرج، واستخدام الـ Cache بذكاء عبر CDN قريب من جمهورك في الخليج.",
          ],
          [
            "LCP must be under 2.5s, INP under 200ms, CLS under 0.1. These aren’t arbitrary — they’re thresholds that decide your mobile ranking.",
            "Focus on image optimization (WebP/AVIF), deferring non-critical JS, and smart caching via a CDN close to your Gulf audience.",
          ],
        ),
      },
      {
        heading: ls("الفهرسة وملف Robots", "Indexing & robots.txt"),
        paragraphs: ll(
          [
            "افحص Search Console أسبوعياً وتأكد أن جميع الصفحات المهمة (Index)، وأن الصفحات الضعيفة مثل بحث داخلي أو فلاتر متاجر تحمل noindex لتوفير ميزانية الزحف.",
            "Sitemap.xml يجب أن يكون نظيفاً ومحدّثاً تلقائياً، مع تقسيمه عند تجاوز 50 ألف رابط أو 50 ميجابايت.",
          ],
          [
            "Check Search Console weekly. Important pages should be Indexed; thin pages like internal search or store filters should carry noindex to save crawl budget.",
            "Your sitemap.xml must stay clean and auto-updated, split when exceeding 50K URLs or 50MB.",
          ],
        ),
      },
      {
        heading: ls("Schema Markup الذكي", "Smart schema markup"),
        paragraphs: ll(
          [
            "أضف Schema المناسب لكل نوع صفحة: Organization، Service، Article، Product، FAQ، LocalBusiness. هذا يفتح لك Rich Snippets ويزيد CTR بنسبة تصل إلى 40%.",
          ],
          [
            "Add the right schema per page type: Organization, Service, Article, Product, FAQ, LocalBusiness. This unlocks rich snippets and lifts CTR by up to 40%.",
          ],
        ),
      },
      {
        heading: ls("بنية الروابط الداخلية", "Internal link architecture"),
        paragraphs: ll(
          [
            "بنية Hub & Spoke: صفحة محورية واحدة تربط بـ 6-12 مقالاً متخصصاً، وكل مقال يعود للصفحة المحورية. هذه البنية ترفع الـ Topical Authority بسرعة.",
          ],
          [
            "Hub & Spoke architecture: one pillar page linking to 6-12 specialist articles, each linking back to the pillar. This ramps up topical authority fast.",
          ],
        ),
      },
    ],
  }),
  post({
    slug: "local-seo-saudi-arabia",
    categorySlug: "seo",
    title: ls(
      "السيو المحلي في السعودية: دليل التصدّر في الرياض وجدة والدمام",
      "Local SEO in Saudi Arabia: Ranking in Riyadh, Jeddah & Dammam",
    ),
    excerpt: ls(
      "كيف تظهر في خرائط جوجل وفي نتائج البحث المحلية بالعربية في 3 مدن رئيسية بالخليج.",
      "How to appear in Google Maps and Arabic local search across 3 major Gulf cities.",
    ),
    metaTitle: ls(
      "السيو المحلي السعودية: دليل GBP والتصدّر محلياً | فكرة",
      "Local SEO Saudi Arabia: GBP & Local Ranking Guide | Fikra",
    ),
    metaDescription: ls(
      "حسّن ملف Google Business Profile واستهدف الكلمات المحلية بالعربية لتظهر أولاً عند بحث عملاء الرياض وجدة والدمام.",
      "Optimize your Google Business Profile and target Arabic local keywords to rank #1 in Riyadh, Jeddah and Dammam.",
    ),
    keywords: ll(
      ["سيو محلي", "google business", "تسويق الرياض", "خرائط جوجل"],
      ["local seo", "google business profile", "riyadh marketing", "google maps"],
    ),
    author: ls("فريق فكرة", "Fikra Team"),
    publishedAt: "2025-02-04",
    readingMinutes: 7,
    image: "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=1600&q=80",
    tableOfContents: ll(
      ["تحسين Google Business Profile", "بناء الاستشهادات المحلية (NAP)", "صفحات هبوط لكل مدينة", "تقييمات العملاء والردود"],
      ["Optimizing Google Business Profile", "Building local citations (NAP)", "City landing pages", "Reviews and responses"],
    ),
    body: [
      {
        heading: ls("تحسين Google Business Profile", "Optimizing Google Business Profile"),
        paragraphs: ll(
          [
            "GBP هو سلاحك الأقوى محلياً. أكمل 100% من البيانات: ساعات العمل، الفئات الفرعية، الخدمات، الصور الأسبوعية، والمنشورات.",
            "أضف صوراً حقيقية لمكان العمل، الفريق، والعملاء (بعد إذنهم). جوجل يفضّل الصور الأصلية على Stock.",
          ],
          [
            "GBP is your strongest local weapon. Complete 100%: hours, secondary categories, services, weekly photos, posts.",
            "Add genuine photos of your space, team, and customers (with consent). Google prefers originals over stock.",
          ],
        ),
      },
      {
        heading: ls("بناء الاستشهادات المحلية (NAP)", "Building local citations (NAP)"),
        paragraphs: ll(
          [
            "اسم العمل، العنوان، رقم الهاتف يجب أن يكون متطابقاً تماماً عبر دليل الأعمال السعودي، Yelp، صفحة Facebook، وغيرها.",
          ],
          [
            "Name, Address, Phone must match exactly across Saudi business directories, Yelp, Facebook page, and others.",
          ],
        ),
      },
      {
        heading: ls("صفحات هبوط لكل مدينة", "City landing pages"),
        paragraphs: ll(
          [
            "أنشئ صفحة منفصلة لكل مدينة تستهدفها مع محتوى فريد عن السوق المحلي، شهادات عملاء من تلك المدينة، وخريطة Embedded.",
          ],
          [
            "Build a unique landing page per city: local market context, testimonials from that city, and an embedded map.",
          ],
        ),
      },
      {
        heading: ls("تقييمات العملاء والردود", "Reviews and responses"),
        paragraphs: ll(
          [
            "اطلب التقييم في اللحظة الذهبية (بعد التسليم بساعات). ردّ على كل تقييم خلال 24 ساعة بنبرة مهنية ولبقة.",
          ],
          [
            "Ask for reviews at the golden moment (hours after delivery). Reply to every review within 24h, professionally.",
          ],
        ),
      },
    ],
  }),
  post({
    slug: "meta-ads-roas-playbook",
    categorySlug: "performance",
    title: ls(
      "كيف تحقق ROAS 5x من إعلانات Meta في 2025",
      "How to Hit 5x ROAS on Meta Ads in 2025",
    ),
    excerpt: ls(
      "هيكل حملات Advantage+، الجمهور الذكي، والإبداع الذي يكسر السكرول ويحوّل.",
      "Advantage+ campaign structure, smart audiences, and creative that stops the scroll and converts.",
    ),
    metaTitle: ls(
      "إعلانات Meta 2025: استراتيجية ROAS 5x | فكرة",
      "Meta Ads 2025: 5x ROAS Strategy | Fikra",
    ),
    metaDescription: ls(
      "هيكل CBO، Advantage+ Shopping، تتبع CAPI، وأفكار إبداعية مجربة تجعل إعلاناتك تربح.",
      "CBO structure, Advantage+ Shopping, CAPI tracking, and proven creative ideas that win.",
    ),
    keywords: ll(
      ["إعلانات meta", "facebook ads", "instagram ads", "roas"],
      ["meta ads", "facebook ads", "instagram ads", "roas"],
    ),
    author: ls("فريق فكرة", "Fikra Team"),
    publishedAt: "2025-02-20",
    readingMinutes: 8,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1600&q=80",
    tableOfContents: ll(
      ["هيكل الحملات الذكي", "Advantage+ Shopping", "تتبع CAPI الموثوق", "إبداع يكسر السكرول"],
      ["Smart campaign structure", "Advantage+ Shopping", "Reliable CAPI tracking", "Scroll-stopping creative"],
    ),
    body: [
      {
        heading: ls("هيكل الحملات الذكي", "Smart campaign structure"),
        paragraphs: ll(
          [
            "ابدأ بـ 3 حملات: Prospecting (Advantage+)، Retargeting، Existing Customers. لا تعقّد الهيكل قبل أن تصل لميزانية 5,000$ شهرياً.",
          ],
          [
            "Start with 3 campaigns: Prospecting (Advantage+), Retargeting, Existing Customers. Don’t over-engineer before $5K/mo spend.",
          ],
        ),
      },
      {
        heading: ls("Advantage+ Shopping", "Advantage+ Shopping"),
        paragraphs: ll(
          [
            "ASC تستخدم AI ميتا لتحقيق نتائج ممتازة بأقل تدخل. ارفع 6 إعلانات متنوعة (فيديو، صورة، كاروسيل) ودع الخوارزمية تختار.",
          ],
          [
            "ASC uses Meta’s AI for excellent results with minimal touch. Upload 6 varied ads (video, image, carousel) and let the algorithm pick winners.",
          ],
        ),
      },
      {
        heading: ls("تتبع CAPI الموثوق", "Reliable CAPI tracking"),
        paragraphs: ll(
          [
            "بعد iOS 14، Pixel وحده لا يكفي. فعّل Conversions API عبر Server-Side Tagging لاستعادة 30-40% من البيانات المفقودة.",
          ],
          [
            "Post iOS 14, Pixel alone isn’t enough. Enable Conversions API via server-side tagging to recover 30-40% of lost data.",
          ],
        ),
      },
      {
        heading: ls("إبداع يكسر السكرول", "Scroll-stopping creative"),
        paragraphs: ll(
          [
            "أول 3 ثواني تحدد كل شيء. ابدأ بهوك بصري قوي + سؤال يلامس مشكلة العميل. الفيديو العمودي UGC يتفوّق على الإنتاج المصقول في 80% من الحالات.",
          ],
          [
            "The first 3 seconds decide everything. Open with a strong visual hook + a pain-point question. Vertical UGC video beats polished production 80% of the time.",
          ],
        ),
      },
    ],
  }),
  post({
    slug: "salla-store-cro-guide",
    categorySlug: "ecommerce",
    title: ls(
      "10 تحسينات CRO ترفع مبيعات متجر سلة 30%",
      "10 CRO Tweaks That Lift Salla Store Sales by 30%",
    ),
    excerpt: ls(
      "تجربة دفع، صفحات منتج، ثقة، وتسعير ذكي — تحسينات بسيطة بأثر ضخم.",
      "Checkout, product pages, trust, smart pricing — small tweaks, huge impact.",
    ),
    metaTitle: ls(
      "CRO متجر سلة: 10 تحسينات ترفع المبيعات | فكرة",
      "Salla Store CRO: 10 Tweaks to Boost Sales | Fikra",
    ),
    metaDescription: ls(
      "دليل CRO عملي لمتاجر سلة وزد: تحسين سلة الشراء، صفحات المنتج، عناصر الثقة، وأسعار الشحن.",
      "A practical CRO guide for Salla and Zid stores: cart, product pages, trust elements, shipping pricing.",
    ),
    keywords: ll(
      ["متجر سلة", "cro", "تحسين تحويل", "تجارة إلكترونية"],
      ["salla store", "cro", "conversion optimization", "ecommerce"],
    ),
    author: ls("فريق فكرة", "Fikra Team"),
    publishedAt: "2025-03-08",
    readingMinutes: 6,
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1600&q=80",
    tableOfContents: ll(
      ["صفحة المنتج المثالية", "تجربة دفع بدون احتكاك", "عناصر ثقة عربية", "استراتيجية الشحن"],
      ["The ideal product page", "Frictionless checkout", "Arabic trust elements", "Shipping strategy"],
    ),
    body: [
      {
        heading: ls("صفحة المنتج المثالية", "The ideal product page"),
        paragraphs: ll(
          [
            "صورة رئيسية واضحة + 5 صور إضافية + فيديو 15 ثانية. عنوان قصير، فوائد قبل المواصفات، وسعر واضح بدون مفاجآت.",
          ],
          [
            "One clear hero image + 5 supporting images + a 15s video. Short title, benefits before specs, transparent pricing.",
          ],
        ),
      },
      {
        heading: ls("تجربة دفع بدون احتكاك", "Frictionless checkout"),
        paragraphs: ll(
          [
            "فعّل Apple Pay وMada وSTC Pay. تخلّص من الحقول غير الضرورية. اعرض ملخص الطلب على اليمين دائماً.",
          ],
          [
            "Enable Apple Pay, Mada, and STC Pay. Drop unnecessary fields. Always show the order summary on the side.",
          ],
        ),
      },
      {
        heading: ls("عناصر ثقة عربية", "Arabic trust elements"),
        paragraphs: ll(
          [
            "شارة معروف، تقييمات عربية حقيقية، سياسة إرجاع واضحة، ورقم واتساب للتواصل الفوري — هذه القائمة ترفع التحويل بشكل ملحوظ.",
          ],
          [
            "Maroof badge, genuine Arabic reviews, clear return policy, and a WhatsApp number for instant chat — this combo lifts conversion noticeably.",
          ],
        ),
      },
      {
        heading: ls("استراتيجية الشحن", "Shipping strategy"),
        paragraphs: ll(
          [
            "الشحن المجاني فوق عتبة معينة هو السلاح الأقوى لرفع AOV. استخدم Shipping Bar في الـ Header.",
          ],
          [
            "Free shipping above a threshold is your strongest AOV lever. Use a shipping bar in the header.",
          ],
        ),
      },
    ],
  }),
  post({
    slug: "ugc-video-content-strategy",
    categorySlug: "creative",
    title: ls(
      "استراتيجية محتوى UGC للعلامات التجارية في الخليج",
      "UGC Video Content Strategy for Gulf Brands",
    ),
    excerpt: ls(
      "كيف تبني مكتبة فيديوهات UGC تتفوّق على الإنتاج الفاخر بنصف التكلفة.",
      "Build a UGC video library that beats premium production at half the cost.",
    ),
    metaTitle: ls(
      "محتوى UGC للعلامات الخليجية: دليل شامل | فكرة",
      "UGC Content for Gulf Brands: Complete Guide | Fikra",
    ),
    metaDescription: ls(
      "تعلّم كيف تختار صنّاع المحتوى، تبني الـ Brief، وتدير حقوق الاستخدام لمكتبة UGC تربح.",
      "Learn how to pick creators, write briefs, and manage usage rights for a winning UGC library.",
    ),
    keywords: ll(
      ["ugc", "محتوى المستخدمين", "تيك توك", "ريلز انستجرام"],
      ["ugc", "user generated content", "tiktok", "instagram reels"],
    ),
    author: ls("فريق فكرة", "Fikra Team"),
    publishedAt: "2025-03-22",
    readingMinutes: 7,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80",
    tableOfContents: ll(
      ["لماذا UGC يتفوّق الآن", "اختيار صنّاع المحتوى", "كتابة Brief فعّال", "إدارة الحقوق والاستخدام"],
      ["Why UGC wins now", "Picking creators", "Writing an effective brief", "Managing rights and usage"],
    ),
    body: [
      {
        heading: ls("لماذا UGC يتفوّق الآن", "Why UGC wins now"),
        paragraphs: ll(
          [
            "المستخدمون يثقون بالأشخاص الحقيقيين أكثر من الإعلانات المصقولة. UGC يبدو طبيعياً في الـ Feed ويحقق CTR أعلى بـ 4x مقارنة بالإنتاج التقليدي.",
          ],
          [
            "Users trust real people more than polished ads. UGC blends into the feed and achieves 4x higher CTR than traditional production.",
          ],
        ),
      },
      {
        heading: ls("اختيار صنّاع المحتوى", "Picking creators"),
        paragraphs: ll(
          [
            "ابحث عن نانو-إنفلونسرز (5K-50K متابع) باللهجة الخليجية. الأهم: جودة المحتوى وليس عدد المتابعين.",
          ],
          [
            "Look for nano-influencers (5K-50K followers) speaking the Gulf dialect. Quality > follower count.",
          ],
        ),
      },
      {
        heading: ls("كتابة Brief فعّال", "Writing an effective brief"),
        paragraphs: ll(
          [
            "Brief واضح: الهوك، المشكلة، المنتج كحل، CTA. اترك حرية للمبدع في التنفيذ.",
          ],
          [
            "Clear brief: hook, problem, product as solution, CTA. Leave execution freedom to the creator.",
          ],
        ),
      },
      {
        heading: ls("إدارة الحقوق والاستخدام", "Managing rights and usage"),
        paragraphs: ll(
          [
            "عقد رقمي يحدد مدة الاستخدام (12 شهر)، المنصات (Meta + TikTok)، وحقوق الإعلانات المدفوعة.",
          ],
          [
            "Digital contract specifying usage period (12 months), platforms (Meta + TikTok), and paid ads rights.",
          ],
        ),
      },
    ],
  }),
  post({
    slug: "wordpress-speed-core-web-vitals",
    categorySlug: "web",
    title: ls(
      "تسريع ووردبريس وتحسين Core Web Vitals خطوة بخطوة",
      "Speed Up WordPress and Pass Core Web Vitals Step by Step",
    ),
    excerpt: ls(
      "من 6 ثواني إلى أقل من 2 ثانية: دليل تقني عملي لتسريع موقع ووردبريس بالكامل.",
      "From 6s to under 2s: a hands-on guide to fully speed up your WordPress site.",
    ),
    metaTitle: ls(
      "تسريع ووردبريس 2025: دليل Core Web Vitals | فكرة",
      "WordPress Speed 2025: Core Web Vitals Guide | Fikra",
    ),
    metaDescription: ls(
      "هاستينج، Caching، CDN، صور WebP، وتحسين قاعدة البيانات — كل ما تحتاج لتسريع ووردبريس.",
      "Hosting, caching, CDN, WebP images, and database optimization — everything you need to speed up WordPress.",
    ),
    keywords: ll(
      ["تسريع ووردبريس", "core web vitals", "lcp", "cdn"],
      ["wordpress speed", "core web vitals", "lcp", "cdn"],
    ),
    author: ls("فريق فكرة", "Fikra Team"),
    publishedAt: "2025-04-02",
    readingMinutes: 8,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    tableOfContents: ll(
      ["اختيار الاستضافة الصحيحة", "Caching متعدد الطبقات", "تحسين الصور والخطوط", "تنظيف قاعدة البيانات"],
      ["Choosing the right hosting", "Multi-layer caching", "Image and font optimization", "Database cleanup"],
    ),
    body: [
      {
        heading: ls("اختيار الاستضافة الصحيحة", "Choosing the right hosting"),
        paragraphs: ll(
          [
            "Managed WordPress hosting (Kinsta، Pressable) يفرق ثواني. السيرفر بقرب جمهورك في الخليج (دبي/فرانكفورت) يخفض TTFB بنسبة 40%.",
          ],
          [
            "Managed WordPress hosting (Kinsta, Pressable) makes a seconds-level difference. A server near your Gulf audience cuts TTFB by 40%.",
          ],
        ),
      },
      {
        heading: ls("Caching متعدد الطبقات", "Multi-layer caching"),
        paragraphs: ll(
          [
            "Object Cache (Redis) + Page Cache (WP Rocket) + CDN Cache (Cloudflare). كل طبقة تحل مشكلة مختلفة.",
          ],
          [
            "Object Cache (Redis) + Page Cache (WP Rocket) + CDN Cache (Cloudflare). Each layer solves a different problem.",
          ],
        ),
      },
      {
        heading: ls("تحسين الصور والخطوط", "Image and font optimization"),
        paragraphs: ll(
          [
            "حوّل كل الصور إلى WebP/AVIF. حمّل الخطوط محلياً مع font-display: swap لمنع CLS.",
          ],
          [
            "Convert all images to WebP/AVIF. Self-host fonts with font-display: swap to prevent CLS.",
          ],
        ),
      },
      {
        heading: ls("تنظيف قاعدة البيانات", "Database cleanup"),
        paragraphs: ll(
          [
            "احذف post revisions القديمة، transients المنتهية، والتعليقات المزعجة شهرياً. قاعدة بيانات نظيفة = استعلامات أسرع.",
          ],
          [
            "Delete old post revisions, expired transients, and spam monthly. A clean database = faster queries.",
          ],
        ),
      },
    ],
  }),
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export function getPostsByCategory(slug: string): BlogPost[] {
  return blogPosts.filter((p) => p.categorySlug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const sameCat = blogPosts.filter((p) => p.slug !== slug && p.categorySlug === current.categorySlug);
  const others = blogPosts.filter((p) => p.slug !== slug && p.categorySlug !== current.categorySlug);
  return [...sameCat, ...others].slice(0, limit);
}

export function getAllPostsSorted(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
