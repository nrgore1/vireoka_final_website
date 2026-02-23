import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function requireNdaAcceptance(email: string) {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("investors")
    .select("nda_accepted_at")
    .eq("email", email)
    .single();

  if (!data?.nda_accepted_at) {
    redirect("/intelligence/nda");
  }
}
