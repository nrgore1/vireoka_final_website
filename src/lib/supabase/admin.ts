import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Admin token guard.
 * Admin requests MUST include:
 * Authorization: Bearer <ADMIN_TOKEN>
 */
export function requireAdminToken(req: Request): boolean {
  const header = req.headers.get("authorization");
  if (!header) return false;

  const token = header.replace("Bearer ", "");
  return token === process.env.ADMIN_TOKEN;
}
