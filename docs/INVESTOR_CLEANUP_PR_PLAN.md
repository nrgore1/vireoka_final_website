# Investor System – Cleanup PR Plan

Cleanup is intentionally delayed.
This plan ensures safety, traceability, and rollback.

---

## Phase 0 – Current State (NOW)
Status:
- Canonical + legacy code coexist
- Canonical gates enforced via layouts
- No deletions allowed

---

## Phase 1 – Observation (2–4 weeks)
Actions:
- Monitor audit logs
- Verify no access bypass
- Confirm no usage of signed URLs

No code changes allowed.

---

## Phase 2 – Soft Deprecation
PR Scope:
- Add @deprecated comments
- Add console.warn in legacy components
- Update internal docs

NO deletions.

---

## Phase 3 – Hard Deprecation
PR Scope:
- Remove legacy components from imports
- Replace usage with canonical components

Rollback plan:
- Revert single PR
- No DB rollback needed

---

## Phase 4 – Deletion (FINAL)
PR Scope:
- Delete unused legacy files
- Remove dead API routes
- Remove deprecated utilities

Requirements:
- 2 full release cycles
- Zero audit anomalies
- Legal + security signoff

---

## Non-Negotiables
- No schema rollbacks
- No auth changes
- No migration rewrites

