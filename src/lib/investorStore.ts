import { supabaseAdmin } from "@/lib/supabase/admin";

/* ───────────────── Investor type ───────────────── */

export type Investor = {
  email: string;
  full_name?: string | null;
  role?: string | null;
  firm?: string | null;
  notes?: string | null;

  approved_at?: string | null;
  rejected_at?: string | null;
  revoked_at?: string | null;

  nda_accepted_at?: string | null;
  nda_version_accepted?: string | number | null;

  expires_at?: string | null;

  engagement_score?: number | null;
  hot_alerted_at?: string | null;
};

/* ───────────────── NDA helpers ───────────────── */

function needsNdaAcceptance(input: {
  nda_accepted_at?: string | null;
  nda_version_accepted?: number | null;
}): boolean {
  if (!input.nda_accepted_at) return true;
  if (!input.nda_version_accepted) return true;
  return false;
}

export function needsNdaReaccept(inv: Investor): boolean {
  return needsNdaAcceptance({
    nda_accepted_at: inv.nda_accepted_at,
    nda_version_accepted:
      inv.nda_version_accepted != null
        ? Number(inv.nda_version_accepted)
        : null,
  });
}

export async function acceptNda(email: string, ndaVersion: number) {
  const supabase = supabaseAdmin();
  await supabase
    .from("investors")
    .update({
      nda_accepted_at: new Date().toISOString(),
      nda_version_accepted: ndaVersion,
    })
    .eq("email", email);
}

/* ───────────────── Core investor ops ───────────────── */

export type CreateInvestorInput = {
  full_name: string;
  email: string;
  role: string;
  firm: string;
  notes?: string;
};

export async function getInvestorByEmail(email: string) {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("email", email)
    .single();

  return data as Investor | null;
}

export async function createOrGetInvestor(input: CreateInvestorInput) {
  const supabase = supabaseAdmin();

  const existing = await getInvestorByEmail(input.email);
  if (existing) return existing;

  const { data } = await supabase
    .from("investors")
    .insert({
      full_name: input.full_name,
      email: input.email,
      role: input.role,
      firm: input.firm,
      notes: input.notes ?? null,
    })
    .select()
    .single();

  return data as Investor;
}

export function isExpired(inv: Investor): boolean {
  if (!inv.expires_at) return false;
  return new Date(inv.expires_at) < new Date();
}

/* ───────────────── Admin lifecycle ───────────────── */

export async function approveInvestor(email: string) {
  const supabase = supabaseAdmin();
  await supabase
    .from("investors")
    .update({ approved_at: new Date().toISOString() })
    .eq("email", email);
}

export async function rejectInvestor(email: string) {
  const supabase = supabaseAdmin();
  await supabase
    .from("investors")
    .update({ rejected_at: new Date().toISOString() })
    .eq("email", email);
}

export async function revokeInvestor(email: string) {
  const supabase = supabaseAdmin();
  await supabase
    .from("investors")
    .update({ revoked_at: new Date().toISOString() })
    .eq("email", email);
}

/* ───────────────── Audit & analytics ───────────────── */

export async function audit(action: string, email: string, meta?: any) {
  const supabase = supabaseAdmin();
  await supabase.from("investor_audit").insert({
    action,
    email,
    meta,
  });
}

export async function listAuditLog() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("investor_audit")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function listInvestors() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("investors").select("*");
  return data ?? [];
}

export async function listInvestorsForHeatmap() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("investors")
    .select("country, engagement_score");

  return data ?? [];
}

export async function setEngagementScore(email: string, score: number) {
  const supabase = supabaseAdmin();
  await supabase
    .from("investors")
    .update({ engagement_score: score })
    .eq("email", email);
}

export async function markHotAlerted(email: string) {
  const supabase = supabaseAdmin();
  await supabase
    .from("investors")
    .update({ hot_alerted_at: new Date().toISOString() })
    .eq("email", email);
}

/* ───────────────── Investor events (admin) ───────────────── */

export async function listInvestorEvents() {
  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("investor_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    throw error;
  }

  return data ?? [];
}
