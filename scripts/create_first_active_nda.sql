-- Run in Supabase SQL editor as an INVESTOR_ADMIN (or with service role) to set an initial active NDA.
-- Replace content_html with your actual NDA.

insert into public.nda_templates (version, title, content_html, effective_date, status, created_by)
values (
  'v1.0',
  'Mutual NDA',
  '<h2>Confidentiality Agreement</h2><p>Replace with your legal NDA text…</p>',
  current_date,
  'ACTIVE',
  auth.uid()
);
