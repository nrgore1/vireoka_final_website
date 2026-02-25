export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/**
 * Service-role Supabase client (server-only).
 */
export function createAdminClient() {
  const url = mustGetEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = mustGetEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Backward-compatible alias used across the codebase.
 */
export function supabaseAdmin() {
  return createAdminClient();
}

/**
 * Admin API token: supports both:
 *  - x-admin-token: <token>
 *  - Authorization: Bearer <token>
 *
 * Expected token comes from one of:
 *  - ADMIN_TOKEN_VALUE
 *  - ADMIN_API_TOKEN
 *  - ADMIN_API_BEARER_TOKEN
 */
export function requireAdminToken(req: Request): boolean {
  const expected =
    process.env.ADMIN_TOKEN_VALUE ||
    process.env.ADMIN_API_TOKEN ||
    process.env.ADMIN_API_BEARER_TOKEN ||
    "";

  if (!expected) return false;

  const hdr = req.headers;
  const viaHeader = (hdr.get("x-admin-token") || "").trim();

  const auth = (hdr.get("authorization") || "").trim();
  const viaBearer = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";

  const token = viaHeader || viaBearer;
  return token.length > 0 && token === expected;
}

export function requireAdminTokenOrThrow(req: Request) {
  if (!requireAdminToken(req)) {
    const err = new Error("unauthorized");
    (err as any).status = 401;
    throw err;
  }
}
