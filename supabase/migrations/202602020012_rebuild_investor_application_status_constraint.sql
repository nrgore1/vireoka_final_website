-- Safely rebuild investor_applications.status CHECK constraint
-- This migration is REQUIRED because a prior constraint already exists

-- 1. Drop existing constraint if present
alter table public.investor_applications
drop constraint if exists investor_applications_status_check;

-- 2. Normalize all existing rows
update public.investor_applications
set status = 'submitted'
where status is null
   or status not in ('submitted', 'approved', 'rejected');

-- 3. Re-add the correct constraint
alter table public.investor_applications
add constraint investor_applications_status_check
check (
  status in ('submitted', 'approved', 'rejected')
);
