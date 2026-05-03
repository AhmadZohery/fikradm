
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS tldr_ar text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tldr_en text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS section_summaries jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS author_bio_ar text,
  ADD COLUMN IF NOT EXISTS author_bio_en text,
  ADD COLUMN IF NOT EXISTS author_role_ar text,
  ADD COLUMN IF NOT EXISTS author_role_en text,
  ADD COLUMN IF NOT EXISTS last_reviewed timestamptz,
  ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb;
