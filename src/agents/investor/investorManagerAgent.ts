import { getNdaStatus } from "@/agents/nda/ndaAgent";
import { getTermsStatus } from "@/agents/terms/termsAgent";
import { fetchMe } from "@/repo/accessRepo";
import { verifyInvestorSession } from "@/lib/investorSession";

/**
 * Internal states (kept for any non-portal callers)
 */
export type AccessState =
  | "logged_out"
  | "no_access"
  | "needs_nda"
  | "needs_terms"
  | "active";

/**
 * Portal-facing states (what pages/layout compare against)
 */
export type PortalAccessState =
  | "logged_out"
  | "pending_approval"
  | "nda_missing"
  | "terms_missing"
  | "allowed";

export type AccessCheckResult =
  | { ok: true; role: string; state: "allowed" }
  | { ok: false; state: Exclude<PortalAccessState, "allowed"> };

function isAcceptedStatus(s: unknown): boolean {
  if (typeof s !== "string") return false;
  return s.toLowerCase() === "accepted";
}

function pickRole(me: unknown): string {
  const m: any = me as any;
  const role =
    m?.role ??
    m?.data?.role ??
    m?.user?.role ??
    m?.profile?.role ??
    m?.lead?.role;
  return typeof role === "string" && role.length > 0 ? role : "investor";
}

/**
 * Keep internal helper in case other code imports it.
 */
export async function resolveInvestorAccess(): Promise<AccessState> {
  try {
    await verifyInvestorSession();

    const me = await fetchMe();
    if (!me) return "no_access";

    const nda = await getNdaStatus();
    if (!isAcceptedStatus((nda as any)?.status)) return "needs_nda";

    const terms = await getTermsStatus();
    if (!isAcceptedStatus((terms as any)?.status)) return "needs_terms";

    return "active";
  } catch {
    return "logged_out";
  }
}

/**
 * ✅ Portal compatibility: returns { ok, role, state } where allowed state === "allowed"
 */
export async function accessCheck(): Promise<AccessCheckResult> {
  try {
    await verifyInvestorSession();

    const me = await fetchMe();
    if (!me) return { ok: false, state: "pending_approval" };

    const nda = await getNdaStatus();
    if (!isAcceptedStatus((nda as any)?.status)) return { ok: false, state: "nda_missing" };

    const terms = await getTermsStatus();
    if (!isAcceptedStatus((terms as any)?.status)) return { ok: false, state: "terms_missing" };

    return { ok: true, role: pickRole(me), state: "allowed" };
  } catch {
    return { ok: false, state: "logged_out" };
  }
}
