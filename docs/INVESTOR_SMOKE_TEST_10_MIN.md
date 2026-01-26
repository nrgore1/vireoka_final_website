# 10-Minute Investor System Smoke Test

Run this checklist after every deployment touching:
- Auth
- Investor portal
- Admin flows
- Supabase migrations

---

## ⏱ 0–2 min: Investor Entry

1. Log in as a non-investor user
   - Expected: Investor portal blocked
   - Message: "Investor Access Required"

2. Visit Investor Access page
   - Status card renders
   - Application state visible

---

## ⏱ 2–4 min: NDA Flow

3. Open NDA page
   - Active NDA renders from DB
   - Version + effective date visible

4. (If signing enabled)
   - Submit NDA
   - No UI regression

---

## ⏱ 4–6 min: Admin Approval

5. Log in as INVESTOR_ADMIN
   - AdminGuard passes
   - MFA enforced (AAL2)

6. Approve investor + grant access
   - investor_access_grants row created
   - expires_at populated

---

## ⏱ 6–8 min: Portal Access

7. Investor logs in again
   - Portal loads successfully
   - InvestorPortalGate allows access

8. Refresh page
   - Access persists
   - No flash of unauthorized content

---

## ⏱ 8–10 min: Security & Audit

9. Download a sensitive PDF
   - File is watermarked
   - Download succeeds only via Edge Function

10. Admin checks audit log
    - PORTAL_ENTRY event exists
    - DOC_DOWNLOAD event exists

---

## PASS CRITERIA
- No console errors
- No direct storage URLs
- No unauthorized access
- Audit log populated

FAIL = rollback + investigation

