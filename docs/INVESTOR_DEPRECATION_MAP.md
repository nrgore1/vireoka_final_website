# Investor System – Deprecation & Canonical Mapping

This document explicitly declares which files are canonical,
which are legacy, and when cleanup is allowed.

NO FILES ARE DELETED during this phase.

---

## Canonical Authority (DO NOT DUPLICATE)

### Investor Portal Access
Canonical:
- src/components/investor/InvestorPortalGate.tsx
Authority:
- Supabase RPC: has_active_investor_access()

Legacy (DO NOT USE FOR NEW CODE):
- src/app/investors/components/InvestorGate.tsx

Cleanup eligibility:
- After 2 successful production cycles + audit signoff

---

### Admin Access Control
Canonical:
- src/components/admin/AdminGuard.tsx
- src/components/security/AdminMfaGate.tsx

Legacy:
- Any page-level role checks inside src/app/admin/**

Cleanup eligibility:
- After MFA adoption reaches 100% for admins

---

### NDA Rendering
Canonical:
- src/components/investor/NdaViewer.tsx
- Supabase table: nda_templates

Legacy:
- Hardcoded NDA HTML in page components
- Static markdown NDA files

Cleanup eligibility:
- After legal approves DB-governed NDA

---

### Investor Access Status
Canonical:
- Supabase RPC: get_investor_access_status()
- UI: InvestorAccessStatusCard.tsx

Legacy:
- src/app/api/investors/status/*
- Client-side derived status logic

Cleanup eligibility:
- After API consumers migrate to RPC

---

### Document Downloads (CRITICAL)
Canonical:
- Supabase Edge Function: watermarked-download
- src/lib/investor/download.ts

Legacy (BLOCKED FOR CONFIDENTIAL DOCS):
- Supabase Storage signed URLs
- Any direct storage.from(...).createSignedUrl()

Cleanup eligibility:
- NEVER for sensitive documents

---

### Audit Logging
Canonical:
- Supabase RPC: log_portal_event()
- Table: portal_audit_events

Legacy:
- Client-only analytics
- Console-based tracking

Cleanup eligibility:
- After SOC2-style review

---

## Global Rule
If a canonical file exists, legacy code must not be extended.

