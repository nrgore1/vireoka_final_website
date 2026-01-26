-- ADDITIVE: explicit, time-bound investor portal entitlement.
-- This does NOT change existing investor_applications logic; it complements it.

create table if not exists public.investor_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  application_id uuid not null,
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  revoked_reason text,
  scope text not null default 'FULL',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_access_grants_user on public.investor_access_grants(user_id);
create index if not exists idx_access_grants_active on public.investor_access_grants(user_id) where revoked_at is null;

alter table public.investor_access_grants enable row level security;

-- Admin full access
create policy "access_grants_admin_all"
on public.investor_access_grants for all
using (public.is_investor_admin())
with check (public.is_investor_admin());

-- Investor can read own grants
create policy "access_grants_investor_select_own"
on public.investor_access_grants for select
using (user_id = auth.uid());

-- Helper: is current user entitled right now?
create or replace function public.has_active_investor_access(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.investor_access_grants g
    where g.user_id = target_user_id
      and g.revoked_at is null
      and now() between g.starts_at and g.expires_at
  );
$$;

-- RPC: admin grant access (creates a grant)
create or replace function public.admin_grant_investor_access(
  target_user_id uuid,
  target_application_id uuid,
  duration_days int default 30,
  scope text default 'FULL'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  s timestamptz := now();
  e timestamptz := now() + make_interval(days => duration_days);
  new_id uuid;
begin
  if not public.is_investor_admin() then
    raise exception 'FORBIDDEN_ROLE';
  end if;

  insert into public.investor_access_grants
    (user_id, application_id, starts_at, expires_at, scope, created_by)
  values
    (target_user_id, target_application_id, s, e, scope, auth.uid())
  returning id into new_id;

  return jsonb_build_object(
    'status','ACTIVE',
    'grant_id', new_id,
    'starts_at', s,
    'expires_at', e,
    'scope', scope
  );
end;
$$;

revoke all on function public.admin_grant_investor_access(uuid,uuid,int,text) from public;
grant execute on function public.admin_grant_investor_access(uuid,uuid,int,text) to authenticated;

-- RPC: admin revoke access (ends access immediately)
create or replace function public.admin_revoke_investor_access(
  grant_id uuid,
  reason text default 'Revoked by admin'
)
returns jsonb
language plpgsql
security definer
as $$
begin
  if not public.is_investor_admin() then
    raise exception 'FORBIDDEN_ROLE';
  end if;

  update public.investor_access_grants
    set revoked_at = now(),
        revoked_reason = reason
  where id = grant_id;

  return jsonb_build_object('status','REVOKED','grant_id',grant_id,'revoked_at', now());
end;
$$;

revoke all on function public.admin_revoke_investor_access(uuid,text) from public;
grant execute on function public.admin_revoke_investor_access(uuid,text) to authenticated;

-- RPC: admin extend access (keeps same grant for simplicity; you can also implement "new grant" strategy later)
create or replace function public.admin_extend_investor_access(
  grant_id uuid,
  additional_days int default 30,
  reason text default 'Extended by admin'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  new_exp timestamptz;
begin
  if not public.is_investor_admin() then
    raise exception 'FORBIDDEN_ROLE';
  end if;

  update public.investor_access_grants
    set expires_at = expires_at + make_interval(days => additional_days)
  where id = grant_id
    and revoked_at is null
  returning expires_at into new_exp;

  return jsonb_build_object('status','EXTENDED','grant_id',grant_id,'expires_at', new_exp, 'reason', reason);
end;
$$;

revoke all on function public.admin_extend_investor_access(uuid,int,text) from public;
grant execute on function public.admin_extend_investor_access(uuid,int,text) to authenticated;
