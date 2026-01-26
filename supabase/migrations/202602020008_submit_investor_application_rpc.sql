-- Canonical public RPC for anonymous investor application submission

create or replace function public.submit_investor_application(
  p_investor_name text,
  p_email text,
  p_organization text,
  p_role text,
  p_investor_type text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.investor_applications (
    investor_name,
    email,
    organization,
    status,
    metadata
  )
  values (
    p_investor_name,
    p_email,
    p_organization,
    'submitted',
    jsonb_build_object(
      'role', p_role,
      'investor_type', p_investor_type
    )
  )
  returning id into v_id;

  return v_id;
end;
$$;
