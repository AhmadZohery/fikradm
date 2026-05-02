create table if not exists public.seo_audit_reports (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  total_pages integer not null default 0,
  total_warnings integer not null default 0,
  total_errors integer not null default 0,
  summary jsonb not null default '{}'::jsonb,
  details jsonb not null default '[]'::jsonb
);

create index if not exists seo_audit_reports_ran_at_idx
  on public.seo_audit_reports (ran_at desc);

alter table public.seo_audit_reports enable row level security;

create policy "Admins read seo audit reports"
on public.seo_audit_reports
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins insert seo audit reports"
on public.seo_audit_reports
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));