-- Vireoka Investor Portal schema additions (Supabase / Postgres)

-- 1) Investors table: NDA versioning + expiry + engagement score + hot alert state
alter table if exists public.investors
  add column if not exists nda_version_accepted text,
  add column if not exists nda_accepted_at timestamptz,
  add column if not exists access_expires_at timestamptz,
  add column if not exists engagement_score numeric default 0,
  add column if not exists hot_alerted_at timestamptz;

-- Helpful index for admin / dashboard
create index if not exists investors_engagement_score_idx
  on public.investors (engagement_score desc);

create index if not exists investors_access_expires_at_idx
  on public.investors (access_expires_at);

-- 2) Investor events table (if you already have this, keep it; otherwise create)
create table if not exists public.investor_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  email text not null,
  type text not null,
  path text,
  ip text,
  user_agent text,
  meta jsonb
);

create index if not exists investor_events_email_created_idx
  on public.investor_events (email, created_at desc);

create index if not exists investor_events_type_created_idx
  on public.investor_events (type, created_at desc);

-- 3) Optional: access requests (public "request access" flow)
create table if not exists public.investor_access_requests (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  email text not null,
  firm text,
  message text,
  status text not null default 'new'
);

create index if not exists investor_access_requests_created_idx
  on public.investor_access_requests (created_at desc);

