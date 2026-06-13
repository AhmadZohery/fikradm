DROP POLICY IF EXISTS "Anyone can submit form" ON public.form_submissions;
CREATE POLICY "Anyone can submit form" ON public.form_submissions FOR INSERT WITH CHECK (
  char_length(form_name) BETWEEN 1 AND 64
  AND (source_page IS NULL OR char_length(source_page) <= 512)
  AND (locale IS NULL OR char_length(locale) <= 8)
  AND is_read = false
  AND is_archived = false
  AND pg_column_size(payload) <= 16384
);