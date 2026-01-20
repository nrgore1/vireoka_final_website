export const EVENT_TYPES = [
  "PAGE_VIEW",
  "LOGIN",
  "LOGOUT",
  "NDA_ACCEPTED",
  "DOWNLOAD",
] as const;

export type InvestorEventType = typeof EVENT_TYPES[number];

export const AUDIT_ACTIONS = [
  "APPROVED",
  "REVOKED",
  "EXPIRED",
  "NDA_ACCEPTED",
  "SUSPICIOUS_ACTIVITY",
] as const;

export type AuditAction = typeof AUDIT_ACTIONS[number];


export const AUDIT_ACTIONS = [
  "APPROVED",
  "REVOKED",
  "EXPIRED",
  "NDA_ACCEPTED",
  "SUSPICIOUS_ACTIVITY",
] as const;

export type AuditAction = typeof AUDIT_ACTIONS[number];

