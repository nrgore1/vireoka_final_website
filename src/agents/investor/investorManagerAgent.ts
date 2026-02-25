import { getNdaStatus } from "@/agents/nda/ndaAgent";
import { getTermsStatus } from "@/agents/terms/termsAgent";
import { fetchMe } from "@/repo/accessRepo";
import { verifyInvestorSession } from "@/lib/investorSession";

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

function pickRole(meData: any): string {
  const role =
    meData?.role ??
    meData?.investor?.role ??
    meData?.data?.role ??
    "investor";
  return typeof role === "string" && role.length > 0 ? role : "investor";
}

export async function accessCheck(): Promise<AccessCheckResult> {
  try {
    // must have an investor session (cookie-based)
    await verifyInvestorSession();

    const me = await fetchMe();
    if (!me?.ok) return { ok: false, state: "pending_approval" };

    const meData = me.data || {};
    const approved = Boolean(meData.approved);

    if (!approved) return { ok: false, state: "pending_approval" };

    const nda = await getNdaStatus();
    if (!isAcceptedStatus(nda?.status)) return { ok: false, state: "nda_missing" };

    const terms = await getTermsStatus();
    if (!isAcceptedStatus(terms?.status)) return { ok: false, state: "terms_missing" };

    return { ok: true, role: pickRole(meData), state: "allowed" };
  } catch {
    return { ok: false, state: "logged_out" };
  }
}
