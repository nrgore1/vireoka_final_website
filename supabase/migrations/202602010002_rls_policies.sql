-- ---------- helper: investor admin check ----------
create or replace function public.is_investor_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'INVESTOR_ADMIN'
  );
$$;

-- ---------- investor_applications ----------
alter table public.investor_applications enable row level security;

-- Anyone (anon or authenticated) can INSERT an application.
-- (This supports your current UX where submit can happen before login.)
drop policy if exists investor_applications_insert_anyone on public.investor_applications;
create policy investor_applications_insert_anyone
on public.investor_applications
for insert
to anon, authenticated
with check (
  investor_name is not null
  and email is not null
  and organization is not null
);

-- Authenticated users can read their own applications:
-- either by user_id match OR email match to jwt email.
drop policy if exists investor_applications_select_own on public.investor_applications;
create policy investor_applications_select_own
on public.investor_applications
for select
to authenticated
using (
  user_id = auth.uid()
  OR email = (auth.jwt() ->> 'email')
);

-- Investor admins can read ALL applications.
drop policy if exists investor_applications_select_admin on public.investor_applications;
create policy investor_applications_select_admin
on public.investor_applications
for select
to authenticated
using ( public.is_investor_admin() );

-- Only investor admins can UPDATE applications (approve/reject, notes).
drop policy if exists investor_applications_update_admin on public.investor_applications;
create policy investor_applications_update_admin
on public.investor_applications
for update
to authenticated
using ( public.is_investor_admin() )
with check ( public.is_investor_admin() );

-- ---------- investor_access_grants ----------
alter table public.investor_access_grants enable row level security;

-- Admin can manage grants (insert/update/select).
drop policy if exists investor_access_grants_admin_all on public.investor_access_grants;
create policy investor_access_grants_admin_all
on public.investor_access_grants
for all
to authenticated
using ( public.is_investor_admin() )
with check ( public.is_investor_admin() );

-- Investors can SELECT their own grants (needed for portal gating/status).
drop policy if exists investor_access_grants_select_own on public.investor_access_grants;
create policy investor_access_grants_select_own
on public.investor_access_grants
for select
to authenticated
using ( user_id = auth.uid() );

-- ---------- portal_audit_events ----------
alter table public.portal_audit_events enable row level security;

-- Users can INSERT audit events only for themselves
drop policy if exists portal_audit_events_insert_own on public.portal_audit_events;
create policy portal_audit_events_insert_own
on public.portal_audit_events
for insert
to authenticated
with check ( user_id = auth.uid() );

-- Users can SELECT their own audit events (optional)
drop policy if exists portal_audit_events_select_own on public.portal_audit_events;
create policy portal_audit_events_select_own
on public.portal_audit_events
for select
to authenticated
using ( user_id = auth.uid() );

-- Admin can SELECT all audit events
drop policy if exists portal_audit_events_select_admin on public.portal_audit_events;
create policy portal_audit_events_select_admin
on public.portal_audit_events
for select
to authenticated
using ( public.is_investor_admin() );
