export type InvestorStatus = "pending" | "approved" | "rejected" | "revoked" | "expired";

export type Investor = {
  id?: string;
  email: string;
  status?: InvestorStatus;
  nda_signed?: boolean;
  invited_at?: string;
  last_access?: string | null;
  role?: "admin" | "viewer" | null;
  engagement_score?: number | null;
};

export type InvestorEvent = {
  id?: string;
  email: string;
  type: string;
  path?: string | null;
  meta?: any;
  created_at?: string;
};

export type RateLimitOptions = { max: number; windowMs: number };
