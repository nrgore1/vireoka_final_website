-- Fix RLS so anonymous users can submit investor applications
-- This unblocks the public /investors/apply flow

alter table public.investor_applications enable row level security;

-- Remove conflicting policies if they exist
drop policy if exists anon_insert_investor_applications
on public.investor_applications;

drop policy if exists "public can submit investor applications"
on public.investor_applications;

-- Allow anon inserts ONLY
create policy anon_insert_investor_applications
on public.investor_applications
for insert
to anon
with check (true);
