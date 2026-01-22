import { supabaseAdmin } from "@/lib/supabase/admin";

export async function logPageAccess(email: string, path: string) {
  const supabase = supabaseAdmin();
  await supabase.from("page_access_logs").insert({
    email,
    path,
  });
}
