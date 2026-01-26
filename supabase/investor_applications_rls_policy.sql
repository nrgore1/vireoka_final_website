alter table investor_applications enable row level security;

create policy "Allow public investor submissions"
on investor_applications
for insert
to anon, authenticated
with check (true);
