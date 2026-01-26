-- Normalize legacy investor_application statuses
-- This ensures CHECK constraint can be applied safely

update public.investor_applications
set status = 'submitted'
where status is null
   or status not in ('submitted', 'approved', 'rejected');
