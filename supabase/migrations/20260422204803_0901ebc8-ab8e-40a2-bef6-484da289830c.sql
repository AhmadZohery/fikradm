
-- Add scheduled_publish_at + scheduled_unpublish_at to content tables
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMPTZ;
ALTER TABLE public.industries ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE public.industries ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMPTZ;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMPTZ;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMPTZ;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMPTZ;

-- Function: apply scheduled publish/unpublish across all content tables.
CREATE OR REPLACE FUNCTION public.apply_scheduled_publishing()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Boolean-flag tables
  UPDATE public.services SET is_published = true, scheduled_publish_at = NULL
    WHERE is_published = false AND scheduled_publish_at IS NOT NULL AND scheduled_publish_at <= now();
  UPDATE public.services SET is_published = false, scheduled_unpublish_at = NULL
    WHERE is_published = true AND scheduled_unpublish_at IS NOT NULL AND scheduled_unpublish_at <= now();

  UPDATE public.industries SET is_published = true, scheduled_publish_at = NULL
    WHERE is_published = false AND scheduled_publish_at IS NOT NULL AND scheduled_publish_at <= now();
  UPDATE public.industries SET is_published = false, scheduled_unpublish_at = NULL
    WHERE is_published = true AND scheduled_unpublish_at IS NOT NULL AND scheduled_unpublish_at <= now();

  UPDATE public.locations SET is_published = true, scheduled_publish_at = NULL
    WHERE is_published = false AND scheduled_publish_at IS NOT NULL AND scheduled_publish_at <= now();
  UPDATE public.locations SET is_published = false, scheduled_unpublish_at = NULL
    WHERE is_published = true AND scheduled_unpublish_at IS NOT NULL AND scheduled_unpublish_at <= now();

  -- Status-based tables (blog uses 'scheduled' status + published_at)
  UPDATE public.blog_posts SET status = 'published'
    WHERE status = 'scheduled' AND published_at IS NOT NULL AND published_at <= now();
  UPDATE public.blog_posts SET status = 'draft', scheduled_unpublish_at = NULL
    WHERE status = 'published' AND scheduled_unpublish_at IS NOT NULL AND scheduled_unpublish_at <= now();

  UPDATE public.pages SET status = 'published', published_at = COALESCE(published_at, now()), scheduled_publish_at = NULL
    WHERE status = 'draft' AND scheduled_publish_at IS NOT NULL AND scheduled_publish_at <= now();
  UPDATE public.pages SET status = 'draft', scheduled_unpublish_at = NULL
    WHERE status = 'published' AND scheduled_unpublish_at IS NOT NULL AND scheduled_unpublish_at <= now();
END;
$$;

-- Schedule via pg_cron every minute
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'apply-scheduled-publishing') THEN
    PERFORM cron.unschedule('apply-scheduled-publishing');
  END IF;
END $$;

SELECT cron.schedule(
  'apply-scheduled-publishing',
  '* * * * *',
  $$ SELECT public.apply_scheduled_publishing(); $$
);
