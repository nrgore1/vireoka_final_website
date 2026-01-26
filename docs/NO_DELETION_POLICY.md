# No Deletion Policy (Investor Migration Phase)

During investor security hardening:

- ❌ No legacy components are deleted
- ❌ No routes are removed
- ❌ No refactors are performed

Legacy components may exist alongside canonical ones.

Canonical authority:
- Investor portal gate → InvestorPortalGate
- Admin gate → AdminGuard + AdminMfaGate
- Downloads → watermarked Edge Function

Cleanup will occur ONLY after smoke testing and audit sign-off.
