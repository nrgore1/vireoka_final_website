-- Create investor applications table (canonical)

create table if not exists public.investor_applications (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  investor_name text not null,
  email text not null,
  organization text not null,
  status text not null default 'submitted',
  metadata jsonb not null default '{}',
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure reference code generation
create or replace function public.generate_investor_reference()
returns trigger language plpgsql as $$
begin
  if new.reference_code is null then
    new.reference_code := 'INV-' || upper(substr(gen_random_uuid()::text, 1, 8));
  end if;
  return new;
end;
$$;

drop trigger if exists set_investor_reference on public.investor_applications;

create trigger set_investor_reference
before insert on public.investor_applications
for each row execute function public.generate_investor_reference();
