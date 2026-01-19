import { supabase } from "./supabase";

/* =======================
   Types
======================= */

export type InvestorStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type RevocationReason =
  | "ADMIN_REVOKE"
  | "SECURITY";

/* =======================
   Core Investor Ops
======================= */

export async function createOrGetInvestor(input: {
  email: string;
  name: string;
  org: string;
  role: string;
  intent: string;
}) {
  const { data } = await supabase
    .from("investors")
    .upsert(
      { email: input.email, status: "PENDING_APPROVAL" },
      { onConflict: "email" }
    )
    .select()
    .single();

  return data;
}

export async function getInvestorByEmail(email: string) {
  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("email", email)
    .single();

  return data;
}

export async function listInvestors() {
  const { data } = await supabase.from("investors").select("*");
  return data ?? [];
}

/* =======================
   State Transitions
======================= */

export async function approveInvestor(email: string, ttlDays = 30) {
  const expiresAt = new Date(Date.now() + ttlDays * 86400000).toISOString();

  const { data } = await supabase
    .from("investors")
    .update({
      status: "APPROVED",
      approved_at: new Date().toISOString(),
      expires_at: expiresAt,
    })
    .eq("email", email)
    .select()
    .single();

  await audit(email, "APPROVED", { ttlDays });
  return data;
}

export async function revokeInvestor(
  email: string,
  reason: RevocationReason = "ADMIN_REVOKE"
) {
  const { data } = await supabase
    .from("investors")
    .update({ status: "REJECTED" })
    .eq("email", email)
    .select()
    .single();

  await audit(email, "REVOKED", { reason });
  return data;
}

/* =======================
   Audit Log
======================= */

export async function audit(
  email: string,
  action: string,
  meta?: any
) {
  await supabase.from("investor_audit").insert({
    email,
    action,
    meta,
  });
}

export async function listAuditLog() {
  const { data } = await supabase
    .from("investor_audit")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}
