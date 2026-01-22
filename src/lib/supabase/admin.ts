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
}
