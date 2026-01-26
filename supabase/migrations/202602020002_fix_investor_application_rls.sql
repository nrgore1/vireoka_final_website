-- Enable RLS
alter table public.investor_applications enable row level security;

-- 1. Allow anyone (anon or authed) to submit an application
create policy "allow_public_insert_investor_application"
on public.investor_applications
for insert
to anon, authenticated
with check (
  email is not null
);

-- 2. Allow applicant to read their own application (by user_id)
create policy "allow_user_read_own_application"
on public.investor_applications
for select
to authenticated
using (
  user_id = auth.uid()
);

-- 3. Allow admin roles full access (used by investor_admin)
create policy "allow_admin_full_access"
on public.investor_applications
for all
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role in ('admin', 'investor_admin')
  )
);
