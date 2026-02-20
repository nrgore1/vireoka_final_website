import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Legacy admin-token guard for old API endpoints.
 * If ADMIN_API_BEARER_TOKEN is set, require:
 *   Authorization: Bearer <token>
 * Otherwise returns false (locked down by default).
 */
export function requireAdminToken(req: Request) {
  const expected = process.env.ADMIN_API_BEARER_TOKEN;
  if (!expected) return false;

  const auth = req.headers.get("authorization") || "";
  const prefix = "Bearer ";
  if (!auth.startsWith(prefix)) return false;

  const token = auth.slice(prefix.length).trim();
  return token === expected;
}
