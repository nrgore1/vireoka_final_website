-- ADDITIVE: introduces role support without touching auth/users or existing flows

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('USER','INVESTOR','INVESTOR_ADMIN')),
  assigned_at timestamptz not null default now(),
  assigned_by uuid null references auth.users(id),
  primary key (user_id, role)
);

create index if not exists idx_user_roles_role on public.user_roles(role);

-- Helper: role checks (RLS-safe)
create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = role_name
  );
$$;

create or replace function public.is_investor_admin()
returns boolean
language sql
stable
as $$
  select public.has_role('INVESTOR_ADMIN');
$$;
