-- Restrict media_library SELECT to staff only (public site uses direct bucket URLs)
DROP POLICY IF EXISTS "Anyone reads media" ON public.media_library;
CREATE POLICY "Staff read media"
  ON public.media_library FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

-- Restrict public site_settings reads to an explicit allowlist of public keys.
-- 'contact', 'announcement', 'navigation', 'brand' are rendered on the public site.
-- 'admin_notifications' (and any future internal key) is excluded by default.
DROP POLICY IF EXISTS "Public reads non-sensitive settings" ON public.site_settings;
CREATE POLICY "Public reads allowlisted settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (key = ANY (ARRAY['contact','announcement','navigation','brand']));