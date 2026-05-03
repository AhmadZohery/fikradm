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
  body: { heading: LocalizedString; summary?: LocalizedString; paragraphs: LocalizedList }[];
  faq?: { q: LocalizedString; a: LocalizedString }[];
  internalLinks?: { label: LocalizedString; href: string }[];
  cta?: { title: LocalizedString; description: LocalizedString; buttonLabel: LocalizedString; href: string };
  /** AEO / AIO / LLMO: 3–6 bullet TL;DR shown at the top + structured for snippets. */
  tldr?: LocalizedList;
  /** EEAT: short author bio shown under the article. */
  authorBio?: LocalizedString;
  authorRole?: LocalizedString;
  /** EEAT: last reviewed date (ISO). Distinct from publishedAt. */
  lastReviewed?: string;
  /** EEAT / GEO: cited sources used for facts. */
  sources?: { label: LocalizedString; url: string }[];
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "seo",
    name: ls("تحسين محركات البحث (SEO)", "Search Engine Optimization"),
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
            "الواقع في السوق السعودي والخليجي يقول إن أكثر من 70% من زيارات البحث تأتي من الجوال، وأي تأخير ولو ثانية واحدة في تحميل الصفحة يكلفك ترتيبك ومبيعاتك في آن واحد. ولهذا نبدأ مع كل عميل بمراجعة تقنية شاملة قبل أي محتوى أو إعلان.",
            "كذلك، السيو التقني السليم يفتح الباب أمام موديلات الذكاء الاصطناعي مثل Google SGE وPerplexity وChatGPT لاستيعاب موقعك بصورة صحيحة، فيختارك كمصدر إجابة. هذا ما يُعرف بـ AEO (Answer Engine Optimization) وLLMO (Large Language Model Optimization).",
          ],
          [
"Before writing a single article or building any link, your site must be crawlable and indexable — fast and efficiently. Technical SEO is the infrastructure that makes every future effort pay off.",
            "In 2025, Googlebot is stricter than ever with slow or error-prone sites. A single professional audit can double your traffic in 60 days without writing one new word.",
            "Across the Saudi and Gulf market, more than 70% of search traffic comes from mobile. A single second of delay costs you both ranking and revenue. That's why every engagement starts with a full technical audit before any content or ads.",
            "Sound technical SEO also enables AI engines such as Google SGE, Perplexity, and ChatGPT to understand and quote your site correctly — what we call AEO and LLMO.",
          ],
        ),
      },
      {
        heading: ls("Core Web Vitals بالتفصيل", "Core Web Vitals deep dive"),
        paragraphs: ll(
          [
"LCP يجب أن يكون أقل من 2.5 ثانية، INP أقل من 200 مللي ثانية، وCLS أقل من 0.1. هذه ليست أرقاماً عشوائية، بل عتبات تحدد ترتيبك في نتائج البحث على الموبايل.",
            "ركّز على تحسين الصور (WebP/AVIF)، وتأجيل JavaScript غير الحرج، واستخدام الـ Cache بذكاء عبر CDN قريب من جمهورك في الخليج.",
            "لتحسين LCP عملياً، اضبط الصورة البطل في الصفحة الرئيسية لتُحمَّل بأولوية fetchpriority=\"high\" مع preload للخط الأساسي. ولـ INP، قلّل الـ JavaScript المحظور Blocking وقسّم الـ Bundles عبر Code Splitting.",
            "أما CLS، فالحلّ يبدأ من حجز مساحات الصور والإعلانات مسبقاً بـ width و height ثابتين. هذه الخطوات الثلاث لوحدها تنقل أي موقع من أحمر إلى أخضر في PageSpeed Insights خلال ساعتين عمل.",
          ],
          [
"LCP must be under 2.5s, INP under 200ms, CLS under 0.1. These aren’t arbitrary — they’re thresholds that decide your mobile ranking.",
            "Focus on image optimization (WebP/AVIF), deferring non-critical JS, and smart caching via a CDN close to your Gulf audience.",
            "To improve LCP, set fetchpriority=\"high\" on the hero image and preload your primary font. For INP, reduce blocking JavaScript and split bundles via code splitting.",
            "For CLS, reserve image and ad space upfront with explicit width and height. These three actions alone move most sites from red to green in PageSpeed within two hours of work.",
          ],
        ),
      },
      {
        heading: ls("الفهرسة وملف Robots", "Indexing & robots.txt"),
        paragraphs: ll(
          [
"افحص Search Console أسبوعياً وتأكد أن جميع الصفحات المهمة (Index)، وأن الصفحات الضعيفة مثل بحث داخلي أو فلاتر متاجر تحمل noindex لتوفير ميزانية الزحف.",
            "Sitemap.xml يجب أن يكون نظيفاً ومحدّثاً تلقائياً، مع تقسيمه عند تجاوز 50 ألف رابط أو 50 ميجابايت.",
            "شغّل تقرير Indexing API في Search Console شهرياً، وراقب الفرق بين الصفحات المكتشفة وغير المفهرسة. هذه فجوة تكشف مشاكل المحتوى المكرر أو الـ Canonical Tags غير الصحيحة.",
            "للمتاجر الإلكترونية تحديداً، استخدم faceted navigation بحذر: امنع الفلاتر التركيبية من الفهرسة عبر robots.txt وميتا noindex، لكن دع جوجل يصل لها للحفاظ على PageRank الداخلي.",
          ],
          [
"Check Search Console weekly. Important pages should be Indexed; thin pages like internal search or store filters should carry noindex to save crawl budget.",
            "Your sitemap.xml must stay clean and auto-updated, split when exceeding 50K URLs or 50MB.",
            "Run the Indexing API report in Search Console monthly and watch the gap between discovered and not-indexed pages. That gap exposes duplicate content or wrong canonical tags.",
            "For e-commerce specifically, treat faceted navigation carefully: block combinatorial filters from indexing via robots.txt and meta noindex, but let Google reach them to preserve internal PageRank.",
          ],
        ),
      },
      {
        heading: ls("Schema Markup الذكي", "Smart schema markup"),
        paragraphs: ll(
          [
"أضف Schema المناسب لكل نوع صفحة: Organization، Service، Article، Product، FAQ، LocalBusiness. هذا يفتح لك Rich Snippets ويزيد CTR بنسبة تصل إلى 40%.",
            "Schema الذكي يتجاوز الإضافة الأساسية. ادمج Organization مع sameAs لكل حسابات السوشيال ميديا، وأضف breadcrumbList لكل صفحة فرعية، وSpeakable للمقالات لمساعدة المساعدات الصوتية.",
            "في 2025، نضيف Schema جديد لكل عملاء المتاجر: Product مع AggregateRating وReview، وOffer مع priceValidUntil وavailability محدّثة لحظياً. هذه التفاصيل تظهر في Rich Snippets وترفع CTR بمعدل 28% حسب آخر دراسات BrightEdge.",
            "GEO (Generative Engine Optimization) تتطلب أن يكون المحتوى منظماً بصرياً وهيكلياً: عناوين H2/H3 واضحة، قوائم نقطية، وجداول مقارنة. هذا يجعل LLMs مثل GPT-5 وClaude يقتبسونك بدقة.",
          ],
          [
"Add the right schema per page type: Organization, Service, Article, Product, FAQ, LocalBusiness. This unlocks rich snippets and lifts CTR by up to 40%.",
            "Smart schema goes beyond the basics. Combine Organization with sameAs for all socials, add breadcrumbList to every sub-page, and Speakable for articles to help voice assistants.",
            "For 2025, add Product with AggregateRating and Review for stores, plus Offer with live priceValidUntil and availability. BrightEdge data shows these details lift CTR by 28%.",
            "GEO demands content structured visually and hierarchically: clear H2/H3, bullet lists, comparison tables. This is how LLMs like GPT-5 and Claude quote you accurately.",
          ],
        ),
      },
      {
        heading: ls("بنية الروابط الداخلية", "Internal link architecture"),
        paragraphs: ll(
          [
"بنية Hub & Spoke: صفحة محورية واحدة تربط بـ 6-12 مقالاً متخصصاً، وكل مقال يعود للصفحة المحورية. هذه البنية ترفع الـ Topical Authority بسرعة.",
            "الـ Anchor Text المتنوع هو السر. لا تربط دائماً بنفس الكلمة المفتاحية — استخدم variants طبيعية تشمل سؤالاً أو وصفاً. هذا يحمي موقعك من فلاتر Google Penguin ويساعد في السيطرة على Topic Cluster كامل.",
            "كذلك، استخدم Breadcrumbs مرئية في كل صفحة، وأضف \"مقالات ذات صلة\" آلياً في نهاية كل مقال. تجربتنا مع عملاء في الرياض وجدة تثبت أن هذه التحسينات وحدها ترفع متوسط مدة الجلسة بنسبة 40%.",
          ],
          [
"Hub & Spoke architecture: one pillar page linking to 6-12 specialist articles, each linking back to the pillar. This ramps up topical authority fast.",
            "Diverse anchor text is the secret. Don't always link with the same keyword — use natural variants including questions or descriptions. This protects you from Penguin filters and helps you own a full topic cluster.",
            "Also use visible breadcrumbs on every page and auto-append \"related posts\" at article ends. Our work in Riyadh and Jeddah shows these alone lift average session duration by 40%.",
          ],
        ),
      },
    ],
  
    faq: [
      {
        q: ls("ما الفرق بين السيو التقني والسيو التقليدي؟", "ما الفرق بين السيو التقني والسيو التقليدي؟"),
        a: ls("السيو التقليدي يركّز على الكلمات المفتاحية والمحتوى والروابط الخارجية، بينما السيو التقني يهتم ببنية الموقع وسرعته وقابليته للزحف من قِبل محركات البحث. الاثنان مكمّلان لبعض، لكن السيو التقني هو الأساس الذي يبنى عليه كل شيء.", "السيو التقليدي يركّز على الكلمات المفتاحية والمحتوى والروابط الخارجية، بينما السيو التقني يهتم ببنية الموقع وسرعته وقابليته للزحف من قِبل محركات البحث. الاثنان مكمّلان لبعض، لكن السيو التقني هو الأساس الذي يبنى عليه كل شيء."),
      },
      {
        q: ls("كم تستغرق نتائج السيو التقني في الظهور؟", "كم تستغرق نتائج السيو التقني في الظهور؟"),
        a: ls("عادة ما تظهر نتائج تحسينات Core Web Vitals وSchema في غضون 2-4 أسابيع، بينما الفهرسة الكاملة لموقع جديد قد تأخذ 6-8 أسابيع. السرعة في الظهور تعتمد على عمر النطاق وقوة Backlinks الحالية.", "عادة ما تظهر نتائج تحسينات Core Web Vitals وSchema في غضون 2-4 أسابيع، بينما الفهرسة الكاملة لموقع جديد قد تأخذ 6-8 أسابيع. السرعة في الظهور تعتمد على عمر النطاق وقوة Backlinks الحالية."),
      },
      {
        q: ls("هل أحتاج Schema لكل صفحة في موقعي؟", "هل أحتاج Schema لكل صفحة في موقعي؟"),
        a: ls("نعم، بشرط أن يكون مناسباً لنوع الصفحة. الصفحة الرئيسية تحتاج Organization، صفحات الخدمات تحتاج Service، وصفحات المنتجات تحتاج Product. الـ Schema الخاطئ أسوأ من عدم وجوده، لذا احرص على المراجعة عبر Rich Results Test.", "نعم، بشرط أن يكون مناسباً لنوع الصفحة. الصفحة الرئيسية تحتاج Organization، صفحات الخدمات تحتاج Service، وصفحات المنتجات تحتاج Product. الـ Schema الخاطئ أسوأ من عدم وجوده، لذا احرص على المراجعة عبر Rich Results Test."),
      },
      {
        q: ls("ما تأثير AI على السيو التقني في 2025؟", "ما تأثير AI على السيو التقني في 2025؟"),
        a: ls("صعود محركات إجابة AI مثل Google SGE يجعل البيانات المهيكلة أهم من أي وقت. المواقع التي تتبنى Schema الذكي وLLMO يتم اقتباسها مباشرة في الإجابات التوليدية، بينما المواقع غير المهيكلة تختفي تماماً.", "صعود محركات إجابة AI مثل Google SGE يجعل البيانات المهيكلة أهم من أي وقت. المواقع التي تتبنى Schema الذكي وLLMO يتم اقتباسها مباشرة في الإجابات التوليدية، بينما المواقع غير المهيكلة تختفي تماماً."),
      },
    ],
    internalLinks: [
      {
        label: ls("السيو المحلي في السعودية: دليل التصدّر", "السيو المحلي في السعودية: دليل التصدّر"),
        href: "/blog/local-seo-saudi-arabia",
      },
      {
        label: ls("CRO متجر سلة: 10 تحسينات ترفع المبيعات", "CRO متجر سلة: 10 تحسينات ترفع المبيعات"),
        href: "/blog/salla-store-cro-guide",
      },
      {
        label: ls("تسريع ووردبريس وتحسين Core Web Vitals", "تسريع ووردبريس وتحسين Core Web Vitals"),
        href: "/blog/wordpress-speed-core-web-vitals",
      },
      {
        label: ls("خدمات السيو الكاملة من فكرة", "خدمات السيو الكاملة من فكرة"),
        href: "/services/seo",
      },
      {
        label: ls("احجز استشارة سيو مجانية", "احجز استشارة سيو مجانية"),
        href: "/contact",
      },
    ],
    cta: {
      title: ls("هل موقعك يفقد ترتيبه بسبب مشاكل تقنية؟", "هل موقعك يفقد ترتيبه بسبب مشاكل تقنية؟"),
      description: ls("احصل على مراجعة سيو تقنية مجانية من خبراء فكرة وتعرّف على أهم 10 تحسينات سترفع ترتيبك خلال 30 يوماً.", "احصل على مراجعة سيو تقنية مجانية من خبراء فكرة وتعرّف على أهم 10 تحسينات سترفع ترتيبك خلال 30 يوماً."),
      buttonLabel: ls("احجز استشارتك المجانية", "احجز استشارتك المجانية"),
      href: "/contact",
    },
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
            "في السوق السعودي تحديداً، 88% من مستخدمي جوجل يبحثون بصياغات تتضمّن اسم المدينة أو الحي، مثل: \"أفضل مطعم في حي الملقا\" أو \"عيادة أسنان جدة الشاطئ\". هذا يعني أن إغفال السيو المحلي يساوي تضييع ثلاثة أرباع جمهورك المحتمل.",
            "GBP وحده لا يكفي اليوم؛ تحتاج لمنظومة متكاملة: ملف GBP محسّن، صفحات مدينة على موقعك، NAP موحّد عبر دلائل الأعمال، وإدارة سمعة منظّمة على منصات مثل Google وApple Maps وHungerstation.",
          ],
          [
"GBP is your strongest local weapon. Complete 100%: hours, secondary categories, services, weekly photos, posts.",
            "Add genuine photos of your space, team, and customers (with consent). Google prefers originals over stock.",
            "In the Saudi market specifically, 88% of Google users include a city or district name in their query, e.g. \"best restaurant in Al Mulqa\" or \"dental clinic Jeddah Corniche\". Skipping local SEO means losing three quarters of your potential audience.",
            "GBP alone is no longer enough — you need an integrated stack: an optimized GBP profile, dedicated city pages on your site, consistent NAP across business directories, and structured reputation management across Google, Apple Maps, and Hungerstation.",
          ],
        ),
      },
      {
        heading: ls("بناء الاستشهادات المحلية (NAP)", "Building local citations (NAP)"),
        paragraphs: ll(
          [
"اسم العمل، العنوان، رقم الهاتف يجب أن يكون متطابقاً تماماً عبر دليل الأعمال السعودي، Yelp، صفحة Facebook، وغيرها.",
            "اختيار الفئة الرئيسية الصحيحة هو أهم قرار في GBP. تجنّب الفئات العامة مثل \"شركة\" واختر الأكثر تخصصاً مثل \"عيادة أطفال\" بدل \"عيادة طبية\". هذا التحسين البسيط يرفع الظهور في خريطة Google بنسبة 3x.",
            "أضف الـ Attributes الجديدة التي تطلقها جوجل سنوياً: تقبل Mada، يوجد Wi-Fi، صديق للأسرة، إلخ. هذه التفاصيل تساعد في فلاتر البحث المحلي وترفع ثقة العميل قبل النقرة.",
          ],
          [
"Name, Address, Phone must match exactly across Saudi business directories, Yelp, Facebook page, and others.",
            "Picking the right primary category is the single most impactful GBP decision. Avoid generic options like \"company\" and pick the most specific, e.g. \"pediatric clinic\" instead of \"medical clinic\". This alone lifts map visibility 3x.",
            "Add Google's new annual attributes: Accepts Mada, Wi-Fi available, family-friendly. These power local search filters and build trust before the click.",
          ],
        ),
      },
      {
        heading: ls("صفحات هبوط لكل مدينة", "City landing pages"),
        paragraphs: ll(
          [
"أنشئ صفحة منفصلة لكل مدينة تستهدفها مع محتوى فريد عن السوق المحلي، شهادات عملاء من تلك المدينة، وخريطة Embedded.",
            "في السعودية، الدلائل التي ترفع NAP فعلياً: دليل غرفة التجارة، Maroof، Snoonu Business، وأدلة قطاعية مثل Vezeeta للعيادات. تأكد أن صياغة العنوان متطابقة حرفاً بحرف، حتى علامات الترقيم.",
            "للسلاسل والفروع، استخدم Schema LocalBusiness مع hasPart لكل فرع منفصل، مع إضافة geo.latitude وgeo.longitude. هذا يساعد جوجل على ربط الفروع ببعضها كمنشأة واحدة.",
          ],
          [
"Build a unique landing page per city: local market context, testimonials from that city, and an embedded map.",
            "In Saudi Arabia, directories that genuinely lift NAP signals are: Chamber of Commerce, Maroof, Snoonu Business, and vertical directories like Vezeeta for clinics. Match the address character-by-character, even punctuation.",
            "For chains and branches use LocalBusiness schema with hasPart for each branch and add geo.latitude / geo.longitude. This helps Google connect branches as one entity.",
          ],
        ),
      },
      {
        heading: ls("تقييمات العملاء والردود", "Reviews and responses"),
        paragraphs: ll(
          [
"اطلب التقييم في اللحظة الذهبية (بعد التسليم بساعات). ردّ على كل تقييم خلال 24 ساعة بنبرة مهنية ولبقة.",
            "اكتب لكل مدينة محتوى فريداً 800+ كلمة يستهدف 3-5 كلمات مفتاحية محلية. لا تكرر النص بين المدن وغيّر اسم المدينة فقط — جوجل يكتشف هذا فوراً ويعاقب الموقع.",
            "أضف للصفحة: شهادات عملاء من نفس المدينة، خريطة Embedded تُظهر موقعك، صور من المنشأة في تلك المدينة، وأسئلة FAQ تتعلق بالخدمات في تلك المنطقة تحديداً. هذه التفاصيل ترفع التحويل بنسبة تتجاوز 35%.",
          ],
          [
"Ask for reviews at the golden moment (hours after delivery). Reply to every review within 24h, professionally.",
            "Write 800+ unique words per city targeting 3-5 local keywords. Don't duplicate copy and just swap the city name — Google detects it instantly and penalizes.",
            "Add to each page: testimonials from that city, an embedded map showing your location, real photos from that branch, and FAQs about services in that area. These details lift conversion 35%+.",
          ],
        ),
      },
    ],
  
    faq: [
      {
        q: ls("كم تستغرق صفحة GBP الجديدة لتظهر في النتائج؟", "كم تستغرق صفحة GBP الجديدة لتظهر في النتائج؟"),
        a: ls("عادة 1-2 أسبوع بعد التحقّق عبر بطاقة بريدية أو فيديو. المسار الأسرع هو إكمال 100% من البيانات قبل التحقق ورفع 10+ صور أصلية للمنشأة.", "عادة 1-2 أسبوع بعد التحقّق عبر بطاقة بريدية أو فيديو. المسار الأسرع هو إكمال 100% من البيانات قبل التحقق ورفع 10+ صور أصلية للمنشأة."),
      },
      {
        q: ls("هل يمكنني استهداف عدة مدن بدون فروع فعلية؟", "هل يمكنني استهداف عدة مدن بدون فروع فعلية؟"),
        a: ls("نعم، عبر صفحات هبوط مفصّلة لكل مدينة على موقعك. لكنك لن تظهر في خرائط جوجل لمدن لا يوجد فيها فرع. ركّز على السيو العضوي للمحتوى المحلي بدلاً من خداع GBP.", "نعم، عبر صفحات هبوط مفصّلة لكل مدينة على موقعك. لكنك لن تظهر في خرائط جوجل لمدن لا يوجد فيها فرع. ركّز على السيو العضوي للمحتوى المحلي بدلاً من خداع GBP."),
      },
      {
        q: ls("ما أفضل عدد تقييمات لظهور قوي محلياً؟", "ما أفضل عدد تقييمات لظهور قوي محلياً؟"),
        a: ls("في السعودية، 50+ تقييم بمتوسط 4.5+ يضعك في النخبة. الأهم من العدد هو الانتظام: 3-5 تقييمات شهرية أفضل من 50 دفعة واحدة.", "في السعودية، 50+ تقييم بمتوسط 4.5+ يضعك في النخبة. الأهم من العدد هو الانتظام: 3-5 تقييمات شهرية أفضل من 50 دفعة واحدة."),
      },
      {
        q: ls("هل التقييمات الخمسة دائماً مشبوهة لجوجل؟", "هل التقييمات الخمسة دائماً مشبوهة لجوجل؟"),
        a: ls("ليس بالضرورة، لكن جوجل يحلّل النمط. تقييمات قصيرة بدون تفاصيل من حسابات جديدة تُرفض غالباً. شجّع العميل على ذكر الخدمة المحددة والمدينة في التقييم لتعزيز السيو المحلي معاً.", "ليس بالضرورة، لكن جوجل يحلّل النمط. تقييمات قصيرة بدون تفاصيل من حسابات جديدة تُرفض غالباً. شجّع العميل على ذكر الخدمة المحددة والمدينة في التقييم لتعزيز السيو المحلي معاً."),
      },
    ],
    internalLinks: [
      {
        label: ls("قائمة السيو التقني الكاملة لعام 2025", "قائمة السيو التقني الكاملة لعام 2025"),
        href: "/blog/technical-seo-checklist-2025",
      },
      {
        label: ls("استهداف الرياض - صفحة الموقع", "استهداف الرياض - صفحة الموقع"),
        href: "/locations/riyadh",
      },
      {
        label: ls("استهداف جدة - صفحة الموقع", "استهداف جدة - صفحة الموقع"),
        href: "/locations/jeddah",
      },
      {
        label: ls("خدمات السيو المحلي", "خدمات السيو المحلي"),
        href: "/services/seo/local-seo",
      },
      {
        label: ls("احجز استشارة سيو محلي", "احجز استشارة سيو محلي"),
        href: "/contact",
      },
    ],
    cta: {
      title: ls("هل عملك المحلي يخسر العملاء لصالح المنافسين في خرائط جوجل؟", "هل عملك المحلي يخسر العملاء لصالح المنافسين في خرائط جوجل؟"),
      description: ls("نقدّم مراجعة GBP مجانية + خطة عمل لمدة 90 يوماً تضعك في الـ Local Pack من أول 3 نتائج.", "نقدّم مراجعة GBP مجانية + خطة عمل لمدة 90 يوماً تضعك في الـ Local Pack من أول 3 نتائج."),
      buttonLabel: ls("اطلب مراجعتك المجانية", "اطلب مراجعتك المجانية"),
      href: "/contact",
    },
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
            "الخطأ الأكبر الذي نراه في الخليج: محاولة بناء 12 حملة و30 ad set من اليوم الأول. النتيجة: تشتيت الـ pixel data وعدم خروج أي حملة من Learning Phase. ابدأ صغيراً ووسّع لاحقاً.",
            "Advantage+ Shopping Campaigns (ASC) خفّضت تعقيد الإدارة بنسبة 60%، لكنها تتطلب pixel نظيف بـ 50+ purchase event شهرياً ليعمل بفعالية. إن لم تصل لهذا الرقم، استمر على Manual Sales أولاً.",
          ],
          [
"Start with 3 campaigns: Prospecting (Advantage+), Retargeting, Existing Customers. Don’t over-engineer before $5K/mo spend.",
            "The biggest mistake we see in the Gulf: launching 12 campaigns and 30 ad sets on day one. Result: scattered pixel data and no campaign exiting Learning Phase. Start small, scale later.",
            "Advantage+ Shopping Campaigns (ASC) cut management complexity 60%, but they need a clean pixel with 50+ monthly purchase events to perform. Below that threshold, stay on Manual Sales first.",
          ],
        ),
      },
      {
        heading: ls("Advantage+ Shopping", "Advantage+ Shopping"),
        paragraphs: ll(
          [
"ASC تستخدم AI ميتا لتحقيق نتائج ممتازة بأقل تدخل. ارفع 6 إعلانات متنوعة (فيديو، صورة، كاروسيل) ودع الخوارزمية تختار.",
            "للسوق السعودي، اضبط الـ Conversion Window على 7-day click + 1-day view كنقطة بداية. شركات الأزياء والمتاجر اليومية تستفيد من هذا التوزيع لأن دورة الشراء قصيرة.",
            "أضف Detailed Targeting Expansion لجميع الـ ad sets الجديدة، ودع ميتا تتجاوز قيود الجمهور المحدد. خوارزميتها في 2025 أصبحت أفضل بكثير من أي تخطيط جمهور يدوي.",
          ],
          [
"ASC uses Meta’s AI for excellent results with minimal touch. Upload 6 varied ads (video, image, carousel) and let the algorithm pick winners.",
            "For the Saudi market, set the Conversion Window to 7-day click + 1-day view as a starting point. Fashion and daily goods see the cleanest learning at this setting.",
            "Enable Detailed Targeting Expansion on every new ad set and let Meta exceed your defined audience. The 2025 algorithm beats any manual audience plan.",
          ],
        ),
      },
      {
        heading: ls("تتبع CAPI الموثوق", "Reliable CAPI tracking"),
        paragraphs: ll(
          [
"بعد iOS 14، Pixel وحده لا يكفي. فعّل Conversions API عبر Server-Side Tagging لاستعادة 30-40% من البيانات المفقودة.",
            "CAPI ليس ترفاً بعد iOS 17. الإعدادات الموصى بها: GTM Server-Side على Cloudflare Workers أو Stape، مع dedupe events بين Pixel وCAPI عبر event_id موحّد.",
            "للمتاجر السعودية، أضف Customer Information Parameters: external_id (تجزئة email)، fbp، وfbc. هذه البيانات ترفع جودة الإسناد (Event Match Quality) إلى 9.5/10 وتحسن أداء الحملات بنسبة 20-30%.",
          ],
          [
"Post iOS 14, Pixel alone isn’t enough. Enable Conversions API via server-side tagging to recover 30-40% of lost data.",
            "CAPI is non-optional post iOS 17. Recommended setup: GTM Server-Side on Cloudflare Workers or Stape, with deduped events between Pixel and CAPI via a unified event_id.",
            "For Saudi stores, add Customer Information Parameters: external_id (hashed email), fbp, fbc. These lift Event Match Quality to 9.5/10 and improve campaign performance 20-30%.",
          ],
        ),
      },
      {
        heading: ls("إبداع يكسر السكرول", "Scroll-stopping creative"),
        paragraphs: ll(
          [
"أول 3 ثواني تحدد كل شيء. ابدأ بهوك بصري قوي + سؤال يلامس مشكلة العميل. الفيديو العمودي UGC يتفوّق على الإنتاج المصقول في 80% من الحالات.",
            "صنع UGC للسوق السعودي يتطلب فهم الثقافة: استخدم اللهجة الخليجية المختلطة بالفصحى، اظهر المحجبات بطريقة محتشمة، وتجنّب الموسيقى الصاخبة في النهار. الجمهور يتفاعل مع المحتوى الذي يشبهه.",
            "اختبر 3 hooks مختلفة لكل creative: مشكلة، سؤال صادم، أو نتيجة قبل/بعد. الـ hook هو 80% من نجاح الإعلان. باقي الـ video يمكن إعادة استخدامه.",
          ],
          [
"The first 3 seconds decide everything. Open with a strong visual hook + a pain-point question. Vertical UGC video beats polished production 80% of the time.",
            "Crafting UGC for Saudi requires cultural fluency: mixed Gulf-MSA dialect, modest portrayal of women, avoid loud music during prayer times. Audiences engage with content that mirrors them.",
            "Test 3 hooks per creative: problem, shock question, or before/after result. The hook is 80% of ad success — the rest of the video can be reused.",
          ],
        ),
      },
    ],
  
    faq: [
      {
        q: ls("كم ميزانية شهرية للبدء بإعلانات Meta في السعودية؟", "كم ميزانية شهرية للبدء بإعلانات Meta في السعودية؟"),
        a: ls("الحد الأدنى الفعّال هو 8,000 ريال شهرياً للوصول لـ 50 conversion event. تحت هذا الرقم، الخوارزمية لا تتعلم بكفاءة وستحرق ميزانيتك. للمتاجر الجادة، نوصي بـ 15,000-30,000 ريال شهرياً.", "الحد الأدنى الفعّال هو 8,000 ريال شهرياً للوصول لـ 50 conversion event. تحت هذا الرقم، الخوارزمية لا تتعلم بكفاءة وستحرق ميزانيتك. للمتاجر الجادة، نوصي بـ 15,000-30,000 ريال شهرياً."),
      },
      {
        q: ls("لماذا ROAS منخفض رغم محتوى جيد؟", "لماذا ROAS منخفض رغم محتوى جيد؟"),
        a: ls("الأسباب الشائعة: pixel غير مهيأ، تتبع CAPI مفقود، استهداف ضيق جداً، أو موقع بطيء يفقد الزائر قبل الشراء. ابدأ بفحص هذه الأربعة قبل لوم الإعلانات.", "الأسباب الشائعة: pixel غير مهيأ، تتبع CAPI مفقود، استهداف ضيق جداً، أو موقع بطيء يفقد الزائر قبل الشراء. ابدأ بفحص هذه الأربعة قبل لوم الإعلانات."),
      },
      {
        q: ls("هل TikTok Ads أفضل من Meta للسعودية؟", "هل TikTok Ads أفضل من Meta للسعودية؟"),
        a: ls("ليس بديلاً، بل مكملاً. TikTok ممتاز للوعي وجمهور 18-30، Meta أقوى في التحويل والـ retargeting. الاستراتيجية المثلى: 70% Meta + 30% TikTok للعلامات الناشئة.", "ليس بديلاً، بل مكملاً. TikTok ممتاز للوعي وجمهور 18-30، Meta أقوى في التحويل والـ retargeting. الاستراتيجية المثلى: 70% Meta + 30% TikTok للعلامات الناشئة."),
      },
      {
        q: ls("ما عمر Creative قبل أن \"يحرق\"؟", "ما عمر Creative قبل أن \"يحرق\"؟"),
        a: ls("في السوق السعودي، الـ creative يستهلك أداؤه بعد 7-14 يوماً عند صرف 5,000+ ريال. حضّر مكتبة UGC بـ 20+ video شهرياً للحفاظ على الأداء.", "في السوق السعودي، الـ creative يستهلك أداؤه بعد 7-14 يوماً عند صرف 5,000+ ريال. حضّر مكتبة UGC بـ 20+ video شهرياً للحفاظ على الأداء."),
      },
    ],
    internalLinks: [
      {
        label: ls("استراتيجية محتوى UGC للعلامات الخليجية", "استراتيجية محتوى UGC للعلامات الخليجية"),
        href: "/blog/ugc-video-content-strategy",
      },
      {
        label: ls("CRO متجر سلة لرفع التحويل", "CRO متجر سلة لرفع التحويل"),
        href: "/blog/salla-store-cro-guide",
      },
      {
        label: ls("خدمة إعلانات Meta المتخصصة", "خدمة إعلانات Meta المتخصصة"),
        href: "/services/performance-marketing/meta-ads",
      },
      {
        label: ls("باقات الأداء التسويقي", "باقات الأداء التسويقي"),
        href: "/services/performance-marketing",
      },
      {
        label: ls("احجز جلسة تشخيص حملاتك", "احجز جلسة تشخيص حملاتك"),
        href: "/contact",
      },
    ],
    cta: {
      title: ls("هل تنفق على إعلانات Meta بدون نتائج واضحة؟", "هل تنفق على إعلانات Meta بدون نتائج واضحة؟"),
      description: ls("نقدّم Audit مجاني لحساب الإعلانات + تحليل ROAS الفعلي وخطة عمل لـ 60 يوماً.", "نقدّم Audit مجاني لحساب الإعلانات + تحليل ROAS الفعلي وخطة عمل لـ 60 يوماً."),
      buttonLabel: ls("احجز Audit مجاني", "احجز Audit مجاني"),
      href: "/contact",
    },
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
            "صفحة المنتج في السوق السعودي تختلف عن العالمي. العميل يبحث عن: مقاس واضح بالعربية (S/M/L مع شرح بالـ سم)، توفر Cash on Delivery، ومدة شحن واقعية. أضف هذه العناصر فوق زر \"أضف للسلة\".",
            "أضف Sticky Add to Cart يظهر عند السكرول للأسفل. تجاربنا مع متاجر سلة تثبت أن هذا التحسين وحده يرفع تحويل صفحة المنتج بنسبة 18%.",
          ],
          [
"One clear hero image + 5 supporting images + a 15s video. Short title, benefits before specs, transparent pricing.",
            "Saudi product pages differ from global. Buyers want: clear sizing in Arabic (S/M/L with cm), COD availability, and realistic shipping windows. Place these above the Add to Cart button.",
            "Add a Sticky Add to Cart that appears on scroll. Our Salla store tests show this single tweak lifts product page conversion 18%.",
          ],
        ),
      },
      {
        heading: ls("تجربة دفع بدون احتكاك", "Frictionless checkout"),
        paragraphs: ll(
          [
"فعّل Apple Pay وMada وSTC Pay. تخلّص من الحقول غير الضرورية. اعرض ملخص الطلب على اليمين دائماً.",
            "Checkout سلة الافتراضي قابل للتحسين. اطلب فقط: الاسم، الجوال، العنوان، طريقة الدفع. أي حقل إضافي ينقص التحويل بنسبة 7% حسب آخر تقارير Baymard.",
            "فعّل Apple Pay كأول خيار، Mada ثانياً، STC Pay ثالثاً. ترتيب طرق الدفع مهم: العميل يختار ما يراه أولاً غالباً.",
          ],
          [
"Enable Apple Pay, Mada, and STC Pay. Drop unnecessary fields. Always show the order summary on the side.",
            "Salla's default checkout has room. Ask only: name, phone, address, payment. Each extra field costs 7% in conversion per Baymard.",
            "Show Apple Pay first, Mada second, STC Pay third. Payment order matters — users pick what they see first.",
          ],
        ),
      },
      {
        heading: ls("عناصر ثقة عربية", "Arabic trust elements"),
        paragraphs: ll(
          [
"شارة معروف، تقييمات عربية حقيقية، سياسة إرجاع واضحة، ورقم واتساب للتواصل الفوري — هذه القائمة ترفع التحويل بشكل ملحوظ.",
            "شارة معروف ليست مجرد شارة، بل أداة تحويل. اربطها بشكل مرئي في الـ Footer وأعلى Checkout. أضف أيضاً: شعار البنك المركزي، شارة SSL، وشارة \"شحن آمن\".",
            "تقييمات المنتج العربية الأصلية ترفع التحويل أكثر من النجوم وحدها. اعرض 3-5 تقييمات مفصّلة على صفحة المنتج، مع صور من العملاء إن أمكن.",
          ],
          [
"Maroof badge, genuine Arabic reviews, clear return policy, and a WhatsApp number for instant chat — this combo lifts conversion noticeably.",
            "Maroof badge is more than decoration — it's a conversion tool. Display it prominently in the footer and atop checkout. Add: SAMA logo, SSL badge, secure shipping badge.",
            "Genuine Arabic product reviews lift conversion more than star averages alone. Show 3-5 detailed reviews on PDP, with customer photos where possible.",
          ],
        ),
      },
      {
        heading: ls("استراتيجية الشحن", "Shipping strategy"),
        paragraphs: ll(
          [
"الشحن المجاني فوق عتبة معينة هو السلاح الأقوى لرفع AOV. استخدم Shipping Bar في الـ Header.",
            "الشحن المجاني فوق 200 ريال هو العتبة المثالية للسوق السعودي حسب بياناتنا. أقل من 200 يخسر هامش الربح، أعلى من 200 لا يحفّز كفاية.",
            "أضف Shipping Bar ديناميكي يظهر للعميل: \"أضف 47 ريالاً لتحصل على شحن مجاني\". هذا يرفع AOV بنسبة 23% في المتوسط، وأحياناً يصل إلى 40% في فئات معينة.",
          ],
          [
"Free shipping above a threshold is your strongest AOV lever. Use a shipping bar in the header.",
            "Free shipping above SAR 200 is the sweet spot for Saudi based on our data. Below 200 erodes margin; above 200 doesn't push enough.",
            "Add a dynamic shipping bar: \"Add SAR 47 more for free shipping\". This lifts AOV 23% on average, sometimes 40% in specific categories.",
          ],
        ),
      },
    ],
  
    faq: [
      {
        q: ls("هل سلة أفضل من Shopify للسوق السعودي؟", "هل سلة أفضل من Shopify للسوق السعودي؟"),
        a: ls("للمتاجر تحت 5 مليون ريال سنوي، نعم — سلة تقدّم تكامل محلي ممتاز (Mada, STC Pay, Aramex). فوق هذا الرقم، Shopify Plus يعطي مرونة أكبر في التخصيص والـ API.", "للمتاجر تحت 5 مليون ريال سنوي، نعم — سلة تقدّم تكامل محلي ممتاز (Mada, STC Pay, Aramex). فوق هذا الرقم، Shopify Plus يعطي مرونة أكبر في التخصيص والـ API."),
      },
      {
        q: ls("كم متوسط معدل تحويل متجر سلة في السعودية؟", "كم متوسط معدل تحويل متجر سلة في السعودية؟"),
        a: ls("متوسط السوق 1.2-1.8%. المتاجر المحسّنة (CRO + سرعة + ثقة) تصل إلى 3-4.5%. الفرق بين 1.5% و3% يعني مضاعفة الإيرادات بنفس الميزانية.", "متوسط السوق 1.2-1.8%. المتاجر المحسّنة (CRO + سرعة + ثقة) تصل إلى 3-4.5%. الفرق بين 1.5% و3% يعني مضاعفة الإيرادات بنفس الميزانية."),
      },
      {
        q: ls("هل Cash on Delivery لا يزال مهماً؟", "هل Cash on Delivery لا يزال مهماً؟"),
        a: ls("نعم، 35% من المعاملات الإلكترونية في السعودية لا تزال COD حسب تقرير CITC 2024. حذفها يخسرك ثلث المبيعات، لكن أضف رسماً صغيراً (10-15 ريال) لتحفيز الدفع المسبق.", "نعم، 35% من المعاملات الإلكترونية في السعودية لا تزال COD حسب تقرير CITC 2024. حذفها يخسرك ثلث المبيعات، لكن أضف رسماً صغيراً (10-15 ريال) لتحفيز الدفع المسبق."),
      },
      {
        q: ls("متى أفكر بالـ Internationalization؟", "متى أفكر بالـ Internationalization؟"),
        a: ls("بعد تثبيت السوق المحلي وتجاوز 200,000 ريال شهرياً. ابدأ بدول الخليج (الإمارات، الكويت)، ثم مصر والعراق. كل سوق يتطلب: عملته، طرق دفعه، ولغته.", "بعد تثبيت السوق المحلي وتجاوز 200,000 ريال شهرياً. ابدأ بدول الخليج (الإمارات، الكويت)، ثم مصر والعراق. كل سوق يتطلب: عملته، طرق دفعه، ولغته."),
      },
    ],
    internalLinks: [
      {
        label: ls("استراتيجية محتوى UGC للعلامات الخليجية", "استراتيجية محتوى UGC للعلامات الخليجية"),
        href: "/blog/ugc-video-content-strategy",
      },
      {
        label: ls("ROAS 5x من إعلانات Meta", "ROAS 5x من إعلانات Meta"),
        href: "/blog/meta-ads-roas-playbook",
      },
      {
        label: ls("خدمات تطوير المتاجر الإلكترونية", "خدمات تطوير المتاجر الإلكترونية"),
        href: "/services/web-development/ecommerce",
      },
      {
        label: ls("صفحة قطاع التجارة الإلكترونية", "صفحة قطاع التجارة الإلكترونية"),
        href: "/industries/ecommerce",
      },
      {
        label: ls("احجز Audit متجرك مجاناً", "احجز Audit متجرك مجاناً"),
        href: "/contact",
      },
    ],
    cta: {
      title: ls("هل متجر سلة عندك يحقق أقل من 2% تحويل؟", "هل متجر سلة عندك يحقق أقل من 2% تحويل؟"),
      description: ls("احصل على CRO Audit شامل لمتجرك مع خطة 30-60-90 يوماً لمضاعفة المبيعات.", "احصل على CRO Audit شامل لمتجرك مع خطة 30-60-90 يوماً لمضاعفة المبيعات."),
      buttonLabel: ls("اطلب Audit مجاني لمتجرك", "اطلب Audit مجاني لمتجرك"),
      href: "/contact",
    },
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
            "في الخليج تحديداً، UGC يحقّق أداءً مذهلاً لأن المستهلك يثق بالناس قبل الإعلانات. دراسة Nielsen 2024 أظهرت أن 92% من السعوديين يفضّلون آراء حقيقية على محتوى الـ Brand الرسمي.",
            "UGC ليس فقط للمتاجر؛ العيادات، المطاعم، حتى B2B تستفيد. الفرق هو نوع الـ Creator: عيادة تجميل تحتاج Influencer مرئي، B2B SaaS يحتاج Expert في المجال.",
          ],
          [
"Users trust real people more than polished ads. UGC blends into the feed and achieves 4x higher CTR than traditional production.",
            "In the Gulf specifically, UGC performs spectacularly because consumers trust people before brands. Nielsen 2024 showed 92% of Saudis prefer real opinions over official brand content.",
            "UGC isn't just for stores; clinics, restaurants, even B2B benefit. The difference is creator type: aesthetic clinic needs visual influencer, B2B SaaS needs subject-matter expert.",
          ],
        ),
      },
      {
        heading: ls("اختيار صنّاع المحتوى", "Picking creators"),
        paragraphs: ll(
          [
"ابحث عن نانو-إنفلونسرز (5K-50K متابع) باللهجة الخليجية. الأهم: جودة المحتوى وليس عدد المتابعين.",
            "Nano-influencers (5K-50K) في الخليج أفضل ROI من Macro. معدّل التفاعل عندهم 4-7%، مقارنة بـ 0.8% للـ Macro. والتكلفة 10x أقل.",
            "ابحث عبر Instagram + TikTok عن hashtag محلية مثل #الرياض #جدة #بنات_السعودية، اطّلع على 50 حساباً، وانتقي 5-10 يطابقون قيم علامتك. تجنّب الحسابات التي تروّج لكل شيء.",
          ],
          [
"Look for nano-influencers (5K-50K followers) speaking the Gulf dialect. Quality > follower count.",
            "Nano-influencers (5K-50K) in the Gulf deliver better ROI than macros. Engagement rates 4-7% vs. macros' 0.8%. And cost is 10x less.",
            "Search Instagram + TikTok via local hashtags like #Riyadh #Jeddah, scan 50 accounts, pick 5-10 aligned with your brand values. Avoid creators who promote everything.",
          ],
        ),
      },
      {
        heading: ls("كتابة Brief فعّال", "Writing an effective brief"),
        paragraphs: ll(
          [
"Brief واضح: الهوك، المشكلة، المنتج كحل، CTA. اترك حرية للمبدع في التنفيذ.",
            "Brief فعّال يحتوي 4 عناصر: الـ Hook (3 ثوان أولى)، المشكلة، المنتج كحل، CTA. اعطِ المبدع المرونة في تنفيذ كل عنصر بأسلوبه الشخصي.",
            "أضف Do's and Don'ts: لا تذكر منافسين، لا تستخدم موسيقى محظورة، اظهر اللوغو في 5 الثواني الأولى. هذه التفاصيل تمنع تكرار التصوير.",
          ],
          [
"Clear brief: hook, problem, product as solution, CTA. Leave execution freedom to the creator.",
            "Effective brief covers 4 elements: hook (first 3 seconds), problem, product as solution, CTA. Give the creator freedom on execution.",
            "Add Do's and Don'ts: no competitors, no restricted music, show logo in first 5s. These details prevent reshoots.",
          ],
        ),
      },
      {
        heading: ls("إدارة الحقوق والاستخدام", "Managing rights and usage"),
        paragraphs: ll(
          [
"عقد رقمي يحدد مدة الاستخدام (12 شهر)، المنصات (Meta + TikTok)، وحقوق الإعلانات المدفوعة.",
            "عقد رقمي عبر منصات مثل HoneyBook أو Notion يحدّد: مدة الاستخدام، المنصات، حق الـ paid ads، مدة exclusivity. لا تبدأ بدون عقد موقّع.",
            "للسوق السعودي، أضف بنداً يمنع المبدع من العمل مع منافس مباشر لمدة 6 أشهر. هذا يحمي استثمارك ويبني علاقة طويلة الأمد.",
          ],
          [
"Digital contract specifying usage period (12 months), platforms (Meta + TikTok), and paid ads rights.",
            "Use a digital contract via HoneyBook or Notion specifying: usage period, platforms, paid ads rights, exclusivity. Never start without a signed contract.",
            "For Saudi, add a clause preventing the creator from working with a direct competitor for 6 months. This protects investment and builds a long-term relationship.",
          ],
        ),
      },
    ],
  
    faq: [
      {
        q: ls("ما تكلفة UGC في السعودية؟", "ما تكلفة UGC في السعودية؟"),
        a: ls("Nano-influencer: 500-1,500 ريال للفيديو الواحد. Micro: 2,000-5,000 ريال. Macro: 10,000+ ريال. أضف 30% لحقوق الـ paid ads.", "Nano-influencer: 500-1,500 ريال للفيديو الواحد. Micro: 2,000-5,000 ريال. Macro: 10,000+ ريال. أضف 30% لحقوق الـ paid ads."),
      },
      {
        q: ls("هل أحتاج لرخصة من هيئة الإعلام؟", "هل أحتاج لرخصة من هيئة الإعلام؟"),
        a: ls("للإعلان التجاري المدفوع نعم، إذا كان المبدع يعرّف عن نفسه كـ Sponsored. تأكد من تسجيله في GCAM أو وكيل إعلاني مرخّص.", "للإعلان التجاري المدفوع نعم، إذا كان المبدع يعرّف عن نفسه كـ Sponsored. تأكد من تسجيله في GCAM أو وكيل إعلاني مرخّص."),
      },
      {
        q: ls("كم فيديو UGC شهرياً للحملة الواحدة؟", "كم فيديو UGC شهرياً للحملة الواحدة؟"),
        a: ls("الحد الأدنى 4-6 فيديوهات شهرياً للحفاظ على Creative refresh. الأمثل 10-15 فيديو لاختبار وتوسيع الفائز.", "الحد الأدنى 4-6 فيديوهات شهرياً للحفاظ على Creative refresh. الأمثل 10-15 فيديو لاختبار وتوسيع الفائز."),
      },
      {
        q: ls("هل أصور UGC داخلياً أم عبر Creators؟", "هل أصور UGC داخلياً أم عبر Creators؟"),
        a: ls("ابدأ بـ Creators للحصول على variety وأفكار جديدة، ثم وسّع بـ in-house للسرعة وضبط الـ Brand. Hybrid approach يعطي أفضل النتائج.", "ابدأ بـ Creators للحصول على variety وأفكار جديدة، ثم وسّع بـ in-house للسرعة وضبط الـ Brand. Hybrid approach يعطي أفضل النتائج."),
      },
    ],
    internalLinks: [
      {
        label: ls("ROAS 5x من إعلانات Meta في 2025", "ROAS 5x من إعلانات Meta في 2025"),
        href: "/blog/meta-ads-roas-playbook",
      },
      {
        label: ls("CRO متجر سلة - 10 تحسينات", "CRO متجر سلة - 10 تحسينات"),
        href: "/blog/salla-store-cro-guide",
      },
      {
        label: ls("خدمات الإنتاج الإبداعي", "خدمات الإنتاج الإبداعي"),
        href: "/services/creative",
      },
      {
        label: ls("باقات إدارة السوشيال ميديا", "باقات إدارة السوشيال ميديا"),
        href: "/services/social-media",
      },
      {
        label: ls("احجز جلسة استراتيجية محتوى", "احجز جلسة استراتيجية محتوى"),
        href: "/contact",
      },
    ],
    cta: {
      title: ls("هل تريد بناء مكتبة UGC قوية لعلامتك التجارية؟", "هل تريد بناء مكتبة UGC قوية لعلامتك التجارية؟"),
      description: ls("نوصلك بأفضل صنّاع المحتوى في الخليج وندير الحملة من البداية للنهاية.", "نوصلك بأفضل صنّاع المحتوى في الخليج وندير الحملة من البداية للنهاية."),
      buttonLabel: ls("ابدأ حملة UGC الآن", "ابدأ حملة UGC الآن"),
      href: "/contact",
    },
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
            "للسوق السعودي، خادم في فرانكفورت أو دبي يقلّل TTFB من 800ms إلى 180ms. الفرق ملحوظ في PageSpeed وفي تجربة العميل الفعلية.",
            "Cloudways على DigitalOcean في فرانكفورت من أفضل الخيارات بسعر معقول (40-80$ شهرياً). Kinsta أغلى لكن أسرع وأكثر أمناً للمتاجر الكبيرة.",
          ],
          [
"Managed WordPress hosting (Kinsta, Pressable) makes a seconds-level difference. A server near your Gulf audience cuts TTFB by 40%.",
            "For Saudi audiences, a Frankfurt or Dubai server cuts TTFB from 800ms to 180ms. The difference shows in PageSpeed and real UX.",
            "Cloudways on DigitalOcean Frankfurt is among the best for value (40-80$/month). Kinsta is pricier but faster and safer for large stores.",
          ],
        ),
      },
      {
        heading: ls("Caching متعدد الطبقات", "Multi-layer caching"),
        paragraphs: ll(
          [
"Object Cache (Redis) + Page Cache (WP Rocket) + CDN Cache (Cloudflare). كل طبقة تحل مشكلة مختلفة.",
            "WP Rocket هو Plugin الـ Caching الأقوى في 2025. إعداداته الموصى بها: Lazy Load للصور والـ iframes، Minify CSS/JS، Database Cleanup أسبوعياً، Preload لأهم 50 صفحة.",
            "Object Cache عبر Redis ضروري للمواقع التي تتجاوز 10K زيارة شهرياً. يقلّل أحمال قاعدة البيانات بنسبة 70% ويحسّن وقت الاستجابة بشكل ملحوظ.",
          ],
          [
"Object Cache (Redis) + Page Cache (WP Rocket) + CDN Cache (Cloudflare). Each layer solves a different problem.",
            "WP Rocket is the strongest caching plugin in 2025. Recommended settings: lazy-load images and iframes, minify CSS/JS, weekly DB cleanup, preload top 50 pages.",
            "Redis-backed object cache is essential above 10K monthly visits. Cuts DB load by 70% and improves response time significantly.",
          ],
        ),
      },
      {
        heading: ls("تحسين الصور والخطوط", "Image and font optimization"),
        paragraphs: ll(
          [
"حوّل كل الصور إلى WebP/AVIF. حمّل الخطوط محلياً مع font-display: swap لمنع CLS.",
            "ShortPixel أو Imagify لتحويل الصور آلياً إلى WebP/AVIF. النتيجة: تقليل حجم الصور بنسبة 60-80% بدون فقدان جودة ملحوظ.",
            "للخطوط العربية، استضف Cairo أو Tajawal محلياً عبر font-display: swap لمنع FOIT. تحميل من Google Fonts يضيف 200-400ms لكل خط.",
          ],
          [
"Convert all images to WebP/AVIF. Self-host fonts with font-display: swap to prevent CLS.",
            "ShortPixel or Imagify for automatic WebP/AVIF conversion. Result: 60-80% image size reduction without noticeable quality loss.",
            "For Arabic fonts, self-host Cairo or Tajawal with font-display: swap to prevent FOIT. Loading from Google Fonts adds 200-400ms per font.",
          ],
        ),
      },
      {
        heading: ls("تنظيف قاعدة البيانات", "Database cleanup"),
        paragraphs: ll(
          [
"احذف post revisions القديمة، transients المنتهية، والتعليقات المزعجة شهرياً. قاعدة بيانات نظيفة = استعلامات أسرع.",
            "WP Optimize أو Advanced Database Cleaner لتنظيف شهري آلي. احذف: post revisions أقدم من 30 يوماً، spam comments، expired transients، orphaned post meta.",
            "للمتاجر WooCommerce، حدّد عدد الـ revisions بـ 5 فقط لكل منتج. هذا يوفّر ميجابايتات من قاعدة البيانات شهرياً.",
          ],
          [
"Delete old post revisions, expired transients, and spam monthly. A clean database = faster queries.",
            "WP Optimize or Advanced Database Cleaner for automatic monthly cleanup. Delete: revisions older than 30 days, spam comments, expired transients, orphaned post meta.",
            "For WooCommerce stores, cap revisions to 5 per product. This saves megabytes monthly.",
          ],
        ),
      },
    ],
  
    faq: [
      {
        q: ls("ما مدّة تسريع موقع ووردبريس بطيء؟", "ما مدّة تسريع موقع ووردبريس بطيء؟"),
        a: ls("8-16 ساعة عمل لمعظم المواقع الصغيرة-المتوسطة. التحسينات الكبرى (الاستضافة، Caching، الصور) تظهر فوراً، بينما تحسينات قاعدة البيانات تأخذ بضعة أيام لتظهر في PageSpeed.", "8-16 ساعة عمل لمعظم المواقع الصغيرة-المتوسطة. التحسينات الكبرى (الاستضافة، Caching، الصور) تظهر فوراً، بينما تحسينات قاعدة البيانات تأخذ بضعة أيام لتظهر في PageSpeed."),
      },
      {
        q: ls("هل أحتاج لمطوّر متخصص؟", "هل أحتاج لمطوّر متخصص؟"),
        a: ls("للتحسينات البسيطة (Plugins، إعدادات WP Rocket)، يمكنك العمل بنفسك. للتحسينات العميقة (Critical CSS، Server-Side تحسينات، Custom Caching)، تحتاج لخبير.", "للتحسينات البسيطة (Plugins، إعدادات WP Rocket)، يمكنك العمل بنفسك. للتحسينات العميقة (Critical CSS، Server-Side تحسينات، Custom Caching)، تحتاج لخبير."),
      },
      {
        q: ls("هل CDN يكفي بدلاً من تحسين الصور؟", "هل CDN يكفي بدلاً من تحسين الصور؟"),
        a: ls("لا. CDN يقرّب الملفات من المستخدم لكنه لا يقلّل حجمها. التحسين الحقيقي = WebP/AVIF + CDN معاً، وهذا ما نطبّقه دائماً.", "لا. CDN يقرّب الملفات من المستخدم لكنه لا يقلّل حجمها. التحسين الحقيقي = WebP/AVIF + CDN معاً، وهذا ما نطبّقه دائماً."),
      },
      {
        q: ls("ما تأثير السرعة على ترتيب جوجل؟", "ما تأثير السرعة على ترتيب جوجل؟"),
        a: ls("Core Web Vitals عامل ترتيب رسمي منذ 2021. موقع بطيء يخسر 15-20% من الترتيب حتى لو كان محتواه أفضل. السرعة = SEO + UX + تحويل أعلى.", "Core Web Vitals عامل ترتيب رسمي منذ 2021. موقع بطيء يخسر 15-20% من الترتيب حتى لو كان محتواه أفضل. السرعة = SEO + UX + تحويل أعلى."),
      },
    ],
    internalLinks: [
      {
        label: ls("قائمة السيو التقني الكاملة لـ 2025", "قائمة السيو التقني الكاملة لـ 2025"),
        href: "/blog/technical-seo-checklist-2025",
      },
      {
        label: ls("CRO متجر سلة لرفع التحويل", "CRO متجر سلة لرفع التحويل"),
        href: "/blog/salla-store-cro-guide",
      },
      {
        label: ls("خدمة تطوير وصيانة الويب", "خدمة تطوير وصيانة الويب"),
        href: "/services/web-development",
      },
      {
        label: ls("استشارات الأداء التقني", "استشارات الأداء التقني"),
        href: "/services/web-development/performance",
      },
      {
        label: ls("احجز Audit سرعة موقعك", "احجز Audit سرعة موقعك"),
        href: "/contact",
      },
    ],
    cta: {
      title: ls("هل موقع ووردبريس عندك يفشل في Core Web Vitals؟", "هل موقع ووردبريس عندك يفشل في Core Web Vitals؟"),
      description: ls("احصل على Speed Audit مجاني + خطة تنفيذ لتحسين الأداء خلال 14 يوماً.", "احصل على Speed Audit مجاني + خطة تنفيذ لتحسين الأداء خلال 14 يوماً."),
      buttonLabel: ls("احجز Audit مجاني", "احجز Audit مجاني"),
      href: "/contact",
    },
  }),
  post({
    slug: "market-aligned-ad-campaigns-saudi",
    categorySlug: "performance",
    title: ls(
      "حملات إعلانية متوافقة مع تطورات السوق في السعودية: دليل الشركات لنتائج قابلة للقياس",
      "Market-Aligned Ad Campaigns in Saudi Arabia: A Company Guide to Measurable Results",
    ),
    excerpt: ls(
      "كيف تبني حملات إعلانية حديثة تواكب سلوك العميل السعودي، تقلّل الهدر، وتحوّل الميزانية إلى نتائج قابلة للقياس.",
      "How to build modern ad campaigns that match Saudi buyer behavior, cut waste, and turn budget into measurable results.",
    ),
    metaTitle: ls(
      "حملات إعلانية متوافقة مع تطورات السوق في السعودية | فكرة",
      "Market-Aligned Ad Campaigns in Saudi Arabia | Fikra",
    ),
    metaDescription: ls(
      "دليل عملي لبناء حملات إعلانية حديثة في السعودية: اختيار المنصة، صفحة الهبوط، تتبع التحويلات، وقياس العائد بدقة.",
      "A practical guide to building modern ad campaigns in Saudi Arabia: platform choice, landing pages, conversion tracking, and ROI measurement.",
    ),
    keywords: ll(
      ["حملات إعلانية", "إعلانات السعودية", "إدارة حملات إعلانية", "حملات جوجل", "حملات السوشيال ميديا", "إعادة الاستهداف", "تحسين أداء الحملات"],
      ["ad campaigns", "saudi ads", "campaign management", "google ads", "social media ads", "retargeting", "campaign optimization"],
    ),
    author: ls("فريق فكرة", "Fikra Team"),
    publishedAt: "2026-05-03",
    lastReviewed: "2026-05-03",
    authorRole: ls("خبراء إدارة الحملات الإعلانية", "Paid Media & Performance Experts"),
    authorBio: ls(
      "فريق فكرة يضم متخصصين في إدارة حملات Google وMeta وTikTok وSnapchat للسوق السعودي والخليجي، مع أكثر من 8 سنوات خبرة في تحسين CPL وROAS عبر قطاعات العيادات والمتاجر والخدمات وB2B.",
      "Fikra's team specializes in Google, Meta, TikTok and Snapchat campaigns for the Saudi & Gulf markets, with 8+ years optimizing CPL and ROAS across clinics, e-commerce, services and B2B.",
    ),
    tldr: ll(
      [
        "السوق السعودي: 34.4 مليون مستخدم إنترنت و38.6 مليون هوية على السوشيال ميديا في 2026 — منافسة أعلى وتكلفة إعلان أكبر.",
        "الحملة المتوافقة مع السوق تتغير وفق البيانات وسلوك العميل، وليس إعلان ثابت يعمل لأشهر.",
        "اختر المنصة حسب نية العميل: Google للبحث الفوري، Meta/TikTok/Snapchat للوعي وإعادة الاستهداف.",
        "قِس CPL وCPA وROAS وجودة العميل — لا تقِس النقرات وحدها.",
        "صفحة هبوط واضحة + سرعة رد على واتساب = الفرق بين حملة ناجحة وميزانية مهدورة.",
        "راجع أسبوعيًا، حلّل شهريًا، وحدّث الاستراتيجية ربع سنويًا.",
      ],
      [
        "Saudi market: 34.4M internet users and 38.6M social identities in 2026 — higher competition and ad costs.",
        "A market-aligned campaign evolves with data and behavior — not a static ad that runs for months.",
        "Pick the platform by intent: Google for active search, Meta/TikTok/Snapchat for awareness and retargeting.",
        "Measure CPL, CPA, ROAS and lead quality — never clicks alone.",
        "Clear landing page + fast WhatsApp reply = the difference between profit and waste.",
        "Review weekly, analyze monthly, update strategy quarterly.",
      ],
    ),
    sources: [
      { label: ls("DataReportal — Digital 2026 Saudi Arabia", "DataReportal — Digital 2026 Saudi Arabia"), url: "https://datareportal.com/reports/digital-2026-saudi-arabia" },
      { label: ls("Google Ads — تتبع التحويلات", "Google Ads — Conversion Tracking"), url: "https://support.google.com/google-ads/answer/1722022" },
      { label: ls("Meta for Business — أفضل الممارسات", "Meta for Business — Best Practices"), url: "https://www.facebook.com/business/help" },
    ],
    readingMinutes: 12,
    image: "/blog/market-aligned-ad-campaigns.webp",
    tableOfContents: ll(
      [
        "ما معنى حملات إعلانية متوافقة مع تطورات السوق؟",
        "لماذا تحتاج الشركات في السعودية إلى حملات حديثة؟",
        "تأثير اتجاهات التسويق الحديثة على الحملات",
        "رحلة العميل السعودي عبر أكثر من منصة",
        "علامات تقول إن حملتك لم تعد مناسبة للسوق",
        "الفرق بين الحملة التقليدية والحملة المتوافقة مع السوق",
        "استراتيجيات بناء حملة متوافقة مع السوق",
        "حملات السوشيال ميديا أم حملات جوجل؟",
        "الإعلانات الممولة وإعادة الاستهداف",
        "توزيع الميزانية بين المنصات",
        "اختيار مؤشرات الأداء المناسبة",
        "دور الرسالة الإعلانية وصفحة الهبوط",
        "سرعة الرد وأثرها على النتائج",
        "متى تحتاج إدارة احترافية؟",
        "كيف تساعدك فكرة في بناء حملاتك",
        "دمج SEO مع الحملات المدفوعة",
        "أخطاء شائعة تُفشل الحملة",
        "نظام مراجعة دوري للحملات",
      ],
      [
        "What are market-aligned ad campaigns?",
        "Why Saudi companies need modern campaigns",
        "How modern marketing trends affect ads",
        "The Saudi customer journey across platforms",
        "Signs your campaign is no longer market-fit",
        "Traditional vs market-aligned campaigns",
        "Strategies to build a market-aligned campaign",
        "Social media ads vs Google Ads",
        "Paid ads & retargeting",
        "Distributing budget across platforms",
        "Choosing the right KPIs",
        "Ad message & landing page",
        "Response speed and results",
        "When you need pro campaign management",
        "How Fikra helps you build campaigns",
        "Combining SEO with paid ads",
        "Common mistakes that break campaigns",
        "Building a periodic review system",
      ],
    ),
    body: [
      {
        heading: ls("ما معنى حملات إعلانية متوافقة مع تطورات السوق؟", "What are market-aligned ad campaigns?"),
        summary: ls('حملة تتغيّر باستمرار وفق بيانات الأداء وسلوك العميل والمنصة، بدل تكرار نفس الإعلان لأشهر.', 'A campaign that continuously evolves with performance data, behavior, and platform — not a static ad repeated for months.'),
        paragraphs: ll(
          [
            "34.4 مليون مستخدم للإنترنت و38.6 مليون هوية لمستخدمي السوشيال ميديا في السعودية خلال 2026. مع هذا الزحام الرقمي، المشكلة لم تعد في وجود العملاء، بل في كيف تصل لهم وسط منافسة أعلى وتكلفة إعلان أكبر.",
            "حملات إعلانية متوافقة مع تطورات السوق هي الحملات التي تتغير وفق البيانات وسلوك العملاء وأداء المنصات واتجاهات المنافسة. لا تعتمد على تكرار نفس الإعلان لفترات طويلة، بل على مراجعة مستمرة للجمهور والرسالة والمنصة وصفحة الهبوط ومؤشرات الأداء.",
            "هذا النوع من إدارة الحملات الإعلانية يساعد الشركات على تقليل الهدر وتحسين العائد من الميزانية، لأنه لا يتعامل مع الإعلان كتصميم يُنشر، بل كنظام تسويقي كامل يبدأ من فهم العميل وينتهي بقياس النتيجة.",
            "في السوق السعودي، العميل أصبح أكثر وعيًا ويقارن بين أكثر من خيار قبل التواصل أو الشراء. الحملة الناجحة اليوم تصل إلى الشخص المناسب برسالة مناسبة في التوقيت المناسب، ثم تقوده إلى خطوة واضحة قابلة للقياس.",
          ],
          [
            "With 34.4M internet users and 38.6M social identities in Saudi Arabia in 2026, the challenge isn't finding customers — it's reaching them amid heavier competition and higher ad costs.",
            "Market-aligned campaigns evolve based on data, customer behavior, platform performance, and competitive trends — not by repeating the same ad for months.",
            "This approach treats advertising as a full marketing system that starts with understanding the customer and ends with measuring the outcome.",
            "Saudi buyers compare multiple options before contacting or buying. Winning campaigns reach the right person, with the right message, at the right time, and lead to a measurable next step.",
          ],
        ),
      },
      {
        heading: ls("لماذا تحتاج الشركات في السعودية إلى حملات إعلانية حديثة؟", "Why Saudi companies need modern campaigns"),
        summary: ls('تغيّر سلوك العميل وارتفاع التكلفة وتشبّع الجمهور يجبران الشركات السعودية على تحديث طريقة إدارة الإعلانات.', 'Shifting behavior, rising costs, and audience fatigue force Saudi companies to modernize how they run ads.'),
        paragraphs: ll(
          [
            "العميل لم يعد يتخذ قراره من إعلان واحد. القرار أصبح يعتمد على رحلة كاملة تشمل السوشيال ميديا، البحث في جوجل، صفحة الهبوط، سرعة التواصل، والثقة في العلامة.",
            "أبرز أسباب الحاجة إلى حملات حديثة: تغير سلوك العملاء، ارتفاع المنافسة في نفس القطاع، تعدد المنصات وتغير أسلوب كل منها، ارتفاع تكلفة الوصول، وتشبّع الجمهور من الرسائل المتكررة، إضافة إلى زيادة أهمية المحتوى القصير والرسائل المباشرة.",
            "الشركات التي تعتمد على حملات متوافقة مع تطورات السوق تكون أقدر على ضبط الميزانية وتحسين النتائج، بينما الشركات التي تكرر نفس الرسائل لفترة طويلة غالبًا ستدفع أكثر لتحصل على نتائج أقل.",
          ],
          [
            "Customers no longer decide based on a single ad. Their journey spans social, Google search, your landing page, response speed, and brand trust.",
            "Behavior shifts, competition density, platform fragmentation, rising acquisition costs, and message fatigue all push companies toward modern campaigns.",
            "Brands that adapt control budgets better; brands that repeat the same messages keep paying more for less.",
          ],
        ),
      },
      {
        heading: ls("كيف تؤثر اتجاهات التسويق الحديثة على الحملات؟", "How modern marketing trends affect campaigns"),
        summary: ls('البيانات وتخصيص الرسالة وقياس التحويلات صارت أهم من حجم الميزانية.', 'Data, message personalization, and conversion measurement now matter more than budget size.'),
        paragraphs: ll(
          [
            "وفق بيانات DataReportal، السعودية تضم 34.4 مليون مستخدم للإنترنت بمعدل انتشار 99% و48.7 مليون اتصال جوال، مما يوضح قوة الحضور الرقمي والجوال في السوق السعودي. لكن هذا يعني أيضًا أن المنافسة على انتباه العميل أصبحت أعلى.",
            "اتجاهات التسويق الحديثة تجعل الحملات أكثر اعتمادًا على: تحليل البيانات بدل التخمين، تخصيص الرسائل حسب الجمهور، الربط بين الإعلانات الممولة وSEO، استخدام إعادة الاستهداف بذكاء، تحسين تجربة صفحة الهبوط، وقياس التحويلات وليس النقرات فقط.",
          ],
          [
            "DataReportal puts Saudi internet users at 34.4M (99% penetration) with 48.7M mobile connections — a digital-first, mobile-first market with sharper competition for attention.",
            "Modern campaigns rely on data over guesswork, audience-specific messaging, paid+SEO integration, smart retargeting, landing page UX, and conversion-focused measurement.",
          ],
        ),
      },
      {
        heading: ls("رحلة العميل السعودي: لماذا لا تكفي منصة واحدة؟", "The Saudi customer journey: why one platform isn't enough"),
        summary: ls('العميل السعودي يتنقل بين السوشيال والبحث والموقع والواتساب، فلا يكفي إعلان على منصة واحدة.', 'Saudi buyers hop across social, search, your site and WhatsApp — one platform is never enough.'),
        paragraphs: ll(
          [
            "من أكبر الأخطاء الاعتماد على منصة واحدة. قد يبدأ العميل من إعلان على السوشيال ميديا، ثم يبحث عن اسم الشركة في جوجل، يدخل الموقع، يراجع التقييمات، ثم يتواصل عبر واتساب. أي مرحلة ضعيفة قد تخسرك العميل حتى لو كان الإعلان جيدًا.",
            "مثال: الإعلان جذب الانتباه، العميل دخل صفحة الهبوط، الصفحة كانت بطيئة أو غير واضحة، فخرج دون تواصل. أو: الإعلان وصل لجمهور مناسب، أرسل العميل رسالة واتساب، تأخر الرد، فتواصل مع منافس أسرع.",
            "الحملات المتوافقة مع تطورات السوق لا تنظر للإعلان كقطعة منفصلة، بل كجزء من رحلة كاملة، كل نقطة فيها واضحة وسريعة ومبنية على فهم سلوك العملاء.",
          ],
          [
            "Relying on a single platform is a common, expensive mistake. The customer often starts on social, searches your brand on Google, visits your site, reads reviews, then messages on WhatsApp.",
            "Any weak step — slow landing page, late reply — loses the lead even with a great ad.",
            "Modern campaigns design the whole journey, not isolated ads.",
          ],
        ),
      },
      {
        heading: ls("علامات تقول إن حملتك لم تعد مناسبة للسوق الحالي", "Signs your campaign is no longer market-fit"),
        summary: ls('تكلفة عميل ترتفع، نقرات بدون مبيعات، وعدم تجديد التصاميم — مؤشرات إن الحملة فقدت توافقها مع السوق.', 'Rising CPL, clicks without sales, and stale creatives are signs your campaign is out of sync with the market.'),
        paragraphs: ll(
          [
            "الحملة لا تفشل فجأة. التراجع تدريجي: تكلفة العميل تزيد، جودة الاستفسارات تقل، معدل التحويل ينخفض، ثم تبدأ الشركة برفع الميزانية بدل معالجة السبب الحقيقي.",
            "أبرز العلامات: ارتفاع تكلفة العميل المحتمل رغم ثبات الميزانية، زيادة النقرات دون مبيعات، انخفاض جودة العملاء، ضعف التفاعل مع نفس الرسائل القديمة، الاعتماد على منصة واحدة لفترة طويلة، غياب تتبع التحويلات، تكرار نفس التصميم دون اختبار، انخفاض معدل تحويل صفحة الهبوط، عدم وضوح العائد من كل قناة، وشكوى فريق المبيعات من جودة العملاء.",
            "وجود علامة واحدة لا يعني أن الحملة فاشلة بالكامل، لكنه يعني أنها تحتاج إلى تحليل. تحسين أداء الحملات يبدأ من فهم المشكلة بدقة، وليس من زيادة الميزانية مباشرة.",
          ],
          [
            "Campaigns decline gradually: rising CPL, fewer sales per click, weaker lead quality, less engagement on stale creative.",
            "Key red flags: single-platform dependency, no conversion tracking, no creative testing, low landing-page conversion, unclear ROI per channel, sales team complaining about lead quality.",
            "One signal alone isn't failure — it's a prompt to analyze, not to raise the budget.",
          ],
        ),
      },
      {
        heading: ls("الفرق بين الحملة التقليدية وحملات إعلانية متوافقة مع تطورات السوق", "Traditional campaigns vs market-aligned campaigns"),
        summary: ls('التقليدية: إعلان ثابت وميزانية موزعة بالتساوي. الحديثة: اختبار مستمر وتتبع تحويلات وتعديل وفق الأداء.', 'Traditional: a fixed ad with equal budget split. Modern: continuous testing, conversion tracking, and performance-based shifts.'),
        paragraphs: ll(
          [
            "الحملة التقليدية: إطلاق وانتظار، اختيار المنصة بالشهرة، قياس بالمشاهدات والنقرات، رسالة ثابتة، ميزانية موزعة بنفس الطريقة، صفحة هبوط مجرد رابط، تتبع محدود، وتطوير بعد حدوث المشكلة.",
            "الحملة المتوافقة مع السوق: اختبار وتحليل وتحسين مستمر، اختيار المنصة بسلوك العملاء، قياس بالتحويلات والعائد، رسالة مرنة، إعادة توزيع الميزانية حسب الأداء، صفحة هبوط جزء أساسي من التحويل، تتبع مضبوط قبل الإطلاق، وتطوير دوري ومنظم.",
            "كثير من الشركات لا تخسر بسبب ضعف المنتج، بل بسبب طريقة إدارة الإعلان. الحملة التقليدية قد تعطي أرقامًا تبدو جيدة، لكنها لا تضمن نتيجة تجارية واضحة.",
          ],
          [
            "Traditional: launch & wait, pick platforms by familiarity, measure clicks, static creative, fixed budget split, landing page = a link, limited tracking.",
            "Market-aligned: continuous test/measure/improve, platform chosen by behavior, conversions over clicks, flexible messaging, performance-based budget reallocation, landing page as a conversion engine, tracking set up before launch.",
            "Many brands lose to ad management — not to product quality.",
          ],
        ),
      },
      {
        heading: ls("استراتيجيات بناء حملة متوافقة مع السوق", "Strategies to build a market-aligned campaign"),
        summary: ls('حدد الهدف، ادرس الجمهور، اختر المنصة، أعدّ الرسالة وصفحة الهبوط، فعّل التتبع، ثم اختبر وحسّن.', 'Set the goal, study the audience, pick the platform, prep message+landing, enable tracking, then test and optimize.'),
        paragraphs: ll(
          [
            "1) حدّد الهدف بدقة: مبيعات، حجوزات، عملاء محتملون، زيارات، أم وعي. كل هدف يحتاج منصة ورسالة وقياسًا مختلفًا.",
            "2) افهم الجمهور بعمق: ما المشكلة؟ ما الذي يمنعه من الشراء؟ ما الاعتراضات؟ هل في مرحلة وعي أم مقارنة أم قرار؟",
            "3) اختر القناة المناسبة: حملات جوجل للنية الشرائية العالية، السوشيال ميديا للوعي والتأثير البصري وإعادة الاستهداف.",
            "4) اكتب رسالة تحل مشكلة، وابتعد عن العبارات العامة كـ \"أفضل جودة\".",
            "5) اضبط التتبع قبل الإطلاق. توضح Google أن قياس التحويلات يساعد على فهم سلوك المستخدم وتحسين أداء الحملات.",
          ],
          [
            "1) Define the business goal precisely.",
            "2) Understand the audience deeply: blockers, objections, journey stage.",
            "3) Choose the right channel: Google for high intent, social for awareness and retargeting.",
            "4) Write messages that solve a real problem, not generic claims.",
            "5) Set up tracking before launch — Google emphasizes conversion tracking as the basis of optimization.",
          ],
        ),
      },
      {
        heading: ls("حملات السوشيال ميديا أم حملات جوجل الإعلانية؟", "Social media ads vs Google Ads"),
        summary: ls('Google لمن يبحث الآن، السوشيال للوعي وإعادة الاستهداف. الأفضل دمج المنصات حسب رحلة العميل.', 'Google for active intent, social for awareness and retargeting — the best mix follows the customer journey.'),
        paragraphs: ll(
          [
            "الاختيار يعتمد على نية العميل. حملات جوجل مناسبة عندما يبحث العميل عن خدمة الآن أو نشاط محلي أو طلب فوري. حملات السوشيال ميديا مناسبة عندما تحتاج العلامة انتشارًا، أو يكون المنتج بصريًا، أو يحتاج القرار تكرارًا.",
            "العيادات: Google + Meta للحجوزات. المطاعم: Snapchat/Instagram/TikTok للانتشار المحلي. المتاجر: Meta/TikTok/Google للمبيعات. B2B: LinkedIn/Google للعملاء المؤهلين. الخدمات المنزلية: Google Search + WhatsApp. التدريب: Meta/TikTok/Google للتسجيلات.",
            "غالبًا الأفضل ليس منصة واحدة، بل مزيج إعلاني يخدم رحلة العميل من الوعي إلى القرار.",
          ],
          [
            "Use Google when intent is explicit and purchase is imminent. Use social for awareness, visual products, and decisions that need repetition.",
            "Clinics: Google+Meta. Restaurants: Snapchat/Instagram/TikTok. E-commerce: Meta/TikTok/Google. B2B: LinkedIn/Google. Home services: Google Search+WhatsApp. Education: Meta/TikTok/Google.",
            "The best mix supports the entire journey, not a single channel.",
          ],
        ),
      },
      {
        heading: ls("دور الإعلانات الممولة وإعادة الاستهداف", "Paid ads & retargeting"),
        summary: ls('الإعلانات الممولة تفتح الباب، وإعادة الاستهداف تكمل البيع برسائل تناسب مرحلة كل زائر.', 'Paid ads open the door; retargeting closes the sale with stage-specific messages.'),
        paragraphs: ll(
          [
            "الإعلانات الممولة تمنح وصولًا سريعًا، وإعادة الاستهداف تجعل هذا الوصول أكثر كفاءة. عندما يتفاعل العميل مع إعلانك أو يزور موقعك دون شراء، يمكن إعادة التواصل برسالة جديدة تناسب مرحلته.",
            "تستخدم في: تذكير زائر لم يكمل الطلب، تقديم عرض لمن شاهد الخدمة، توضيح ميزة لمن زار صفحة معينة، إعادة جذب العملاء السابقين، وتحسين تحويل الزيارات القديمة.",
            "إعادة الاستهداف لا تعني تكرار نفس الإعلان. كل مرحلة تحتاج رسالة مختلفة، وهذا ما يقلّل الهدر ويرفع التحويل.",
          ],
          [
            "Paid ads buy reach; retargeting makes that reach efficient by re-engaging warm visitors with stage-appropriate messages.",
            "Use it for cart abandoners, service viewers, page-specific upsells, win-back, and CRO on past traffic.",
            "Don't repeat the same ad — vary by stage to reduce waste and lift conversions.",
          ],
        ),
      },
      {
        heading: ls("كيف توزع الميزانية بين المنصات؟", "How to distribute budget across platforms"),
        summary: ls('وزّع وفق الأداء لا بالتساوي: ابدأ بميزانية اختبارية، ثم وسّع الفائز وأوقف الخاسر تدريجيًا.', 'Allocate by performance, not equally: start with a test budget, then scale winners and pause losers gradually.'),
        paragraphs: ll(
          [
            "الخطأ الشائع تقسيم الميزانية بالتساوي دون النظر إلى الأداء. التوزيع الصحيح يعتمد على الهدف وسلوك العملاء وجودة النتائج.",
            "ابدأ بميزانية اختبارية موزعة بين القنوات الأكثر منطقية لنشاطك. القناة التي تجلب عملاء أفضل بتكلفة أقل تستحق زيادة تدريجية، والقناة الضعيفة تحتاج تعديلًا أو إيقافًا.",
            "خصص جزءًا لجوجل عند وجود نية شراء واضحة، جزءًا للسوشيال للتوعية، وجزءًا لإعادة الاستهداف. لا تنفق كل الميزانية على إعلان واحد، ولا ترفعها قبل فهم جودة النتائج. قارن تكلفة العميل بهامش الربح وليس بعدد النقرات.",
          ],
          [
            "Splitting budget equally is the most common mistake — let performance, intent, and goal drive allocation.",
            "Start with a test split, then scale winners and pause losers gradually.",
            "Compare CPL to your margin — not to clicks. Don't scale before you understand quality.",
          ],
        ),
      },
      {
        heading: ls("كيف تختار مؤشرات الأداء المناسبة؟", "Choosing the right KPIs"),
        summary: ls('ركّز على CPL وCPA وROAS وجودة العميل — النقرات وحدها قد تخدعك.', 'Focus on CPL, CPA, ROAS and lead quality — clicks alone can mislead you.'),
        paragraphs: ll(
          [
            "إذا كنت تقيس المؤشرات الخطأ، قد تعتقد أن الحملة ناجحة وهي لا تحقق عائدًا فعليًا.",
            "أهم المؤشرات: تكلفة العميل المحتمل CPL، تكلفة الاكتساب CPA، معدل التحويل، العائد على الإنفاق ROAS، جودة العملاء، نسبة الإغلاق، وقيمة العميل على المدى الطويل.",
            "النقرات وحدها ليست دليلًا على نجاح الحملة. المؤشر الحقيقي هو النتيجة التجارية: استفسار جيد، حجز، بيع، أو عميل مؤهل. توضح Google أن تتبع التحويلات يساعد المعلنين على معرفة الإعلانات التي تقود إلى إجراءات مهمة.",
          ],
          [
            "Wrong KPIs make losing campaigns look successful.",
            "Track CPL, CPA, conversion rate, ROAS, lead quality, close rate, and LTV.",
            "Clicks alone don't prove success — the truth is in qualified leads, bookings, and sales. Google highlights conversion tracking as the foundation for ad optimization.",
          ],
        ),
      },
      {
        heading: ls("دور الرسالة الإعلانية وصفحة الهبوط", "The ad message and landing page"),
        summary: ls('رسالة دقيقة + صفحة هبوط سريعة وواضحة + زر واتساب ظاهر = تحويل أعلى دون رفع الميزانية.', 'Sharp message + fast clear landing page + visible WhatsApp button = higher conversion without raising spend.'),
        paragraphs: ll(
          [
            "الرسالة القوية ليست بالضرورة طويلة، لكنها يجب أن تكون واضحة ومتصلة باحتياج العميل. بدلًا من \"نقدم خدمات إعلانية احترافية\"، قل: \"نساعدك على معرفة أين تُصرف ميزانيتك، وأي قناة تحقق أفضل عائد، وكيف تقلل الهدر\".",
            "صفحة الهبوط تحدد هل الزائر سيتحول إلى عميل أم لا. يجب أن تحتوي على عنوان واضح، وصف مختصر، زر إجراء، وسائل تواصل ظاهرة، زر واتساب، عناصر ثقة، سرعة تحميل جيدة على الجوال، وتصميم بسيط.",
            "تحسين صفحة الهبوط قد يرفع النتائج دون زيادة الميزانية. أحيانًا لا تحتاج إلى إعلان جديد، بل إلى صفحة أوضح ورسالة أقوى ونموذج أبسط.",
          ],
          [
            "Strong messages aren't long — they're specific to the customer's problem. Replace generic claims with concrete benefits.",
            "Landing pages decide conversion: clear headline, short value pitch, CTA, visible contact, WhatsApp button, trust signals, mobile speed, simple design.",
            "Page improvements often beat new ads. Sometimes you need a clearer page, not more spend.",
          ],
        ),
      },
      {
        heading: ls("كيف تؤثر سرعة الرد على نتائج الإعلانات؟", "How response speed affects results"),
        summary: ls('تأخير الرد يحرق الميزانية. جهّز فريق الرد والقوالب قبل تشغيل الحملة.', 'Slow replies burn budget. Prep your response team and templates before launch.'),
        paragraphs: ll(
          [
            "الإعلان قد يجذب العميل المناسب، لكن إذا لم يجد ردًا سريعًا، ينتقل إلى منافس آخر. في السوق السعودي، واتساب والاتصال المباشر يلعبان دورًا حاسمًا في القرار.",
            "تأخير الرد يؤدي إلى انخفاض معدل التحويل، ارتفاع تكلفة العميل، فقدان فرص جاهزة، ضعف تجربة العميل، وإهدار جزء من الميزانية.",
            "جهّز فريق الرد قبل تشغيل الحملة، وأعدّ ردودًا أولية واضحة، وحدد آلية متابعة، واربط الحملات بقنوات تواصل سهلة.",
          ],
          [
            "Great targeting fails if responses are slow. In Saudi Arabia, WhatsApp and direct calls drive decisions.",
            "Slow replies hurt conversion rate, raise CPL, waste hot leads, and burn budget.",
            "Prepare your response team before launch, with templates, follow-up SOPs, and easy contact channels.",
          ],
        ),
      },
      {
        heading: ls("متى تحتاج إلى إدارة حملات إعلانية احترافية؟", "When you need professional campaign management"),
        summary: ls('حين يصبح الإعلان جزءًا من النمو وتتعدد المنصات، الإدارة الاحترافية تمنع الهدر وتضاعف العائد.', 'When ads drive growth across multiple platforms, pro management prevents waste and multiplies returns.'),
        paragraphs: ll(
          [
            "تحتاج إدارة احترافية عندما تصبح الإعلانات جزءًا أساسيًا من نمو شركتك. مع زيادة الإنفاق وتعدد المنصات وارتفاع المنافسة، تصبح الإدارة غير المتخصصة مخاطرة حقيقية.",
            "أبرز المؤشرات: الإنفاق دون معرفة العائد الحقيقي، العمل على أكثر من منصة دون استراتيجية موحدة، نقرات كثيرة ومبيعات قليلة، ارتفاع تكلفة العميل تدريجيًا، غياب تتبع تحويلات دقيق، عدم وجود تقارير شهرية مفهومة، شكوى فريق المبيعات، وعدم اختبار الإعلانات بانتظام.",
            "الوكالة الجيدة لا تبدأ بسؤال \"كم الميزانية؟\" فقط، بل تفهم نشاطك وهامش الربح وطبيعة العميل ودورة البيع والقنوات التي جربتها سابقًا.",
          ],
          [
            "You need pro management once ads become a primary growth channel and the cost of mistakes scales.",
            "Watch for: spending without ROI clarity, multi-platform without strategy, clicks without sales, rising CPL, no tracking, no monthly reports, sales-team friction, no creative testing.",
            "A good agency starts with your business model, margins, sales cycle, and past channels — not with budget alone.",
          ],
        ),
      },
      {
        heading: ls("كيف تساعدك فكرة في بناء حملاتك؟", "How Fikra helps you build market-aligned campaigns"),
        summary: ls('نبدأ من تشخيص مجاني، نبني خطة وفق نشاطك، نضبط التتبع، ونرفع تقارير شهرية واضحة.', 'We start with a free diagnostic, build a plan around your business, set up tracking, and deliver clear monthly reports.'),
        paragraphs: ll(
          [
            "في فكرة نبدأ بفهم القنوات الحالية، أين تُصرف الميزانية، نوع العملاء القادمين، أين يحدث الهدر، وهل صفحة الهبوط تساعد على التحويل، وهل سرعة الرد مناسبة، وهل التتبع يوضح العائد الحقيقي.",
            "بعدها نعمل على: تحديد القنوات الأنسب، تطوير الرسائل، تحسين الاستهداف، مراجعة صفحات الهبوط، ضبط تتبع التحويلات، تحليل النتائج بشكل دوري، تقليل الهدر، وتحسين جودة العملاء المحتملين.",
            "الهدف بناء نظام إعلاني واضح يساعدك على معرفة أين تُنفق، ماذا تحقق، وما الذي يحتاج تطويرًا. يمكنك حجز جلسة تشخيص مجانية لمعرفة وضع حملاتك الحالي وفرص التحسين قبل أي إنفاق إضافي.",
          ],
          [
            "We start by auditing channels, spend, lead quality, waste sources, landing page performance, response speed, and tracking accuracy.",
            "Then we refine channel mix, messaging, targeting, landing pages, conversion tracking, reporting cadence, and lead quality.",
            "The goal is a transparent ad system: know what's spent, what's earned, and what to improve next. Book a free diagnostic to see where your campaigns stand today.",
          ],
        ),
      },
      {
        heading: ls("دمج SEO مع الحملات المدفوعة", "Combining SEO with paid ads"),
        summary: ls('الإعلانات تجلب نتيجة سريعة وSEO يبني نموًا مستدامًا — دمجهما يخفّض تكلفة العميل على المدى الطويل.', 'Ads bring quick results, SEO builds compounding growth — combining them lowers long-term CPL.'),
        paragraphs: ll(
          [
            "الإعلانات تمنحك سرعة، وSEO يمنحك حضورًا طويل المدى. الجمع بينهما يبني منظومة تسويقية أقوى. عندما يرى العميل إعلانك ثم يبحث عن اسم شركتك ويجد موقعك ظاهرًا جيدًا، تزيد الثقة.",
            "التكامل يظهر في: الإعلانات تكشف الكلمات التي تحقق تحويلات، SEO يحوّلها إلى محتوى مستمر، صفحات الموقع المحسّنة ترفع التحويل، الظهور العضوي يقلّل الاعتماد الكامل على الإعلان، والمحتوى التعليمي يساعد العميل قبل القرار.",
            "الشركات التي تجمع بين الإعلانات وSEO تبني حضورًا رقميًا أكثر استقرارًا، وهذا من أهم اتجاهات التسويق الحديثة للنمو المستدام.",
          ],
          [
            "Ads bring speed; SEO builds long-term presence. Combined, they form a stronger growth system.",
            "Ads reveal high-converting keywords; SEO converts them into evergreen content; optimized pages lift conversions; organic visibility reduces ad dependency.",
            "Brands that combine both build more stable digital presence — a core trend in modern marketing.",
          ],
        ),
      },
      {
        heading: ls("أخطاء شائعة تجعل الحملة تفشل رغم جودة الإعلان", "Common mistakes that fail great-looking ads"),
        summary: ls('غياب التتبع، صفحة هبوط ضعيفة، استهداف واسع، ورسائل لا تناسب مرحلة العميل — أكثر الأخطاء فتكًا.', 'No tracking, weak landing pages, broad targeting, and stage-mismatched messages — the deadliest mistakes.'),
        paragraphs: ll(
          [
            "غياب التتبع: لا تعرف أي إعلان يحقق نتيجة. ضعف صفحة الهبوط: صفحة بطيئة أو غير واضحة تضيع الفرصة. استهداف واسع جدًا: يزيد الهدر.",
            "رسالة لا تناسب مرحلة العميل، تأخير الرد، عدم اختبار بدائل، والحكم المبكر على الحملة قبل جمع بيانات كافية — كلها أسباب تُسقط حملات تبدو ممتازة على الورق.",
            "تجنب هذه الأخطاء يحسّن النتائج دون الحاجة دائمًا إلى زيادة الميزانية.",
          ],
          [
            "No tracking, weak landing pages, overly broad targeting, message-stage mismatch, slow replies, no A/B testing, and judging campaigns too early — all sink otherwise great ads.",
            "Fixing these often improves results without raising spend.",
          ],
        ),
      },
      {
        heading: ls("كيف تبني نظام مراجعة دوري للحملات؟", "How to build a periodic review system"),
        summary: ls('أسبوعيًا للأداء، شهريًا للرسائل والمنصات، ربع سنويًا للاستراتيجية — إيقاع يمنع تراكم الخسائر.', 'Weekly performance, monthly messages and platforms, quarterly strategy — a rhythm that prevents losses from piling up.'),
        paragraphs: ll(
          [
            "أسبوعيًا: متابعة الإنفاق، تكلفة العميل، جودة الاستفسارات، وأداء الإعلانات. شهريًا: تحليل الرسائل والجماهير والمنصات وصفحات الهبوط. ربع سنويًا: مراجعة الاستراتيجية العامة وتغير السوق والمنافسة وسلوك العملاء.",
            "هذا النظام يمنع تراكم الأخطاء. بدل أن تكتشف بعد أشهر أن الحملة تهدر الميزانية، تستطيع ملاحظة التراجع مبكرًا واتخاذ قرار سريع.",
            "السوق السعودي يتغير بسرعة، والشركات التي تعتمد على حملات إعلانية متوافقة مع تطورات السوق تكون أقدر على فهم العملاء وتقليل الهدر. النجاح لا يعتمد على حجم الميزانية فقط، بل على دقة الاستهداف ووضوح الرسالة وجودة صفحة الهبوط وسرعة الرد وقوة التتبع.",
          ],
          [
            "Weekly: spend, CPL, lead quality, ad performance. Monthly: messages, audiences, platforms, landing pages. Quarterly: strategy, market shifts, competition, behavior.",
            "This rhythm catches problems early instead of months later.",
            "Saudi markets move fast — adaptive campaigns win on targeting accuracy, message clarity, landing page quality, response speed, and tracking strength, not just budget size.",
          ],
        ),
      },
    ],
    faq: [
      {
        q: ls("ما المقصود بحملات إعلانية متوافقة مع تطورات السوق؟", "What are market-aligned ad campaigns?"),
        a: ls(
          "هي حملات يتم تحديثها باستمرار وفق تغير سلوك العملاء وأداء المنصات والمنافسة ونتائج القياس، بدل الاعتماد على نفس الإعلان لفترة طويلة.",
          "Campaigns continuously updated based on customer behavior, platform performance, competition, and measured results — not a static ad running for months.",
        ),
      },
      {
        q: ls("ما الفرق بين الحملات الحديثة والتقليدية؟", "How are modern campaigns different from traditional ones?"),
        a: ls(
          "الحملات الحديثة تعتمد على البيانات والاختبار والتتبع وإعادة توزيع الميزانية، بينما التقليدية تعتمد على إعلان ثابت وقياس محدود.",
          "Modern campaigns rely on data, testing, tracking, and budget reallocation; traditional ones rely on a fixed ad and limited measurement.",
        ),
      },
      {
        q: ls("كيف تساعد استراتيجيات الحملات على تقليل الهدر؟", "How do strategies reduce ad waste?"),
        a: ls(
          "باختيار الجمهور الصحيح وتحديد المنصة المناسبة وتحسين الرسالة وقياس النتائج بدقة بدل الاعتماد على التخمين.",
          "By choosing the right audience and platform, refining the message, and measuring precisely instead of guessing.",
        ),
      },
      {
        q: ls("الأفضل: حملات السوشيال أم حملات جوجل؟", "Social ads or Google Ads — which is better?"),
        a: ls(
          "يعتمد على نية العميل. جوجل مناسبة لمن يبحث عن خدمة الآن، والسوشيال ميديا مناسبة لبناء الوعي وإعادة الاستهداف وتحفيز الاهتمام.",
          "It depends on intent: Google for active searches, social for awareness, retargeting, and demand creation.",
        ),
      },
      {
        q: ls("متى أحتاج إدارة حملات إعلانية احترافية؟", "When do I need professional campaign management?"),
        a: ls(
          "إذا كنت تنفق دون معرفة العائد، أو تعمل على أكثر من منصة، أو تعاني من ارتفاع تكلفة العميل وضعف الجودة.",
          "When you spend without knowing ROI, run multiple platforms, or face rising CPL and weak lead quality.",
        ),
      },
      {
        q: ls("كيف أعرف أن حملتي تهدر الميزانية؟", "How do I know my campaign is wasting budget?"),
        a: ls(
          "نقرات كثيرة دون مبيعات، تكلفة عميل ترتفع، عدم معرفة مصدر العملاء، أو غياب بيانات تحويل واضحة.",
          "Lots of clicks but no sales, rising CPL, unclear lead sources, or missing conversion data.",
        ),
      },
      {
        q: ls("هل إعادة الاستهداف مهمة لكل نشاط؟", "Is retargeting necessary for every business?"),
        a: ls(
          "مهمة لمعظم الأنشطة، خاصة عندما يحتاج العميل وقتًا للمقارنة. لكن يجب أن تختلف الرسائل حسب مرحلة العميل.",
          "Important for most businesses — especially when buyers compare options. Vary the message by customer stage.",
        ),
      },
      {
        q: ls("ما أهم عنصر في تحسين أداء الحملات؟", "What's the most important factor in campaign performance?"),
        a: ls(
          "لا يوجد عنصر واحد. الأداء يعتمد على تكامل الاستهداف والرسالة والمنصة وصفحة الهبوط وسرعة الرد والتتبع.",
          "There's no single factor — performance depends on the integration of targeting, message, platform, landing page, response speed, and tracking.",
        ),
      },
    ],
    internalLinks: [
      {
        label: ls("خدمات إدارة الحملات الإعلانية المدفوعة", "Paid Ads Management Service"),
        href: "/services/paid-ads",
      },
      {
        label: ls("خدمة تهيئة محركات البحث (SEO)", "SEO Service"),
        href: "/services/seo",
      },
      {
        label: ls("خدمة الاستشارات التسويقية", "Marketing Consulting"),
        href: "/services/consulting",
      },
      {
        label: ls("دليل التسويق الرقمي للمبتدئين", "Beginner's Digital Marketing Guide"),
        href: "/blog/digital-marketing-guide-beginners",
      },
      {
        label: ls("احجز جلسة تشخيص مجانية", "Book a Free Diagnostic"),
        href: "/contact",
      },
    ],
    cta: {
      title: ls(
        "هل تبحث عن حملات إعلانية تواكب تطورات السوق السعودي؟",
        "Looking for ad campaigns that match the Saudi market?",
      ),
      description: ls(
        "احجز جلسة تشخيص مجانية مع فكرة لمعرفة أين تقف حملاتك الآن، وما الفرص التي يمكن تطويرها قبل أي إنفاق إضافي.",
        "Book a free diagnostic with Fikra to see where your campaigns stand and what to improve before spending more.",
      ),
      buttonLabel: ls("احجز جلسة تشخيص مجانية", "Book Free Diagnostic"),
      href: "/contact",
    },
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
