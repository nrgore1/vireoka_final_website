-- Add user_id linkage (safe, additive)
alter table public.investor_applications
add column if not exists user_id uuid references auth.users(id);

create index if not exists investor_applications_user_id_idx
  on public.investor_applications (user_id);

-- Auto-fill user_id on insert when authenticated (keeps anon inserts working)
create or replace function public._set_investor_application_user_id()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_investor_application_user_id on public.investor_applications;

create trigger trg_set_investor_application_user_id
before insert on public.investor_applications
for each row execute function public._set_investor_application_user_id();
