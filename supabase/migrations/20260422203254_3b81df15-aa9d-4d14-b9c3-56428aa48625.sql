-- ==========================================================================
-- 1) SITE SETTINGS (key-value JSON store)
-- ==========================================================================
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Staff manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default settings
INSERT INTO public.site_settings (key, label, description, data) VALUES
  ('contact', 'معلومات التواصل', 'الواتساب، الهاتف، الإيميل، العنوان', '{
    "whatsapp": "+966500000000",
    "phone": "+966500000000",
    "email": "hello@fikra.sa",
    "address_ar": "الرياض، المملكة العربية السعودية",
    "address_en": "Riyadh, Saudi Arabia",
    "working_hours_ar": "الأحد - الخميس، 9 صباحاً - 6 مساءً",
    "working_hours_en": "Sun - Thu, 9 AM - 6 PM"
  }'::jsonb),
  ('announcement', 'شريط الإعلانات', 'الرسائل المتغيرة في الشريط العلوي', '{
    "enabled": true,
    "messages": [
      {"icon": "Gift", "ar": "استشارة مجانية + Audit شامل لموقعك", "en": "Free consultation + full website Audit", "cta_ar": "احجز الآن", "cta_en": "Book now", "href": "/contact"},
      {"icon": "Sparkles", "ar": "خصم 15% للعملاء الجدد على باقة الإطلاق", "en": "15% off launch bundle for new clients", "cta_ar": "اعرف أكثر", "cta_en": "Learn more", "href": "/services"},
      {"icon": "Phone", "ar": "تواصل واتساب مباشر مع خبراء فكرة", "en": "Direct WhatsApp chat with our experts", "cta_ar": "تواصل", "cta_en": "Chat", "href": "/contact"}
    ]
  }'::jsonb),
  ('navigation', 'القائمة الرئيسية', 'روابط الهيدر والفوتر', '{
    "header": [
      {"ar": "الرئيسية", "en": "Home", "href": "/"},
      {"ar": "خدماتنا", "en": "Services", "href": "/services"},
      {"ar": "الصناعات", "en": "Industries", "href": "/industries"},
      {"ar": "قصص نجاح", "en": "Case Studies", "href": "/case-studies"},
      {"ar": "المدونة", "en": "Blog", "href": "/blog"},
      {"ar": "من نحن", "en": "About", "href": "/about"},
      {"ar": "تواصل", "en": "Contact", "href": "/contact"}
    ],
    "footer_columns": []
  }'::jsonb),
  ('brand', 'هوية الموقع', 'اللوجو والسوشيال', '{
    "logo_url": "",
    "logo_text_ar": "فكرة",
    "logo_text_en": "Fikra",
    "tagline_ar": "وكالة تسويق رقمي مرخّصة في السعودية",
    "tagline_en": "Licensed digital marketing agency in KSA",
    "social": {
      "twitter": "",
      "instagram": "",
      "linkedin": "",
      "youtube": "",
      "tiktok": "",
      "snapchat": ""
    }
  }'::jsonb);

-- ==========================================================================
-- 2) PACKAGES (home pricing bundles)
-- ==========================================================================
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  tagline_ar TEXT,
  tagline_en TEXT,
  best_for_ar TEXT,
  best_for_en TEXT,
  price_sar INTEGER NOT NULL DEFAULT 0,
  original_price_sar INTEGER NOT NULL DEFAULT 0,
  includes_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  includes_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  cta_href TEXT NOT NULL DEFAULT '/contact',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published packages" ON public.packages FOR SELECT
  USING (is_published OR is_staff(auth.uid()));
CREATE POLICY "Staff manage packages" ON public.packages FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_packages_updated BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_packages_sort ON public.packages (sort_order);

