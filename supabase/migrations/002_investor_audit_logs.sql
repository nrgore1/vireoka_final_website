-- Audit logs for investor application lifecycle
create table if not exists investor_application_audit_logs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references investor_applications(id) on delete cascade,
  actor_user_id uuid null,
  actor_type text not null, -- 'public' | 'admin' | 'system'
  action text not null,     -- 'submit' | 'approve' | 'reject'
  from_status text null,
  to_status text null,
  ip inet null,
  user_agent text null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_investor_audit_application_id
on investor_application_audit_logs (application_id);

-- RLS for audit logs (locked down; service role bypasses)
alter table investor_application_audit_logs enable row level security;

-- No public reads of audit logs
drop policy if exists no_public_read_audit on investor_application_audit_logs;
create policy no_public_read_audit
on investor_application_audit_logs
for select
to anon
using (false);

-- Optional: allow admins to read audit logs (if you use JWT claim role=admin)
drop policy if exists admin_read_audit on investor_application_audit_logs;
create policy admin_read_audit
on investor_application_audit_logs
for select
to authenticated
using ((auth.jwt() ->> 'role') = 'admin');

