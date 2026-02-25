import { readAdminSession } from "@/lib/adminSession";
import { requireAdminToken } from "@/lib/supabase/admin";

/**
 * Admin access strategy (Option A):
 * - Prefer token auth for API routes (x-admin-token)
 * - Otherwise allow cookie-based admin session created by /api/admin/login
 */
export async function requireAdmin(req?: Request): Promise<{ email: string } | null> {
  // Token-based admin (API-to-API)
  if (req && requireAdminToken(req)) {
    const email = process.env.ADMIN_EMAIL || "admin@vireoka.com";
    return { email };
  }

  // Cookie session-based admin (browser)
  const sess = await readAdminSession();
  if (!sess?.email) return null;

  const allowed = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!allowed) return null;

  if (sess.email.trim().toLowerCase() !== allowed) return null;
  return { email: sess.email };
}

export async function requireAdminOrThrow(req?: Request) {
  const admin = await requireAdmin(req);
  if (!admin) throw new Error("unauthorized");
  return admin;
}
