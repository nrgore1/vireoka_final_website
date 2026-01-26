-- Ensure reference generator runs with elevated privileges

create or replace function public.generate_investor_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.reference_code is null then
    new.reference_code :=
      'INV-' || upper(substr(gen_random_uuid()::text, 1, 8));
  end if;
  return new;
end;
$$;
