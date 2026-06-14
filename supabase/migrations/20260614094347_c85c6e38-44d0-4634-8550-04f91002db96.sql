
-- 1) Spam + attribution columns on form_submissions
ALTER TABLE public.form_submissions
  ADD COLUMN IF NOT EXISTS spam_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS spam_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS spam_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID,
  ADD COLUMN IF NOT EXISTS attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS attribution_source TEXT,
  ADD COLUMN IF NOT EXISTS attribution_medium TEXT,
  ADD COLUMN IF NOT EXISTS attribution_campaign TEXT,
  ADD COLUMN IF NOT EXISTS click_id TEXT,
  ADD COLUMN IF NOT EXISTS first_touch_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_touch_at TIMESTAMPTZ;

DO $$ BEGIN
  ALTER TABLE public.form_submissions
    ADD CONSTRAINT form_submissions_spam_status_check
    CHECK (spam_status IN ('pending','approved','rejected','auto_approved','auto_rejected'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_submissions_spam_status
  ON public.form_submissions (spam_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_attr_source
  ON public.form_submissions (attribution_source);

-- Backfill: existing rows treated as approved so the leads list stays unchanged
UPDATE public.form_submissions SET spam_status = 'approved'
  WHERE spam_status = 'pending' AND created_at < now() - interval '1 minute';

-- 2) spam_rules — configurable rules
CREATE TABLE IF NOT EXISTS public.spam_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  pattern TEXT NOT NULL,
  field TEXT NOT NULL DEFAULT 'any',
  weight INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT spam_rules_type_check CHECK (rule_type IN ('keyword','regex','email_domain','link_count','min_length','blocklist_ip')),
  CONSTRAINT spam_rules_field_check CHECK (field IN ('any','message','email','name','phone','company','source'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spam_rules TO authenticated;
GRANT ALL ON public.spam_rules TO service_role;
ALTER TABLE public.spam_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read spam_rules" ON public.spam_rules FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write spam_rules" ON public.spam_rules FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_spam_rules_updated BEFORE UPDATE ON public.spam_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sensible defaults
INSERT INTO public.spam_rules (name, rule_type, pattern, field, weight) VALUES
  ('SEO outreach spam', 'keyword', 'seo services|backlinks|rank #1|guest post', 'message', 40),
  ('Crypto spam', 'keyword', 'crypto|bitcoin|forex|investment opportunity', 'message', 35),
  ('Casino/gambling', 'keyword', 'casino|gambling|betting|poker', 'message', 50),
  ('Disposable email', 'email_domain', 'mailinator.com|tempmail|guerrillamail|10minutemail', 'email', 60),
  ('Excessive links', 'link_count', '3', 'message', 25),
  ('Too short message', 'min_length', '15', 'message', 15)
ON CONFLICT DO NOTHING;

-- 3) SEO alerts workflow columns
ALTER TABLE public.seo_alerts
  ADD COLUMN IF NOT EXISTS assigned_to UUID,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS owner_note TEXT,
  ADD COLUMN IF NOT EXISTS task_url TEXT;

-- Add 'in_progress' status (replace constraint)
ALTER TABLE public.seo_alerts DROP CONSTRAINT IF EXISTS seo_alerts_status_check;
ALTER TABLE public.seo_alerts ADD CONSTRAINT seo_alerts_status_check
  CHECK (status IN ('open','new','in_progress','acknowledged','resolved','dismissed'));

-- 4) seo_alert_notes — comments / tasks per alert
CREATE TABLE IF NOT EXISTS public.seo_alert_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID NOT NULL REFERENCES public.seo_alerts(id) ON DELETE CASCADE,
  author_id UUID,
  body TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'note',
  is_done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seo_alert_notes_kind_check CHECK (kind IN ('note','task','status_change'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_alert_notes TO authenticated;
GRANT ALL ON public.seo_alert_notes TO service_role;
ALTER TABLE public.seo_alert_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read seo_alert_notes" ON public.seo_alert_notes FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write seo_alert_notes" ON public.seo_alert_notes FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX IF NOT EXISTS idx_seo_alert_notes_alert ON public.seo_alert_notes (alert_id, created_at DESC);

-- 5) monthly_reports — generated reports + delivery adapter state
CREATE TABLE IF NOT EXISTS public.monthly_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT,
  delivery_status TEXT NOT NULL DEFAULT 'draft',
  delivery_channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT monthly_reports_status_check CHECK (delivery_status IN ('draft','queued','sent','failed')),
  CONSTRAINT monthly_reports_period_unique UNIQUE (period_start, period_end)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_reports TO authenticated;
GRANT ALL ON public.monthly_reports TO service_role;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read monthly_reports" ON public.monthly_reports FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write monthly_reports" ON public.monthly_reports FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_monthly_reports_updated BEFORE UPDATE ON public.monthly_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
