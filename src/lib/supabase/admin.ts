import "server-only";
import { createClient } from "@supabase/supabase-js";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function supabaseAdmin() {
  const url = mustGet("SUPABASE_URL");
  const serviceRole = mustGet("SUPABASE_SERVICE_ROLE_KEY");

  // Service-role key MUST remain server-only.
  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
