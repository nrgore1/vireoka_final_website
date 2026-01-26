-- FINAL authoritative RLS setup for investor_applications
-- Allows anonymous users to submit applications
-- Blocks all reads for anon users

alter table public.investor_applications enable row level security;

-- Remove all existing policies to avoid conflicts
drop policy if exists "public can submit investor applications" on public.investor_applications;
drop policy if exists "anon insert investor applications" on public.investor_applications;
drop policy if exists "authenticated read investor applications" on public.investor_applications;
drop policy if exists "authenticated update investor applications" on public.investor_applications;

-- ✅ Allow anonymous INSERT only
create policy "anon can insert investor applications"
on public.investor_applications
for insert
to anon
with check (true);

-- ❌ Explicitly block anon reads (defensive)
create policy "anon cannot read investor applications"
on public.investor_applications
for select
to anon
using (false);

-- (Optional, future-safe) Allow authenticated admins to read
-- You can refine this later with roles
create policy "authenticated can read investor applications"
on public.investor_applications
for select
to authenticated
using (true);
