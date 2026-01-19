import { sendEmail } from "@/lib/email";

export type InvestorStatus =
  | "PENDING_APPROVAL"
  | "PENDING_NDA"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "REVOKED";

export type InvestorApplicationInput = {
  email: string;
  name: string;
  org: string;
  role: string;
  intent: string;
};

export type Investor = {
  email: string;
  status: InvestorStatus;
  ndaAcceptedAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  deletedAt?: string;
};

export type InvestorAuditAction =
  | "APPLIED"
  | "NDA_ACCEPTED"
  | "APPROVED"
  | "REJECTED"
  | "REVOKED"
  | "RESTORED"
  | "SOFT_DELETED";

export type InvestorAuditEvent = {
  email: string;
  action: InvestorAuditAction;
  at: string;
  meta?: Record<string, any>;
};

// In-memory stores
const investors = new Map<string, Investor>();
const auditLog: InvestorAuditEvent[] = [];

function nowIso() {
  return new Date().toISOString();
}

async function recordAudit(e: InvestorAuditEvent) {
  auditLog.unshift(e);
}

export async function listAuditLog() {
  return auditLog;
}

export async function createOrGetInvestor(input: InvestorApplicationInput): Promise<Investor> {
  const email = input.email.trim().toLowerCase();
  const existing = investors.get(email);

  // Never downgrade status; keep deletedAt if present
  if (existing) return existing;

  const rec: Investor = {
    email,
    status: "PENDING_NDA",
  };

  investors.set(email, rec);
  await recordAudit({ email, action: "APPLIED", at: nowIso(), meta: { org: input.org, role: input.role } });

  return rec;
}

export async function getInvestorByEmail(email: string): Promise<Investor | null> {
  const e = email.trim().toLowerCase();
  return investors.get(e) || null;
}

export async function listInvestors(opts?: { includeDeleted?: boolean }): Promise<Investor[]> {
  const includeDeleted = !!opts?.includeDeleted;
  const all = Array.from(investors.values());
  return includeDeleted ? all : all.filter((x) => !x.deletedAt);
}

export async function acceptNda(email: string): Promise<Investor> {
  const e = email.trim().toLowerCase();
  const cur = investors.get(e) || { email: e, status: "PENDING_NDA" as const };

  const next: Investor = {
    ...cur,
    status: "PENDING_APPROVAL",
    ndaAcceptedAt: nowIso(),
  };

  investors.set(e, next);
  await recordAudit({ email: e, action: "NDA_ACCEPTED", at: nowIso() });

  return next;
}

export async function expireIfNeeded(investor: Investor): Promise<Investor> {
  if (!investor.expiresAt) return investor;

  const expired = new Date(investor.expiresAt).getTime() < Date.now();
  if (!expired) return investor;

  const next = { ...investor, status: "EXPIRED" as const };
  investors.set(next.email, next);
  return next;
}

export async function approveInvestor(email: string, ttlDays?: number): Promise<Investor> {
  const e = email.trim().toLowerCase();
  const ttl = typeof ttlDays === "number" && ttlDays > 0 ? ttlDays : 30;

  const cur = investors.get(e) || { email: e, status: "PENDING_APPROVAL" as const };

  const next: Investor = {
    ...cur,
    status: "APPROVED",
    approvedAt: nowIso(),
    expiresAt: new Date(Date.now() + ttl * 24 * 60 * 60 * 1000).toISOString(),
  };

  investors.set(e, next);
  await recordAudit({ email: e, action: "APPROVED", at: nowIso(), meta: { ttlDays: ttl } });

  // Best-effort email (won't fail the request)
  sendEmail({
    to: e,
    subject: "Vireoka — Investor access approved",
    text: "Your investor access has been approved. You can now use the investor portal on this device.",
  }).catch(() => {});

  return next;
}

export async function rejectInvestor(email: string): Promise<Investor> {
  const e = email.trim().toLowerCase();
  const cur = investors.get(e) || { email: e, status: "PENDING_APPROVAL" as const };

  const next: Investor = { ...cur, status: "REJECTED" };

  investors.set(e, next);
  await recordAudit({ email: e, action: "REJECTED", at: nowIso() });

  sendEmail({
    to: e,
    subject: "Vireoka — Investor access update",
    text: "Thanks for your interest. Your investor access request is not approved at this time.",
  }).catch(() => {});

  return next;
}

export async function revokeInvestor(email: string, reason?: string): Promise<Investor> {
  const e = email.trim().toLowerCase();
  const cur = investors.get(e);
  if (!cur) {
    const created: Investor = { email: e, status: "REVOKED" };
    investors.set(e, created);
    await recordAudit({ email: e, action: "REVOKED", at: nowIso(), meta: { reason } });
    return created;
  }

  const next: Investor = {
    ...cur,
    status: "REVOKED",
    expiresAt: new Date(Date.now() - 60_000).toISOString(),
  };

  investors.set(e, next);
  await recordAudit({ email: e, action: "REVOKED", at: nowIso(), meta: { reason } });

  sendEmail({
    to: e,
    subject: "Vireoka — Investor access revoked",
    text: "Your investor access has been revoked. If you believe this is an error, please contact support.",
  }).catch(() => {});

  return next;
}

export async function restoreInvestor(email: string): Promise<Investor> {
  const e = email.trim().toLowerCase();
  const cur = investors.get(e) || { email: e, status: "PENDING_APPROVAL" as const };

  // Restore to a safe state (pending approval) unless it was approved and still has expiry in future
  const next: Investor = {
    ...cur,
    status: "PENDING_APPROVAL",
    deletedAt: undefined,
  };

  investors.set(e, next);
  await recordAudit({ email: e, action: "RESTORED", at: nowIso() });

  return next;
}

export async function softDeleteInvestor(email: string): Promise<Investor> {
  const e = email.trim().toLowerCase();
  const cur = investors.get(e) || { email: e, status: "REVOKED" as const };

  const next: Investor = {
    ...cur,
    status: "REVOKED",
    deletedAt: nowIso(),
  };

  investors.set(e, next);
  await recordAudit({ email: e, action: "SOFT_DELETED", at: nowIso() });

  return next;
}

export type RevocationReason =
  | "ADMIN_REVOKE"
  | "EXPIRED"
  | "SECURITY";

export async function revokeInvestor(
  email: string,
  reason: RevocationReason = "ADMIN_REVOKE"
): Promise<Investor> {
  const rec = {
    email,
    status: "REJECTED" as const,
    revokedAt: new Date().toISOString(),
    revokeReason: reason,
  };

  await recordAudit({
    email,
    action: "REVOKED",
    at: new Date().toISOString(),
    meta: { reason },
  });

  return rec;
}
import { sendEmail } from "./email";

async function notify(email: string, subject: string, text: string) {
  await sendEmail({ to: email, subject, text });
}
import { notifyApproved, notifyRevoked } from "./investorNotifications";

export type InvestorPreferences = {
  emailNotifications: boolean;
};

export function defaultPreferences(): InvestorPreferences {
  return { emailNotifications: true };
}
