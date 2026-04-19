

# موقع فكرة للتسويق الرقمي — المرحلة الأولى (Frontend كامل)

موقع احترافي ثنائي اللغة (عربي/إنجليزي) مستوحى من تصميم Consultio Marketing 2، بهوية فكرة البنفسجية، يركّز على تجربة المستخدم، السرعة، والـ SEO. المحتوى مأخوذ من ملفك الموجود. الـ CMS والـ Block Builder يأتي في مرحلة ثانية.

## 1. نظام التصميم (Design System)

- **الألوان**: بنفسجي فكرة `#5b4fe0` كلون أساسي + تدرجات داكنة وفاتحة، خلفيات فاتحة نظيفة، ألوان تمييز للحالات.
- **Typography**: خط `IBM Plex Sans Arabic` للعربي + `Inter` للإنجليزي. سلّم أحجام واضح (Display/H1–H6/Body/Small).
- **Spacing & Grid**: نظام 8px، حاوية max-width موحّدة، شبكة 12 عمود.
- **Components**: أزرار (Primary/Secondary/Ghost/CTA كبير)، كروت خدمات، كروت قطاعات، كروت باقات، badges، forms، breadcrumbs.
- **Section patterns**: Hero مع slider خفيف، Stats counters، Feature grids، Process steps، Testimonials، Logos strip، CTA bands، FAQ accordions.
- **حركات**: scroll reveals خفيفة، hover states سلسة، تحوّلات بين الصفحات ناعمة.

## 2. اللغة والاتجاه (i18n + RTL/LTR)

- لغتان: `ar` (افتراضي، RTL) و `en` (LTR) — مسارات `/ar/...` و `/en/...`.
- مبدّل لغة في الهيدر، تخزين الاختيار، redirect ذكي.
- `hreflang` لكل صفحة بين النسختين، metadata مستقل لكل لغة.
- خطوط ومسافات مضبوطة لكل اتجاه (mirroring حقيقي).

## 3. هيكل الصفحات (Routes منفصلة لكل صفحة)

كل صفحة = route مستقل بـ SSR و meta/OG/schema خاصة بها.

**رئيسية وعامة**
- `/` الرئيسية: Hero slider، أرقام الأثر، الحلول حسب القطاع، الخدمات، قصص نجاح مختارة، شركاء، شهادات، CTA استشارة.
- `/about` من نحن
- `/contact` احجز استشارتك (نموذج متقدم: حقول شرطية، التقاط UTM، حماية spam)
- `/case-studies` + `/case-studies/$slug`
- `/blog` + `/blog/$slug` + `/blog/category/$slug`

**حلول حسب القطاع** (كل واحدة landing page كاملة بباقات خاصة)
- `/industries/ecommerce` (متاجر الأزياء والنظارات، الأجهزة الذكية)
- `/industries/logistics`
- `/industries/healthcare`
- `/industries/real-estate`

**الخدمات** (Mega Menu + صفحة لكل خدمة كـ landing)
- SEO: `/services/seo` + `seo/technical-audit` + `seo/local-seo` + `seo/link-building`
- Performance: `/services/performance` + `google-ads` + `social-ads`
- Creative: `/services/creative` + `branding` + `video-motion` + `content-writing`
- Web: `/services/web` + `wordpress` + `ecommerce-dev` + `crm-erp`
- صفحات إضافية من ملفك: خطة تسويقية، هوية بصرية، تطوير مواقع، تطبيقات جوال، حلول AI Agents…

**Local SEO** (في الفوتر)
- `/locations/digital-marketing-dubai`
- `/locations/seo-agency-riyadh`
- `/locations/web-design-cairo`

## 4. نظام الباقات

- لكل خدمة وكل قطاع: 3 باقات (Starter / Growth / Enterprise) بأسماء مبتكرة خاصة بالقسم (مثلاً للقطاع الطبي: "بداية العيادة" / "نمو العيادة" / "سلسلة عيادات").
- أسعار واضحة بالريال السعودي + شارة "خصم %" + سعر مشطوب.
- مقارنة الباقات (جدول features)، CTA لكل باقة، باقة موصى بها مميّزة.
- Schema: `Service` + `Offer` لكل باقة.

## 5. SEO & Performance & Schema (إلزامي على كل صفحة)

- SSR كامل عبر TanStack Start.
- لكل صفحة: meta title/description مخصصة، OG/Twitter، canonical، hreflang، JSON-LD schema (Organization على الجذر، Service، LocalBusiness، BreadcrumbList، FAQPage، Article).
- `sitemap.xml` و `robots.txt` ديناميكية.
- Core Web Vitals: تحميل صور lazy + WebP، خطوط preload، تقسيم كود، حدود حركة CLS.
- محتوى مهيكل لـ AEO/LLMO (FAQs، إجابات مباشرة، تعريفات).

## 6. تجربة المستخدم

- Header شفاف + Mega Menu للخدمات والقطاعات.
- Slider هيرو خفيف (3 شرائح) مع autoplay قابل للإيقاف.
- روابط داخلية ذكية (Related Services / Related Articles) في كل صفحة.
- WhatsApp floating button + زر "احجز استشارتك" ثابت.
- Breadcrumbs على كل الصفحات الداخلية.
- ريسبونسف كامل، اختصارات لمسات على الموبايل.
- Cookie consent banner.

## 7. الوصولية (Accessibility)

تباين ألوان مضبوط (AA)، keyboard navigation، focus states واضحة، semantic landmarks، ARIA حيث لزم، أحجام خط قابلة للقراءة.

## 8. النموذج (Contact / Lead Form)

نموذج متعدد الخطوات: نوع الخدمة → القطاع → الميزانية → بيانات التواصل. مع التقاط UTM مخفي، تحقّق صحة، رسالة شكر، وإمكانية إرسال البيانات لاحقاً عبر webhook (تُربط في مرحلة ثانية).

## 9. المحتوى

استخدام محتوى ملف "محتوي فكره.docx" للصفحات المتاحة (الخطة التسويقية، الهوية البصرية، تطوير المواقع، السوشيال ميديا، إنتاج الفيديو، تطبيقات الجوال، AI Agents). الصفحات الباقية تأخذ محتوى أولي محترف بنفس النبرة قابل للتعديل لاحقاً من الـ CMS.

## 10. الصور

صور Unsplash احترافية مختارة بعناية (تسويق، فرق عمل، شاشات تحليلات، قطاعات الصحة/العقار/اللوجستيات/التجارة). الشعار `FIKRA_LOGO.jpg` يُضاف في الهيدر والفوتر و OG.

## ما ليس في هذه المرحلة (يأتي في مرحلة 2)

Block Builder drag&drop، RBAC، Versioning، Media Library، Redirects Manager، Schema Manager UI، Internal Linking Assistant، AI image generation، Analytics dashboard، نظام صلاحيات ومراحل نشر.

بعد إطلاق هذه المرحلة وتثبيت التصميم والمحتوى، نبدأ مرحلة الـ Backend/CMS على نفس البنية بدون إعادة بناء.

