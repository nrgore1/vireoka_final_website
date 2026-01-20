import { supabase } from "./supabase";
import { sendEmail } from "./email";

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

  await audit(input.email, "APPLIED", {
    org: input.org,
    role: input.role,
  });

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
  await notify(email, "NDA accepted", "Thank you for accepting the NDA.");

  return data;
}

/* =======================
   Expiry (inline check)
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
  await notify(
    email,
    "Investor access approved",
    "Your access is approved. Please accept the NDA to proceed."
  );

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
  await notify(
    email,
    "Investor access revoked",
    "Your access was revoked."
  );

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

/* =======================
   Email notifications
======================= */

async function emailNotificationsEnabled(email: string): Promise<boolean> {
  const { data } = await supabase
    .from("investor_preferences")
    .select("email_notifications")
    .eq("email", email)
    .single();

  if (!data) return true;
  return data.email_notifications !== false;
}

export async function notify(
  email: string,
  subject: string,
  text: string
) {
  const enabled = await emailNotificationsEnabled(email);
  if (!enabled) return { ok: true, skipped: true };
  return sendEmail({ to: email, subject, text });
}
