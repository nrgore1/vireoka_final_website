insert into investor_applications (
  investor_name,
  email,
  organization,
  metadata
)
values (
  'Test User',
  'test@example.com',
  'Test Org',
  '{}'::jsonb
)
returning *;
