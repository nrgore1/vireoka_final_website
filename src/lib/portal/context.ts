export type InvestorContext = {
  email: string;
  investorType: string;   // advisor|contractor|crowd|angel|vc|family|corporate
  tierRank: number;       // 10..40
  expiresAt: string | null;
};

function normalizeType(v: any): string {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return "crowd";
  if (s.includes("advisor")) return "advisor";
  if (s.includes("contract")) return "contractor";
  if (s.includes("crowd")) return "crowd";
  if (s.includes("angel")) return "angel";
  if (s.includes("vc") || s.includes("venture")) return "vc";
  if (s.includes("family")) return "family";
  if (s.includes("corporate") || s.includes("strategic")) return "corporate";
  return "crowd";
}

function tierRankFromType(t: string): number {
  // fallback ordering (can be overridden by DB tier_rank)
  switch (t) {
    case "advisor": return 15;
    case "contractor": return 15;
    case "crowd": return 10;
    case "angel": return 20;
    case "family": return 35;
    case "corporate": return 30;
    case "vc": return 40;
    default: return 10;
  }
}

export async function getInvestorContext(sb: any): Promise<InvestorContext> {
  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;

  const email = String(user?.email || "").toLowerCase();

  // best-effort: read from one of several tables (no hard dependency)
  const candidates = ["investors", "profiles", "investor_portal_access", "portal_access", "investor_access"];

  for (const table of candidates) {
    try {
      const byIdCol = table === "profiles" ? "id" : (table === "investors" ? "user_id" : "user_id");
      const { data, error } = await (sb as any)
        .from(table)
        .select("*")
        .eq(byIdCol, user?.id)
        .maybeSingle();

      if (error || !data) continue;

      const investorType = normalizeType(
        data?.stakeholder_type ?? data?.investor_type ?? data?.type ?? data?.segment ?? data?.category
      );

      const tierRank = Number(data?.tier_rank ?? data?.tierRank ?? tierRankFromType(investorType));
      const expiresAt =
        data?.access_expires_at ?? data?.expires_at ?? data?.expiresAt ?? null;

      return {
        email,
        investorType,
        tierRank,
        expiresAt: expiresAt ? String(expiresAt) : null,
      };
    } catch {
      continue;
    }
  }

  // fallback context
  return { email, investorType: "crowd", tierRank: 10, expiresAt: null };
}
