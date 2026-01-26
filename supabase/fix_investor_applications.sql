-- ================================
-- HARD FIX: investor applications
-- ================================

-- Disable RLS completely (server-managed tables)
alter table investor_applications disable row level security;
alter table investor_application_audit_logs disable row level security;

-- Ensure required defaults exist
alter table investor_applications
  alter column status set default 'pending',
  alter column metadata set default '{}'::jsonb,
  alter column reference_code set default gen_random_uuid()::text,
  alter column created_at set default now(),
  alter column updated_at set default now();

-- Ensure metadata is never null
update investor_applications
set metadata = '{}'::jsonb
where metadata is null;

-- Safety check
select
  relname as table,
  relrowsecurity as rls_enabled
from pg_class
where relname in (
  'investor_applications',
  'investor_application_audit_logs'
);
