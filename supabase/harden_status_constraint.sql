ALTER TABLE investor_applications
  DROP CONSTRAINT investor_applications_status_check;

ALTER TABLE investor_applications
  ADD CONSTRAINT investor_applications_status_check
  CHECK (status IN ('submitted', 'approved', 'rejected'));
