-- Allow anyone to submit an investor application
create policy "public can submit investor application"
on investor_applications
for insert
to anon, authenticated
with check (true);
