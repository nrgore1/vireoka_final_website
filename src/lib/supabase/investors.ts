import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getInvestorByEmail(email: string) {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("investors")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}

export async function requireNdaAccepted(email: string) {
  const investor = await getInvestorByEmail(email);
  return Boolean(investor?.nda_accepted_at);
}

export async function acceptNda(email: string, ip?: string) {
  const sb = supabaseAdmin();
  await sb
    .from("investors")
    .update({
      nda_accepted_at: new Date().toISOString(),
      nda_ip: ip ?? null,
    })
    .eq("email", email);
}
