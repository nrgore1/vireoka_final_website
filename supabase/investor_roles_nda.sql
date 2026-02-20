-- ---------- Roles (role-based admin permissions) ----------
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','investor_admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create or replace function public.is_investor_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = uid
      and ur.role in ('admin','investor_admin')
  );
$$;

-- ---------- NDA: expiring links + e-signature tracking ----------
create table if not exists public.investor_nda_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.investor_applications(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

create index if not exists investor_nda_links_app_idx on public.investor_nda_links(application_id);
create index if not exists investor_nda_links_expires_idx on public.investor_nda_links(expires_at);

create table if not exists public.investor_nda_signatures (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.investor_applications(id) on delete cascade,
  signed_at timestamptz not null default now(),
  signer_email text,
  signer_name text,
  ip text,
  user_agent text,
  nda_version text not null default 'v1',
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists investor_nda_signatures_app_uniq on public.investor_nda_signatures(application_id);

-- ---------- Audit logs (if you already created it, this is idempotent) ----------
create table if not exists public.investor_application_audit_logs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.investor_applications(id) on delete cascade,
  action text not null,
  performed_by uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- Optional: tighten status check to match your app ----------
-- If your current check constraint allows only submitted/approved/rejected,
-- ensure your default is 'submitted' (NOT 'pending').
alter table public.investor_applications
  alter column status set default 'submitted';

-- ---------- RLS suggestions (optional; you can keep service-role on server too) ----------
-- Enable RLS if you want DB-side enforcement for admin reads / own reads.
-- NOTE: you previously saw relrowsecurity=false; enable only when ready.
-- alter table public.investor_applications enable row level security;
-- alter table public.investor_application_audit_logs enable row level security;
-- alter table public.investor_nda_links enable row level security;
-- alter table public.investor_nda_signatures enable row level security;

-- Admin can read everything (when RLS enabled)
-- create policy "admin_read_investor_applications"
-- on public.investor_applications for select
-- to authenticated
-- using (public.is_investor_admin());

-- create policy "admin_read_audit_logs"
-- on public.investor_application_audit_logs for select
-- to authenticated
-- using (public.is_investor_admin());
