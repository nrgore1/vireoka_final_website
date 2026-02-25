import { headers } from "next/headers";

/**
 * Admin auth for API routes.
 * Accepts x-admin-token if it matches either ADMIN_TOKEN_VALUE or ADMIN_TOKEN.
 */
export async function requireAdminToken(): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const h = await headers();
  const token = h.get("x-admin-token") || "";

  const expected = process.env.ADMIN_TOKEN_VALUE || process.env.ADMIN_TOKEN || "";
  if (!expected) {
    // If you prefer hard-fail when missing, keep this as 500.
    return { ok: false, status: 500, error: "admin token not configured" };
  }

  if (token && token === expected) return { ok: true };
  return { ok: false, status: 401, error: "unauthorized" };
}
