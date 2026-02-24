import { getNdaStatus } from "@/agents/nda/ndaAgent";
import { getSessionUser } from "@/lib/auth/session";
import { fetchExistingPortalAccessCheck } from "@/repo/accessRepo";

/**
 * Central access decision used by /api/intelligence/access-check and protected pages.
 * Deny by default.
 */
export async function accessCheck(): Promise<{
  ok: boolean;
  state:
    | "logged_out"
    | "nda_missing"
    | "terms_missing"
    | "role_denied"
    | "allowed";
  role?: string | null;
}> {
  const user = await getSessionUser();
  if (!user) return { ok: false, state: "logged_out", role: null };

  // NDA gate
  const nda = await getNdaStatus();
  if (nda.status !== "accepted") return { ok: false, state: "nda_missing", role: null };

  // Existing repo function reads session/cookies internally (takes 0 args)
  const access: any = await fetchExistingPortalAccessCheck();

  // Be conservative about shape; support a few likely fields
  const role = access?.role ?? access?.userRole ?? null;
  const allowed = Boolean(access?.allowed ?? access?.ok ?? false);
  const termsAccepted = Boolean(access?.termsAccepted ?? access?.hasAcceptedTerms ?? access?.terms ?? false);

  if (!termsAccepted) return { ok: false, state: "terms_missing", role };
  if (!allowed) return { ok: false, state: "role_denied", role };

  return { ok: true, state: "allowed", role };
}
