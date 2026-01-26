-- Fix anonymous investor application submission

alter table public.investor_applications enable row level security;

-- Drop old policies defensively
drop policy if exists "public can submit investor applications"
  on public.investor_applications;

drop policy if exists "anon insert investor applications"
  on public.investor_applications;

-- Allow anonymous INSERT only
create policy "anon insert investor applications"
on public.investor_applications
for insert
to anon
with check (
  investor_name is not null
  and email is not null
  and organization is not null
);
