
CREATE TABLE public.seo_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  date date NOT NULL,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  ctr numeric(6,4) NOT NULL DEFAULT 0,
  position numeric(6,2) NOT NULL DEFAULT 0,
  query text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'manual',
  captured_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(url, date, query)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_metrics TO authenticated;
GRANT ALL ON public.seo_metrics TO service_role;
ALTER TABLE public.seo_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read seo_metrics" ON public.seo_metrics FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write seo_metrics" ON public.seo_metrics FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX idx_seo_metrics_url_date ON public.seo_metrics(url, date DESC);

CREATE TABLE public.seo_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('rank_drop','stale_content','high_impressions_low_ctr','traffic_drop')),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  title text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','resolved','dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_alerts TO authenticated;
GRANT ALL ON public.seo_alerts TO service_role;
ALTER TABLE public.seo_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read seo_alerts" ON public.seo_alerts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write seo_alerts" ON public.seo_alerts FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX idx_seo_alerts_status ON public.seo_alerts(status, created_at DESC);
CREATE TRIGGER trg_seo_alerts_updated BEFORE UPDATE ON public.seo_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.web_vitals (
  id bigserial PRIMARY KEY,
  url text NOT NULL,
  metric text NOT NULL CHECK (metric IN ('LCP','CLS','INP','FCP','TTFB')),
  value numeric NOT NULL,
  rating text CHECK (rating IN ('good','needs-improvement','poor')),
  device text,
  navigation_type text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.web_vitals TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.web_vitals_id_seq TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.web_vitals TO authenticated;
GRANT ALL ON public.web_vitals TO service_role;
ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert vitals" ON public.web_vitals FOR INSERT
  WITH CHECK (
    char_length(url) <= 512
    AND value >= 0 AND value <= 100000
    AND (device IS NULL OR char_length(device) <= 32)
    AND (session_id IS NULL OR char_length(session_id) <= 128)
  );
CREATE POLICY "Staff read vitals" ON public.web_vitals FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE INDEX idx_vitals_metric_created ON public.web_vitals(metric, created_at DESC);
CREATE INDEX idx_vitals_url_created ON public.web_vitals(url, created_at DESC);

CREATE TABLE public.performance_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  notes text,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.performance_snapshots TO authenticated;
GRANT ALL ON public.performance_snapshots TO service_role;
ALTER TABLE public.performance_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage snapshots" ON public.performance_snapshots FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
