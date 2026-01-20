import { supabase } from "./supabase";
import { audit } from "./investorStore";

export async function expireExpiredInvestors() {
  const nowIso = new Date().toISOString();

  const { data: rows } = await supabase
    .from("investors")
    .select("*")
    .eq("status", "APPROVED")
    .lt("expires_at", nowIso)
    .limit(500);

  const expired = rows ?? [];
  for (const inv of expired) {
    await supabase.from("investors").update({ status: "EXPIRED" }).eq("email", inv.email);
    await audit(inv.email, "EXPIRED", { expiresAt: inv.expires_at });
  }

  return { expiredCount: expired.length };
}
