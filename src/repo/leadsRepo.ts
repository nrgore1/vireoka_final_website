import { getServiceSupabase } from "@/lib/supabase/serverClients";

export type LeadStatus = "NEW" | "APPROVED" | "REVOKED";

export async function getLatestLeadByEmail(email: string) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("investor_leads")
    .select("id, email, status, investor_type, reference_code, created_at")
    .eq("email", email.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return (data && data[0]) || null;
}

export async function getApprovalForEmail(email: string): Promise<{
  ok: true;
  status: LeadStatus | null;
  role: string | null;
  leadId: string | null;
}> {
  const lead = await getLatestLeadByEmail(email);
  return {
    ok: true,
    status: (lead?.status as LeadStatus) || null,
    role: (lead?.investor_type as string) || null,
    leadId: (lead?.id as string) || null,
  };
}
