export type AccessState =
  | "logged_out"
  | "terms_required"
  | "nda_required"
  | "pending"
  | "denied"
  | "granted";

export type InvestorRole =
  | "advisor"
  | "angel"
  | "contributor"
  | "partner"
  | "admin";

export type AccessCheckResult =
  | { ok: false; state: Exclude<AccessState, "granted">; message?: string }
  | { ok: true; state: "granted"; role: InvestorRole; tier?: string };
