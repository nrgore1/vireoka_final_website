import { supabaseAdmin } from "@/lib/supabase/admin";

export async function audit(
  actor: string | null,
  action: string,
  target?: string,
  metadata?: any
) {
  const supabase = supabaseAdmin();
  await supabase.from("audit_logs").insert({
    actor_email: actor,
    action,
    target,
    metadata,
  });
}
