import { getSupabase } from "./supabase";
import { audit } from "./investorStore";

export async function expireIfNeeded(investor: any) {
  if (!investor?.expires_at) return investor;

  if (new Date(investor.expires_at) < new Date()) {
    const supabase = getSupabase();

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

export async function expireExpiredInvestors() {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("status", "APPROVED")
    .lt("expires_at", new Date().toISOString());

  let expired = 0;

  for (const inv of data ?? []) {
    await expireIfNeeded(inv);
    expired++;
  }

  return { expired };
}
