-- ============================================
-- FINAL HARD FIX: investor_applications
-- ============================================

-- Disable RLS (server-only table)
alter table investor_applications disable row level security;

-- Ensure defaults for ALL required columns
alter table investor_applications
  alter column status set default 'pending',
  alter column metadata set default '{}'::jsonb,
  alter column reference_code set default gen_random_uuid()::text,
  alter column created_at set default now(),
  alter column updated_at set default now();

-- Backfill safety (if any nulls exist)
update investor_applications
set
  status = 'pending'
where status is null;

update investor_applications
set
  metadata = '{}'::jsonb
where metadata is null;

-- Sanity check
select
  column_name,
  is_nullable,
  column_default
from information_schema.columns
where table_name = 'investor_applications';
