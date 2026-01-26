-- ADDITIVE: append-only audit logging for portal activity and admin actions.

create table if not exists public.portal_audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  event_type text not null,
  entity_type text,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_user_time on public.portal_audit_events(user_id, created_at desc);
create index if not exists idx_audit_event_type on public.portal_audit_events(event_type);

alter table public.portal_audit_events enable row level security;

-- Admin can read all audit
create policy "audit_admin_select"
on public.portal_audit_events for select
using (public.is_investor_admin());

-- Investor can read their own audit (optional; safe)
create policy "audit_investor_select_own"
on public.portal_audit_events for select
using (user_id = auth.uid());

-- Anyone authenticated can insert audit events about themselves.
-- (If you prefer stricter server-only insertion, remove this and insert using service role.)
create policy "audit_authenticated_insert_self"
on public.portal_audit_events for insert
with check (user_id = auth.uid());

-- RPC: record audit event for current user (safe wrapper)
create or replace function public.log_portal_event(
  event_type text,
  entity_type text default null,
  entity_id text default null,
  metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
as $$
declare
  new_id uuid;
begin
  insert into public.portal_audit_events(user_id, event_type, entity_type, entity_id, metadata)
  values (auth.uid(), event_type, entity_type, entity_id, metadata)
  returning id into new_id;

  return jsonb_build_object('id', new_id, 'status', 'LOGGED');
end;
$$;

revoke all on function public.log_portal_event(text,text,text,jsonb) from public;
grant execute on function public.log_portal_event(text,text,text,jsonb) to authenticated;
