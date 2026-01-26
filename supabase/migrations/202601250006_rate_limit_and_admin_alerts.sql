-- ADDITIVE: Rate limiting + admin expiring access alert RPC
-- Safe: no changes to existing tables

-- 1) Rate limit table (DB-backed, works across Edge Function instances)
create table if not exists public.edge_rate_limits (
  id bigserial primary key,
  key text not null,
  window_start timestamptz not null,
  window_seconds int not null,
  count int not null default 0,
  updated_at timestamptz not null default now(),
  unique (key, window_start, window_seconds)
);

create index if not exists idx_edge_rate_limits_key_window
on public.edge_rate_limits(key, window_start desc);

alter table public.edge_rate_limits enable row level security;

-- Block all direct client access by default
create policy "edge_rate_limits_no_select"
on public.edge_rate_limits for select
using (false);

create policy "edge_rate_limits_no_insert"
on public.edge_rate_limits for insert
with check (false);

create policy "edge_rate_limits_no_update"
on public.edge_rate_limits for update
using (false);

-- 2) RPC: check_rate_limit(key, limit, window_seconds)
-- Returns: { allowed: boolean, remaining: int, reset_at: timestamptz }
-- SECURITY DEFINER so the function can write even with RLS enabled.
create or replace function public.check_rate_limit(
  p_key text,
  p_limit int default 30,
  p_window_seconds int default 60
)
returns jsonb
language plpgsql
security definer
as $$
declare
  w_start timestamptz;
  new_count int;
  reset_at timestamptz;
  allowed boolean;
  remaining int;
begin
  if p_key is null or length(trim(p_key)) = 0 then
    raise exception 'RATE_LIMIT_KEY_REQUIRED';
  end if;

  -- Align window_start to coarse buckets
  w_start := date_trunc('second', now()) - make_interval(secs => (extract(epoch from now())::int % p_window_seconds));
  reset_at := w_start + make_interval(secs => p_window_seconds);

  insert into public.edge_rate_limits(key, window_start, window_seconds, count)
  values (p_key, w_start, p_window_seconds, 1)
  on conflict (key, window_start, window_seconds)
  do update set count = public.edge_rate_limits.count + 1,
                updated_at = now()
  returning count into new_count;

  allowed := (new_count <= p_limit);
  remaining := greatest(p_limit - new_count, 0);

  return jsonb_build_object(
    'allowed', allowed,
    'remaining', remaining,
    'reset_at', reset_at
  );
end;
$$;

revoke all on function public.check_rate_limit(text,int,int) from public;
grant execute on function public.check_rate_limit(text,int,int) to authenticated;

-- 3) Admin RPC: list grants expiring soon (for alerts dashboard)
-- NOTE: investor_access_grants is your new canonical entitlement table.
create or replace function public.admin_list_expiring_access(
  p_days int default 7,
  p_limit int default 200
)
returns table (
  grant_id uuid,
  user_id uuid,
  expires_at timestamptz,
  starts_at timestamptz,
  scope text,
  revoked_at timestamptz
)
language sql
stable
security definer
as $$
  select g.id as grant_id, g.user_id, g.expires_at, g.starts_at, g.scope, g.revoked_at
  from public.investor_access_grants g
  where g.revoked_at is null
    and g.expires_at <= (now() + make_interval(days => p_days))
    and g.expires_at >= now()
  order by g.expires_at asc
  limit p_limit;
$$;

revoke all on function public.admin_list_expiring_access(int,int) from public;
grant execute on function public.admin_list_expiring_access(int,int) to authenticated;
