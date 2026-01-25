import { supabaseAdmin } from "@/lib/supabase/admin";

export async function assertInvestorAccess(email: string) {
  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("investors")
    .select("approved_at, nda_accepted_at")
    .eq("email", email)
    .single();

  if (!data?.approved_at) throw new Error("PENDING_REVIEW");
  if (!data?.nda_accepted_at) throw new Error("NDA_REQUIRED");
}
