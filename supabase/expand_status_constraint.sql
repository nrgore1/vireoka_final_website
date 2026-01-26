alter table investor_applications
drop constraint investor_applications_status_check;

alter table investor_applications
add constraint investor_applications_status_check
check (
  status = any (
    array['pending','submitted','approved','rejected']
  )
);
