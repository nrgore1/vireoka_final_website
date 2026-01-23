<<<<<<< HEAD
import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only, API routes only
    { auth: { persistSession: false } }
  );
}

export function requireAdminToken(req: Request) {
  const token = req.headers.get("x-admin-token");
  return Boolean(token && token === process.env.INVESTOR_ADMIN_TOKEN);
=======
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
>>>>>>> rebuild-forward
}
