import { supabase } from "./supabase";

/* =======================
   Types
======================= */

export type InvestorStatus =
  | "PENDING_APPROVAL"
  | "PENDING_NDA"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

/* =======================
   Core
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
  const { data } = await supabase
    .from("investors")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

/* =======================
   NDA
======================= */

export async function acceptNda(email: string) {
  const { data } = await supabase
    .from("investors")
    .update({
      status: "APPROVED",
      nda_accepted_at: new Date().toISOString(),
    })
    .eq("email", email)
    .select()
    .single();

  await audit(email, "NDA_ACCEPTED");
  return data;
}

/* =======================
   Expiry (Phase-1 inline)
======================= */

export async function expireIfNeeded(investor: any) {
  if (!investor?.expires_at) return investor;

  if (new Date(investor.expires_at) < new Date()) {
    const { data } = await supabase
      .from("investors")
      .update({ status: "EXPIRED" })
      .eq("email", investor.email)
      .select()
      .single();

    await audit(investor.email, "EXPIRED");
    return data;
  }

  return investor;
}

/* =======================
   Admin
======================= */

export async function approveInvestor(email: string, ttlDays = 30) {
  const expiresAt = new Date(
    Date.now() + ttlDays * 86400000
  ).toISOString();

  const { data } = await supabase
    .from("investors")
    .update({
      status: "PENDING_NDA",
      approved_at: new Date().toISOString(),
      expires_at: expiresAt,
    })
    .eq("email", email)
    .select()
    .single();

  await audit(email, "APPROVED", { ttlDays });
  return data;
}

export async function revokeInvestor(email: string) {
  const { data } = await supabase
    .from("investors")
    .update({ status: "REJECTED" })
    .eq("email", email)
    .select()
    .single();

  await audit(email, "REVOKED");
  return data;
}

/* =======================
   Audit
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
