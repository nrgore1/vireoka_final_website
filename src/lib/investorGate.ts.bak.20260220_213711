import { redirect } from "next/navigation";
import { verifyInvestorSession } from "@/lib/investorSession";
import { requireNdaAccepted } from "@/lib/supabase/investors";

export async function requireInvestorAccess() {
  const session = await verifyInvestorSession();
  if (!session?.email) redirect("/investors");

  const ndaOk = await requireNdaAccepted(session.email);
  if (!ndaOk) redirect("/investors/nda");

  return session;
}
