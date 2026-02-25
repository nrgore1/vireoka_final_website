import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Marks NDA accepted for approved investor.
 * Keeps logic separate from route.
 */
export async function markNdaAccepted(email: string) {
  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("investor_leads")
    .update({
      nda_accepted: true,
      nda_accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("email", email);

  if (error) {
    throw new Error("Failed to mark NDA accepted");
  }

  return { ok: true };
}
