DROP POLICY IF EXISTS "Anyone reads settings" ON public.site_settings;
CREATE POLICY "Public reads non-sensitive settings" ON public.site_settings FOR SELECT USING (key <> 'admin_notifications');
CREATE POLICY "Staff read all settings" ON public.site_settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Anyone can record page view" ON public.page_views;
CREATE POLICY "Anyone can record page view" ON public.page_views FOR INSERT WITH CHECK (
  country IS NULL
  AND device IS NULL
  AND char_length(page_slug) <= 256
  AND (path IS NULL OR char_length(path) <= 512)
  AND (locale IS NULL OR char_length(locale) <= 8)
  AND (referrer IS NULL OR char_length(referrer) <= 1024)
  AND (user_agent IS NULL OR char_length(user_agent) <= 512)
  AND (session_id IS NULL OR char_length(session_id) <= 128)
);

DROP POLICY IF EXISTS "Public read cms-uploads" ON storage.objects;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'form_submissions'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.form_submissions';
  END IF;
END $$;

REVOKE ALL ON FUNCTION public.handle_new_user()            FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_first_user_admin()    FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column()   FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_scheduled_publishing() FROM PUBLIC, anon, authenticated;