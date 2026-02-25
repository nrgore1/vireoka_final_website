import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase admin client (service role).
 * Keep this file small + dependency-free so it can be used across route handlers.
 */

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function createAdminClient(): SupabaseClient {
  const url = mustGetEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = mustGetEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Back-compat alias: many modules import supabaseAdmin()
 */
export function supabaseAdmin(): SupabaseClient {
  return createAdminClient();
}

/**
 * Admin token guard for API endpoints.
 * Uses env var ADMIN_TOKEN_VALUE and header:
 *   - x-admin-token: <token>
 *   - OR Authorization: Bearer <token>
 */
export function requireAdminToken(req: Request): boolean {
  const expected = (process.env.ADMIN_TOKEN_VALUE || "").trim();
  if (!expected) return false;

  const h = req.headers;
  const fromHeader = (h.get("x-admin-token") || "").trim();

  const auth = (h.get("authorization") || "").trim();
  const fromBearer =
    auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";

  const tok = fromHeader || fromBearer;
  if (!tok) return false;

  return tok === expected;
}

/**
 * Back-compat helper used by some endpoints.
 */
export function requireAdminTokenOrThrow(req: Request): void {
  if (!requireAdminToken(req)) {
    const err: any = new Error("unauthorized");
    err.status = 401;
    throw err;
  }
}
