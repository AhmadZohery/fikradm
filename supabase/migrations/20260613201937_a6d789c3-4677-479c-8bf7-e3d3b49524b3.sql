UPDATE public.site_settings
SET data = data
  || jsonb_build_object('phone', '+966569629773')
  || jsonb_build_object('whatsapp', '+966569629773'),
  updated_at = now()
WHERE key = 'contact';