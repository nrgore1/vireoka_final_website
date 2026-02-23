import { cookies } from "next/headers";
import { normalizeTier, tierRank } from "@/lib/portal/tier";

export type InvestorContext = {
  email: string;
  investorType: string;  // crowd|angel|vc|family|corporate|advisor|contractor
  tierRank: number;
  expiresAt?: string | null;
  isAdmin: boolean;
  previewTier?: string | null;
};

async function readRole(sb: any, userId: string) {
  try {
    const { data } = await sb.from("profiles").select("role").eq("id", userId).maybeSingle();
    return String(data?.role || "");
  } catch {
    return "";
  }
}

export async function getInvestorContext(sb: any): Promise<InvestorContext> {
  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;

  if (!user) {
    return {
      email: "",
      investorType: "crowd",
      tierRank: 10,
      expiresAt: null,
      isAdmin: false,
      previewTier: null,
    };
  }

  const role = String(await readRole(sb, user.id)).toLowerCase();
  const isAdmin = role === "admin";

  // Load investor row if present
  let investorType = "crowd";
  let rank = 10;
  let expiresAt: string | null = null;

  try {
    const { data } = await sb
      .from("investors")
      .select("stakeholder_type,tier_rank,access_expires_at")
      .eq("user_id", user.id)
      .maybeSingle();

    const st = String(data?.stakeholder_type || "").toLowerCase();
    if (st) investorType = normalizeTier(st);

    const tr = Number(data?.tier_rank);
    if (Number.isFinite(tr) && tr > 0) rank = tr;

    expiresAt = data?.access_expires_at || null;
  } catch {}

  // Admin-only preview override via cookie
  let previewTier: string | null = null;
  if (isAdmin) {
    try {
      const jar = await cookies();
      const t = jar.get("vireoka_portal_preview_tier")?.value || "";
      if (t) {
        previewTier = normalizeTier(t);
        investorType = previewTier;
        rank = tierRank(previewTier as any);
      }
    } catch {}
  }

  return {
    email: String(user.email || ""),
    investorType,
    tierRank: rank,
    expiresAt,
    isAdmin,
    previewTier,
  };
}