-- Seed the 3 current bundles
INSERT INTO public.packages (slug, icon, name_ar, name_en, tagline_ar, tagline_en, best_for_ar, best_for_en, price_sar, original_price_sar, includes_ar, includes_en, is_popular, sort_order) VALUES
  ('starter', 'Sparkles', 'باقة الانطلاق', 'Starter Bundle',
    'أساس قوي لتواجدك الرقمي', 'A strong foundation for your digital presence',
    'للأنشطة الناشئة وملاك المتاجر الجدد', 'For startups and new store owners',
    4990, 6990,
    '["سيو محلي + تحسين 6 صفحات","إدارة منصة إعلانية واحدة (Meta أو Google)","12 تصميم سوشيال شهرياً","كرييتيف لـ 4 إعلانات","تقرير شهري + مكالمة استراتيجية"]'::jsonb,
    '["Local SEO + 6-page optimization","1 ad platform (Meta or Google)","12 social designs / month","Creative for 4 ads","Monthly report + strategy call"]'::jsonb,
    false, 10),
  ('growth', 'Rocket', 'باقة النمو', 'Growth Bundle',
    'الأكثر طلباً — تسويق متكامل بنتائج سريعة', 'Most popular — integrated marketing with fast results',
    'للعلامات التي تريد توسعاً حقيقياً', 'For brands ready to scale',
    12990, 16990,
    '["كل ما في باقة الانطلاق","سيو متقدم + 4 مقالات شهرياً + بناء روابط","إعلانات Meta + Google + TikTok","30 تصميم + 4 ريلز/فيديوهات شهرياً","إدارة سوشيال ميديا كاملة + Community Mgmt","Dashboard أداء حي + تقارير أسبوعية","مدير حساب مخصص"]'::jsonb,
    '["Everything in Starter","Advanced SEO + 4 articles/month + link building","Meta + Google + TikTok ads","30 designs + 4 reels/videos monthly","Full social media management + community","Live performance dashboard + weekly reports","Dedicated account manager"]'::jsonb,
    true, 20),
  ('scale', 'Crown', 'باقة الهيمنة', 'Scale Bundle',
    'للعلامات الكبرى التي تطلب الريادة', 'For market leaders who demand dominance',
    'للشركات الكبرى والعلامات المؤسسية', 'For enterprises and large brands',
    28990, 36990,
    '["كل ما في باقة النمو","سيو مؤسسي + سلطة موضوعية كاملة","حملات إعلانية على كل المنصات + ميزانيات بلا حدود","إنتاج بصري احترافي (تصوير + موشن)","موقع إلكتروني / متجر مع CRO","Dashboard مخصص + تقارير يومية","فريق مخصص (3+ متخصصين)","اتفاقية SLA ودعم 24/7"]'::jsonb,
    '["Everything in Growth","Enterprise SEO + topical authority","Ads on all platforms + unlimited budgets","Pro visual production (photo + motion)","Website / store with CRO","Custom dashboard + daily reports","Dedicated team (3+ specialists)","SLA + 24/7 support"]'::jsonb,
    false, 30);

-- ==========================================================================
-- 3) SERVICES + SUB-SERVICES
-- ==========================================================================
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Search',
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  intro_ar TEXT,
  intro_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  highlights_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title_ar TEXT,
  meta_title_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  og_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published services" ON public.services FOR SELECT
  USING (is_published OR is_staff(auth.uid()));
CREATE POLICY "Staff manage services" ON public.services FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_services_sort ON public.services (sort_order);

CREATE TABLE public.sub_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  intro_ar TEXT,
  intro_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  highlights_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title_ar TEXT,
  meta_title_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  og_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (service_id, slug)
);
ALTER TABLE public.sub_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published sub-services" ON public.sub_services FOR SELECT
  USING (is_published OR is_staff(auth.uid()));
CREATE POLICY "Staff manage sub-services" ON public.sub_services FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_sub_services_updated BEFORE UPDATE ON public.sub_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_sub_services_service ON public.sub_services (service_id, sort_order);

-- ==========================================================================
-- 4) INDUSTRIES + SUB-INDUSTRIES
-- ==========================================================================
CREATE TABLE public.industries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Building2',
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  intro_ar TEXT,
  intro_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  highlights_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title_ar TEXT,
  meta_title_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  og_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published industries" ON public.industries FOR SELECT
  USING (is_published OR is_staff(auth.uid()));
CREATE POLICY "Staff manage industries" ON public.industries FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_industries_updated BEFORE UPDATE ON public.industries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_industries_sort ON public.industries (sort_order);

CREATE TABLE public.sub_industries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry_id UUID NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  intro_ar TEXT,
  intro_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  highlights_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title_ar TEXT,
  meta_title_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  og_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (industry_id, slug)
);
ALTER TABLE public.sub_industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published sub-industries" ON public.sub_industries FOR SELECT
  USING (is_published OR is_staff(auth.uid()));
CREATE POLICY "Staff manage sub-industries" ON public.sub_industries FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_sub_industries_updated BEFORE UPDATE ON public.sub_industries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_sub_industries_industry ON public.sub_industries (industry_id, sort_order);

-- ==========================================================================
-- 5) LOCATIONS (city pages for local SEO)
-- ==========================================================================
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  city_ar TEXT NOT NULL,
  city_en TEXT NOT NULL,
  region_ar TEXT,
  region_en TEXT,
  intro_ar TEXT,
  intro_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  highlights_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title_ar TEXT,
  meta_title_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  og_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published locations" ON public.locations FOR SELECT
  USING (is_published OR is_staff(auth.uid()));
CREATE POLICY "Staff manage locations" ON public.locations FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_locations_updated BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_locations_sort ON public.locations (sort_order);

-- ==========================================================================
-- 6) BLOG (categories + posts)
-- ==========================================================================
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published blog categories" ON public.blog_categories FOR SELECT
  USING (is_published OR is_staff(auth.uid()));
CREATE POLICY "Staff manage blog categories" ON public.blog_categories FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_blog_categories_updated BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  meta_title_ar TEXT,
  meta_title_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  keywords_ar TEXT[],
  keywords_en TEXT[],
  author_ar TEXT,
  author_en TEXT,
  reading_minutes INTEGER NOT NULL DEFAULT 5,
  cover_image_url TEXT,
  table_of_contents_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  table_of_contents_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  internal_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published blog posts" ON public.blog_posts FOR SELECT
  USING (status = 'published' OR is_staff(auth.uid()));
CREATE POLICY "Staff manage blog posts" ON public.blog_posts FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_blog_posts_status ON public.blog_posts (status, published_at DESC);
CREATE INDEX idx_blog_posts_category ON public.blog_posts (category_id);