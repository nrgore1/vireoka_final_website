import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client (server-only)
 */
export function supabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Simple admin token guard for API routes
 */
export function requireAdminToken(req: Request): boolean {
  const token = req.headers.get("x-admin-token");
  return Boolean(token && token === process.env.INVESTOR_ADMIN_TOKEN);
}
