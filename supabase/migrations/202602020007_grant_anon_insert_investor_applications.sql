-- Allow anon and authenticated roles to insert investor applications

grant insert on table public.investor_applications to anon;
grant insert on table public.investor_applications to authenticated;
