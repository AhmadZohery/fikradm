ALTER PUBLICATION supabase_realtime ADD TABLE public.form_submissions;
ALTER TABLE public.form_submissions REPLICA IDENTITY FULL;