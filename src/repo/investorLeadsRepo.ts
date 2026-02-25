import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type LeadStatus = "NEW" | "APPROVED" | "REVOKED";
export type LeadRole = "advisor" | "angel" | "crowd" | "partner" | "vc";

export type InvestorLeadRow = {
  id: string;
  full_name: string | null;
  email: string;
  company: string | null;
  investor_type: string | null;
  reference_code: string;
  status: LeadStatus;
  kind: string; // expected to be "APPLY" per your constraint
  created_at: string;
  updated_at: string;
};

function normRole(v: unknown): LeadRole {
  const s = String(v || "").trim().toLowerCase();
  if (s === "advisor") return "advisor";
  if (s === "angel" || s === "angel investor" || s === "angel_investor") return "angel";
  if (s === "crowd" || s === "crowd contributor" || s === "crowdsourcing" || s === "crowd_sourcing") return "crowd";
  if (s === "partner") return "partner";
  if (s === "vc" || s === "venture" || s === "venture capitalist" || s === "venture_capitalist") return "vc";
  return "advisor";
}

export async function getLeadByEmail(email: string): Promise<InvestorLeadRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("investor_leads")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0] as InvestorLeadRow) || null;
}

export async function listLeads(limit = 200): Promise<InvestorLeadRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("investor_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as InvestorLeadRow[]) || [];
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<InvestorLeadRow> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("investor_leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as InvestorLeadRow;
}

export async function insertOrGetLead(input: {
  fullName: string;
  email: string;
  company: string;
  role: unknown;
  message?: string;
}): Promise<{ row: InvestorLeadRow; created: boolean }> {
  const supabase = createAdminClient();

  const email = input.email.trim().toLowerCase();
  const existing = await getLeadByEmail(email);
  if (existing) return { row: existing, created: false };

  const referenceCode = crypto.randomUUID();
  const role = normRole(input.role);

  const { data, error } = await supabase
    .from("investor_leads")
    .insert({
      email,
      full_name: input.fullName?.trim() || null,
      company: input.company?.trim() || null,
      investor_type: role,        // <-- role goes here
      kind: "APPLY",              // <-- satisfies investor_leads_kind_check
      status: "NEW",
      reference_code: referenceCode, // <-- prevents null constraint failures
      // message is optional; only include if your table has it
      ...(typeof input.message === "string" ? { message: input.message.trim() } : {}),
    } as any)
    .select("*")
    .single();

  if (error) throw error;
  return { row: data as InvestorLeadRow, created: true };
}
