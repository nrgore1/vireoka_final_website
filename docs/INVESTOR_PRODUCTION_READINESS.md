# Investor + Investor_Admin Production Readiness Checklist

## Environment variables (Hostinger / production)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-only; never expose to browser)
- (Edge Function) SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY set in Supabase Functions env

## RLS validation
- Confirm RLS enabled on:
  - public.user_roles
  - public.nda_templates
  - public.investor_access_grants
  - public.portal_audit_events
- Confirm policies:
  - Admin-only write on nda_templates/access/audit read
  - Investor read own access grants
  - Investor audit self (optional)

## Functional smoke tests
1) Investor applies / completes NDA (existing flow)
2) Admin approves -> access grant created
3) Investor portal gating passes during access window
4) Access expires blocks portal
5) Admin revokes -> portal blocked immediately
6) Watermarked download:
   - PDF is stamped with email + timestamp
   - Audit event DOC_DOWNLOAD written
7) Audit view:
   - Admin can list events
   - Investor can see own events (if enabled)

## Security hardening
- Require MFA for INVESTOR_ADMIN (app-level gating)
- Use short-lived signed URLs OR watermarked download function for all docs
- Rate limit portal download endpoint (function-level / WAF)
- Admin session: shorter TTL recommended

## Monitoring
- Track spikes in:
  - DOC_DOWNLOAD
  - Unique IPs per investor
  - Portal entry frequency
- Set alerts for:
  - Multiple IPs in short time
  - Excessive downloads

## Rollback strategy
- Disabling investor portal can be done by:
  - Revoking all active grants
  - Disabling portal routes in app
- Schema additions are additive; leaving them in place is safe.
