import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function logInvestorEvent(
  email: string,
  type: string,
  path: string
) {
  const sb = supabaseAdmin();
  await sb.from("investor_events").insert({
    email,
    type,
    path,
    created_at: new Date().toISOString(),
  });
}
