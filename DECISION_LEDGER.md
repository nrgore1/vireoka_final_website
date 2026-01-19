# Vireoka — Decision Ledger (Authoritative)

This file is the **single source of truth** for naming, terminology, public-vs-private boundaries, and investor gating.
Any PR changing terms or positioning must update this ledger first.

---

## A) Branding & Naming

- External product name: **Vireoka**
- Internal codename/engine name: **AtmaSphere** (STRICTLY INTERNAL — never on public pages)
- Company legal name: **Vireoka LLC**

---

## B) Banned / Avoided Terms (Public Website)

These terms must not appear on public pages:
- “Decision Management”
- “AtmaSphere” (internal only)
- Council member names / internal pipeline specifics
- Key management / cryptographic implementation details (HKDF, keyrings, SecretBox, etc.)
- Endpoint inventory beyond what is necessary for a demo request

---

## C) Approved Public Positioning Vocabulary

Use these terms publicly (choose by context):
1. **Cognitive Governance** (default)
2. **Intelligence Stewardship** (ethics/trust framing)
3. **Deliberative Intelligence** (technical-but-safe framing)
4. **Reasoning Governance**
5. **Strategic Intelligence Fabric**

Public promise: “We govern *how* AI reasons, not just *what* it outputs.”

---

## D) Public vs NDA Investor Content

### Public Allowed
- High-level concept: Cognitive Governance for AI
- Benefits: auditability, traceability, explainability, risk controls
- Non-confidential visuals: abstract diagrams, anonymized UI mock frames
- Public whitepaper: principles, non-sensitive architecture layers, governance outcomes

### NDA-Gated Only (Investor Portal)
- Product demo UI (interactive)
- Detailed workflows, lineage/DAG internals, policy mechanics
- Full technical architecture / endpoint maps
- Security/key rotation implementation details
- Pricing drafts beyond a high-level range
- Roadmap specifics with internal milestones

---

## E) Investor Access Policy (NDA Gate)

Flow:
1) Apply (email + org + intent)
2) Accept NDA
3) Await approval
4) If approved → time-limited access
5) Access expires automatically
6) Re-apply or request extension

Rules:
- No access to gated content unless NDA accepted AND approved AND not expired.
- Status must be transparent to applicant: pending / approved / rejected / expired.

---

## F) Copy/Content Governance

- All page copy comes from `src/content/siteCopy.ts` only.
- Pages should not contain “handwritten” marketing paragraphs.
- Any changes to messaging must update `siteCopy.ts` and this ledger.

---

## G) Product Language Map

Old (banned): Decision Dashboard / Decision Audit / Decision Replay / Decision Diff / Decision Lineage  
New (approved): Cognitive Dashboard / Reasoning Audit / Deliberation Replay / Reasoning Diff / Intelligence Lineage

