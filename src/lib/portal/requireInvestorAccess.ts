import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/serverClient";

type InvestorAccessOptions = {
  // Where to send unauthenticated users
  loginPath?: string;
  // Where to send authenticated but unauthorized users
  deniedPath?: string;
};

/**
 * Require that the current user is signed in AND has investor access.
 * Redirects instead of throwing.
 *
 * IMPORTANT: Update the access check query below to match your schema.
 */
export async function requireInvestorAccess(
  opts: InvestorAccessOptions = {}
) {
  const loginPath = opts.loginPath ?? "/portal/login";
  const deniedPath = opts.deniedPath ?? "/portal/access-denied";

  const sb = await supabaseServerClient();

  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr || !userRes?.user) {
    redirect(loginPath);
  }

  const user = userRes.user;

  /**
   * ---- Customize this block to your schema ----
   * Example strategy: look up a profile row with a role / tier / flag.
   *
   * If you already have a function like `hasInvestorAccess(user.id)`,
   * use it here instead.
   */
  const { data: profile, error: profErr } = await sb
    .from("profiles")
    .select("id, role, tier_rank, investor_access")
    .eq("id", user.id)
    .maybeSingle();

  // If the lookup fails or returns nothing, treat as no access (but don't crash the page)
  if (profErr || !profile) {
    redirect(deniedPath);
  }

  // Accept a few common patterns (any one can grant access)
  const role = String((profile as any).role ?? "").toLowerCase();
  const tierRank = Number((profile as any).tier_rank ?? 0);
  const investorAccess = Boolean((profile as any).investor_access ?? false);

  const hasAccess =
    investorAccess ||
    role === "investor" ||
    role === "admin" ||
    tierRank >= 1;

  if (!hasAccess) {
    redirect(deniedPath);
  }

  return { user, profile };
}
