-- Run this once AFTER naren@vireoka.com has authenticated at least once
-- (so they exist in auth.users). Safe idempotent insert.

insert into public.user_roles (user_id, role)
select id, 'INVESTOR_ADMIN'
from auth.users
where email = 'naren@vireoka.com'
on conflict do nothing;
