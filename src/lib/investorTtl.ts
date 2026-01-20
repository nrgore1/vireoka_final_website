import { getSupabase } from "./supabase";
import { audit } from "./investorStore";

export async function expireExpiredInvestors() {
  const supabase = getSupabase();

  const now = new Date().toISOString();

  const { data: expired } = await supabase
    .from("investors")
    .select("email")
    .lt("expires_at", now)
    .eq("status", "APPROVED");

  for (const inv of expired ?? []) {
    await supabase
      .from("investors")
      .update({ status: "EXPIRED" })
      .eq("email", inv.email);

    await audit(inv.email, "EXPIRED");
  }

  return { expired: expired?.length ?? 0 };
}
