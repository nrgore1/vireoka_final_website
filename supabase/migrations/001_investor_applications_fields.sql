alter table investor_applications
  add column if not exists full_name text,
  add column if not exists work_email text,
  add column if not exists organization text,
  add column if not exists role text,
  add column if not exists investor_type text;

-- Optional: basic NOT NULL constraints (only do this if table is empty or data is clean)
-- alter table investor_applications
--   alter column full_name set not null,
--   alter column work_email set not null,
--   alter column organization set not null,
--   alter column role set not null,
--   alter column investor_type set not null;
