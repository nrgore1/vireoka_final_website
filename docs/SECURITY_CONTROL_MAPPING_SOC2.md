# Security Control Mapping (SOC 2 / ISO-style)

This document maps implemented controls to technical enforcement points.
It is written for audits and internal security review.

---

## Control: Logical Access (Least Privilege)
### Requirement
Only authorized users can access sensitive investor content and admin functions.

### Implementation
- Supabase Auth as identity system (auth.users)
- RLS enforcement on:
  - user_roles
  - nda_templates
  - investor_access_grants
  - portal_audit_events
- Canonical gates:
  - InvestorPortalGate (portal access requires has_active_investor_access)
  - AdminGuard (role required)
- Admin actions restricted via RPC security definer + is_investor_admin()

### Evidence
- RLS policies in migrations
- admin-only RPCs: admin_* functions
- user_roles role assignment

---

## Control: MFA for Privileged Accounts
### Requirement
Privileged roles require MFA.

### Implementation
- App-level enforcement gate:
  - AdminMfaGate enforces AAL2 for INVESTOR_ADMIN
- Operational requirement:
  - INVESTOR_ADMIN accounts must enroll TOTP

### Evidence
- AdminMfaGate source + admin protected layout usage

---

## Control: Time-Bound Access (Data Room)
### Requirement
Investor access must be time limited and revocable.

### Implementation
- investor_access_grants with starts_at/expires_at/revoked_at
- has_active_investor_access() for authorization checks
- admin revoke/extend via RPC:
  - admin_revoke_investor_access
  - admin_extend_investor_access

### Evidence
- investor_access_grants table + RPCs
- Portal layout gating

---

## Control: Secure Distribution of Confidential Documents
### Requirement
Prevent uncontrolled sharing, track downloads.

### Implementation
- Canonical download path:
  - Edge Function watermarked-download
- Adds watermark to PDF:
  - email + timestamp + doc_id
- Logs DOC_DOWNLOAD event to portal_audit_events

### Evidence
- watermarked-download function code
- portal_audit_events entries

---

## Control: Monitoring / Audit Logging
### Requirement
Track user and admin actions for investigation.

### Implementation
- portal_audit_events append-only
- log_portal_event() RPC
- Admin audit UI:
  - AdminAuditPanel
- Admin alerts:
  - admin_list_expiring_access RPC + AdminExpiringAccessPanel

### Evidence
- DB table + policies + UI panels

---

## Control: Rate Limiting / Abuse Prevention
### Requirement
Protect against automated exfiltration and abuse.

### Implementation
- DB-backed rate limiting:
  - edge_rate_limits + check_rate_limit()
- Enforced in Edge Function with 429 response
- Includes remaining/reset headers

### Evidence
- check_rate_limit() RPC
- Edge function headers and 429 responses

---

## Operational Notes
- Hostinger does not run Supabase locally.
- Schema changes are applied via Supabase CLI from dev/CI.
- Runtime uses supabase-js with anon key and RLS enforcement.

