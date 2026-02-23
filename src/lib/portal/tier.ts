export type TierKey =
  | "crowd"
  | "advisor"
  | "contractor"
  | "angel"
  | "corporate"
  | "family"
  | "vc";

export function normalizeTier(input: string | null | undefined): TierKey {
  const s = String(input || "").toLowerCase().trim();
  if (!s) return "crowd";
  if (s === "vc" || s.includes("venture")) return "vc";
  if (s.includes("family")) return "family";
  if (s.includes("corporate") || s.includes("strategic")) return "corporate";
  if (s.includes("angel")) return "angel";
  if (s.includes("advisor")) return "advisor";
  if (s.includes("contract")) return "contractor";
  if (s.includes("crowd")) return "crowd";
  return "crowd";
}

export function tierRank(t: TierKey): number {
  switch (t) {
    case "vc":
      return 40;
    case "family":
      return 35;
    case "corporate":
      return 30;
    case "angel":
      return 20;
    case "advisor":
    case "contractor":
      return 15;
    case "crowd":
    default:
      return 10;
  }
}

export function tierLabel(rank: number) {
  if (rank >= 40) return "VC (Full Due Diligence)";
  if (rank >= 35) return "Family Office (Financial / Legacy)";
  if (rank >= 30) return "Corporate / Strategic (Synergetic)";
  if (rank >= 20) return "Angel (Intermediate)";
  if (rank >= 15) return "Advisor / Contractor (Collaborative)";
  return "Crowd (Public-Private)";
}

export function requiredRankForFeature(feature: "intelligence" | "cap_table" | "scenarios") {
  if (feature === "intelligence") return 20; // Angel+
  if (feature === "cap_table") return 20; // Angel+
  if (feature === "scenarios") return 30; // Corporate/Family/VC
  return 10;
}
