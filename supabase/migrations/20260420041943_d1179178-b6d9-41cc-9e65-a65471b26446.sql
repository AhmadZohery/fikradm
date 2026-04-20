
-- ============= ENUMS =============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE public.page_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.page_type AS ENUM ('home', 'about', 'contact', 'service', 'service_sub', 'industry', 'industry_sub', 'location', 'case_studies', 'custom');

-- ============= UTILITY: updated_at trigger =============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============= USER ROLES =============
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check any of admin/editor
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============= AUTO-BOOTSTRAP FIRST ADMIN =============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If no admin exists, make this user admin; otherwise default viewer
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'viewer');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============= PAGES =============
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'ar',
  page_type public.page_type NOT NULL DEFAULT 'custom',
  parent_slug TEXT,
  title TEXT NOT NULL,
  status public.page_status NOT NULL DEFAULT 'draft',

  -- Block-based content
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  keywords TEXT[],
  no_index BOOLEAN NOT NULL DEFAULT false,
  json_ld JSONB,

  -- Audit
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE (slug, locale)
);

CREATE INDEX idx_pages_slug_locale ON public.pages(slug, locale);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_pages_type ON public.pages(page_type);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published pages"
  ON public.pages FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff manage pages"
  ON public.pages FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= PAGE REVISIONS =============
CREATE TABLE public.page_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_revisions_page ON public.page_revisions(page_id, created_at DESC);

ALTER TABLE public.page_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view revisions"
  ON public.page_revisions FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff create revisions"
  ON public.page_revisions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- ============= SHARED BLOCKS =============
CREATE TABLE public.shared_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  block_type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  locale TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads shared blocks"
  ON public.shared_blocks FOR SELECT
  USING (true);

CREATE POLICY "Staff manage shared blocks"
  ON public.shared_blocks FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER update_shared_blocks_updated_at
  BEFORE UPDATE ON public.shared_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= MEDIA LIBRARY =============
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_folder ON public.media_library(folder);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads media"
  ON public.media_library FOR SELECT
  USING (true);

CREATE POLICY "Staff manage media"
  ON public.media_library FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- ============= PAGE VIEWS (analytics) =============
CREATE TABLE public.page_views (
  id BIGSERIAL PRIMARY KEY,
  page_slug TEXT NOT NULL,
  locale TEXT,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  device TEXT,
  session_id TEXT,
  path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_slug ON public.page_views(page_slug, created_at DESC);
CREATE INDEX idx_page_views_session ON public.page_views(session_id);
CREATE INDEX idx_page_views_created ON public.page_views(created_at DESC);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record page view"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read analytics"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

-- ============= FORM SUBMISSIONS =============
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_name TEXT NOT NULL,
  payload JSONB NOT NULL,
  source_page TEXT,
  locale TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_submissions_created ON public.form_submissions(created_at DESC);
CREATE INDEX idx_submissions_unread ON public.form_submissions(is_read) WHERE is_read = false;

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit form"
  ON public.form_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff read submissions"
  ON public.form_submissions FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff update submissions"
  ON public.form_submissions FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Admins delete submissions"
  ON public.form_submissions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============= STORAGE BUCKET =============
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-uploads', 'cms-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read cms-uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-uploads');

CREATE POLICY "Staff upload cms-uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cms-uploads' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update cms-uploads"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cms-uploads' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff delete cms-uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-uploads' AND public.is_staff(auth.uid()));
