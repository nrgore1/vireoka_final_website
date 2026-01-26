-- ADDITIVE: governs which NDA template is active; does NOT alter existing NDA signing UI/records.

create table if not exists public.nda_templates (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  title text not null,
  content_html text not null,
  effective_date date not null,
  status text not null check (status in ('DRAFT','UNDER_REVIEW','ACTIVE','DEPRECATED')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index if not exists idx_nda_templates_status on public.nda_templates(status);

alter table public.nda_templates enable row level security;

-- Admin can read/write all NDA templates
create policy "nda_templates_admin_select"
on public.nda_templates for select
using (public.is_investor_admin());

create policy "nda_templates_admin_insert"
on public.nda_templates for insert
with check (public.is_investor_admin());

create policy "nda_templates_admin_update"
on public.nda_templates for update
using (public.is_investor_admin());

-- RPC: get active NDA template (to be used by existing NDA page instead of hardcoding)
create or replace function public.get_active_nda_template()
returns table (
  id uuid,
  version text,
  title text,
  content_html text,
  effective_date date
)
language sql
stable
security definer
as $$
  select t.id, t.version, t.title, t.content_html, t.effective_date
  from public.nda_templates t
  where t.status = 'ACTIVE'
  order by t.effective_date desc, t.created_at desc
  limit 1;
$$;

revoke all on function public.get_active_nda_template() from public;
grant execute on function public.get_active_nda_template() to authenticated;

-- RPC: activate an NDA template (admin only)
create or replace function public.activate_nda_template(template_id uuid)
returns jsonb
language plpgsql
security definer
as $$
begin
  if not public.is_investor_admin() then
    raise exception 'FORBIDDEN_ROLE';
  end if;

  update public.nda_templates
    set status = 'DEPRECATED'
  where status = 'ACTIVE';

  update public.nda_templates
    set status = 'ACTIVE'
  where id = template_id;

  return jsonb_build_object('status','ACTIVE','template_id',template_id);
end;
$$;

revoke all on function public.activate_nda_template(uuid) from public;
grant execute on function public.activate_nda_template(uuid) to authenticated;
