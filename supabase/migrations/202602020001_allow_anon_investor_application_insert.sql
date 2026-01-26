-- Allow anonymous users to submit investor applications
-- This is REQUIRED for the agreed workflow

alter table public.investor_applications enable row level security;

-- Drop any conflicting insert policy
drop policy if exists investor_applications_insert_anyone
on public.investor_applications;

-- Allow anon + authenticated inserts with basic validation
create policy investor_applications_insert_anyone
on public.investor_applications
for insert
to anon, authenticated
with check (
  investor_name is not null
  and email is not null
  and organization is not null
);
