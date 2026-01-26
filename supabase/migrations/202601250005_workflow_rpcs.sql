-- ADDITIVE: workflow helper RPCs to integrate with existing UI without changing it.
-- These functions READ/WRITE existing investor_applications while keeping old flow intact.

-- Investor: status snapshot (application + access)
create or replace function public.get_investor_access_status()
returns jsonb
language plpgsql
security definer
as $$
declare
  app record;
  grant_row record;
  access_status text := 'NONE';
begin
  select *
  into app
  from public.investor_applications
  where user_id = auth.uid()
  order by created_at desc
  limit 1;

  select *
  into grant_row
  from public.investor_access_grants
  where user_id = auth.uid()
  order by created_at desc
  limit 1;

  if grant_row.id is null then
    access_status := 'NONE';
  elsif grant_row.revoked_at is not null then
    access_status := 'REVOKED';
  elsif now() > grant_row.expires_at then
    access_status := 'EXPIRED';
  else
    access_status := 'ACTIVE';
  end if;

  return jsonb_build_object(
    'user_id', auth.uid(),
    'application', case when app.id is null then null else jsonb_build_object(
      'id', app.id,
      'status', app.status,
      'submitted_at', app.submitted_at,
      'updated_at', app.updated_at
    ) end,
    'access', case when grant_row.id is null then jsonb_build_object('status','NONE') else jsonb_build_object(
      'grant_id', grant_row.id,
      'status', access_status,
      'starts_at', grant_row.starts_at,
      'expires_at', grant_row.expires_at,
      'revoked_at', grant_row.revoked_at,
      'revoked_reason', grant_row.revoked_reason,
      'scope', grant_row.scope
    ) end
  );
end;
$$;

revoke all on function public.get_investor_access_status() from public;
grant execute on function public.get_investor_access_status() to authenticated;

-- Admin: approve application + grant access in one atomic action (aligns with agreed workflow)
create or replace function public.admin_approve_application_and_grant_access(
  application_id uuid,
  duration_days int default 30,
  scope text default 'FULL'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  app_user uuid;
  grant_result jsonb;
begin
  if not public.is_investor_admin() then
    raise exception 'FORBIDDEN_ROLE';
  end if;

  select user_id into app_user
  from public.investor_applications
  where id = application_id;

  if app_user is null then
    raise exception 'APPLICATION_NOT_FOUND';
  end if;

  -- move to APPROVED (existing table)
  update public.investor_applications
    set status = 'APPROVED',
        updated_at = now()
  where id = application_id;

  -- create access grant (new table)
  grant_result := public.admin_grant_investor_access(app_user, application_id, duration_days, scope);

  -- audit admin action
  insert into public.portal_audit_events(user_id, event_type, entity_type, entity_id, metadata)
  values (app_user, 'ACCESS_GRANTED', 'APPLICATION', application_id::text,
          jsonb_build_object('approved_by', auth.uid(), 'duration_days', duration_days, 'scope', scope));

  return jsonb_build_object('status','APPROVED', 'application_id', application_id, 'grant', grant_result);
end;
$$;

revoke all on function public.admin_approve_application_and_grant_access(uuid,int,text) from public;
grant execute on function public.admin_approve_application_and_grant_access(uuid,int,text) to authenticated;
