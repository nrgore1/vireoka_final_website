create table if not exists investor_application_audit_logs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references investor_applications(id) on delete cascade,
  action text not null,
  performed_by uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
