import { supabaseAdmin } from "@/lib/supabase/admin";

export type LeadInput = {
  kind: "APPLY" | "REQUEST_ACCESS";

  fullName: string;
  email: string;

  company?: string;
  title?: string;
  investorType?: string;
  accredited?: boolean;
  website?: string;
  linkedin?: string;

  organization?: string;
  reason?: string;
  message?: string;

  ip?: string;
  userAgent?: string;
};

export async function saveLead(data: LeadInput) {
  const supabase = supabaseAdmin();

  const row = {
    kind: data.kind,
    full_name: data.fullName,
    email: data.email,

    company: data.company || null,
    title: data.title || null,
    investor_type: data.investorType || null,
    accredited: typeof data.accredited === "boolean" ? data.accredited : null,
    website: data.website || null,
    linkedin: data.linkedin || null,

    organization: data.organization || null,
    reason: data.reason || null,
    message: data.message || null,

    ip: data.ip || null,
    user_agent: data.userAgent || null,
  };

  const { data: inserted, error } = await supabase
    .from("investor_leads")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  return inserted;
}
