-- Fix investor_applications.status CHECK constraint (safe)

alter table public.investor_applications
drop constraint if exists investor_applications_status_check;

alter table public.investor_applications
add constraint investor_applications_status_check
check (
  status in ('submitted', 'approved', 'rejected')
);
