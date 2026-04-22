-- Add blog_revisions table for version history of blog posts
CREATE TABLE IF NOT EXISTS public.blog_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_revisions_post_created
  ON public.blog_revisions(post_id, created_at DESC);

ALTER TABLE public.blog_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view blog revisions"
  ON public.blog_revisions FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff create blog revisions"
  ON public.blog_revisions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff delete blog revisions"
  ON public.blog_revisions FOR DELETE
  TO authenticated
  USING (public.is_staff(auth.uid()));