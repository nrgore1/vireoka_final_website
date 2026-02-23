import { supabaseServerClient } from "@/lib/supabase/serverClient";

export function normalizeEmail(email: unknown) {
  return String(email || "").trim().toLowerCase();
}

/**
 * Returns the latest investor application row for an email (if present).
 * This keeps legacy API routes working that still reference investor_applications.
 *
 * Expected by /api/investors/check:
 * - returns object with `.status` (e.g. "approved")
 */
export async function getInvestorByEmail(email: string) {
  const sb = await supabaseServerClient();
  const e = normalizeEmail(email);
  if (!e) return null;

  // Try investor_applications first (most legacy flows use this)
  const { data: app, error: appErr } = await (sb as any)
    .from("investor_applications")
    .select("id,email,status,created_at")
    .eq("email", e)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!appErr && app) return app;

  // Fallback to investors table (newer flow may store state here)
  const { data: inv } = await (sb as any)
    .from("investors")
    .select("id,email,access_granted_at,access_revoked_at,access_expires_at,nda_signed_at,created_at")
    .eq("email", e)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!inv) return null;

  // Map to a "status" shape compatible with legacy usage.
  // approved = has NDA + granted + not revoked + not expired
  const revoked = Boolean(inv.access_revoked_at);
  const granted = Boolean(inv.access_granted_at);
  const nda = Boolean(inv.nda_signed_at);

  let expired = false;
  if (inv.access_expires_at) {
    const exp = new Date(inv.access_expires_at).getTime();
    expired = !Number.isNaN(exp) && exp <= Date.now();
  }

  const status = !revoked && granted && nda && !expired ? "approved" : "pending";

  return {
    ...inv,
    status,
  };
}

export type IntelligenceAccessCheck =
  | { ok: true; allowed: true; reason: "admin" | "granted"; tier_rank?: number; expires_at?: string | null }
  | {
      ok: true;
      allowed: false;
      reason:
        | "unauthenticated"
        | "no_investor_record"
        | "nda_required"
        | "pending"
        | "expired"
        | "revoked";
    }
  | { ok: false; error: string };

/**
 * Server-side check used by portal middleware/access-check routes.
 * Conservative rules:
 * - Admins always allowed.
 * - Investors require NDA + explicit grant + not expired + not revoked.
 */
export async function intelligenceAccessCheck(): Promise<IntelligenceAccessCheck> {
  try {
    const sb = await supabaseServerClient();

    const { data: userRes, error: userErr } = await sb.auth.getUser();
    const user = userRes?.user;

    if (userErr || !user) {
      return { ok: true, allowed: false, reason: "unauthenticated" };
    }

    // Admin bypass
    try {
      const { data: prof } = await (sb as any)
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = String(prof?.role || "").toLowerCase();
      if (role === "admin") {
        return { ok: true, allowed: true, reason: "admin", tier_rank: 40, expires_at: null };
      }
    } catch {
      // fall through
    }

    const { data: inv } = await (sb as any)
      .from("investors")
      .select("nda_signed_at,access_granted_at,access_expires_at,access_revoked_at,tier_rank")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!inv) return { ok: true, allowed: false, reason: "no_investor_record" };
    if (!inv.nda_signed_at) return { ok: true, allowed: false, reason: "nda_required" };
    if (inv.access_revoked_at) return { ok: true, allowed: false, reason: "revoked" };
    if (!inv.access_granted_at) return { ok: true, allowed: false, reason: "pending" };

    if (inv.access_expires_at) {
      const exp = new Date(inv.access_expires_at).getTime();
      if (!Number.isNaN(exp) && exp <= Date.now()) {
        return { ok: true, allowed: false, reason: "expired" };
      }
    }

    return {
      ok: true,
      allowed: true,
      reason: "granted",
      tier_rank: Number(inv.tier_rank || 10),
      expires_at: inv.access_expires_at || null,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || "server_error" };
  }
}
