import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function isExpired(ts?: string | null) {
  if (!ts) return false;
  return new Date(ts).getTime() < Date.now();
}

export default async function InvestorGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔹 NOT LOGGED IN → REQUEST ACCESS (FIRST-TIME FLOW)
  if (!user?.email) {
    redirect("/request-access");
  }

  // 🔹 LOGGED IN → CHECK INVESTOR RECORD
  const { data: investor, error } = await supabase
    .from("investors")
    .select("nda_signed, invite_expires_at, access_expires_at")
    .eq("email", user.email)
    .single();

  // 🔹 LOGGED IN BUT NOT INVITED / APPROVED
  if (error || !investor) {
    redirect("/request-access");
  }

  // 🔹 INVITE OR ACCESS EXPIRED
  if (
    isExpired(investor.invite_expires_at) ||
    isExpired(investor.access_expires_at)
  ) {
    redirect("/investors/expired");
  }

  // 🔹 NDA NOT SIGNED
  if (!investor.nda_signed) {
    redirect("/investors/nda");
  }

  // 🔹 UPDATE LAST ACCESS
  await supabase
    .from("investors")
    .update({ last_access: new Date().toISOString() })
    .eq("email", user.email);

  return <>{children}</>;
}
