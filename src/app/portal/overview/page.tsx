import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function bestEffortGetInvestorContext(sb: any, userId: string) {
  const tryTables = ["profiles", "investor_portal_access", "portal_access", "investor_access"];

  for (const table of tryTables) {
    try {
      const byIdCol = table === "profiles" ? "id" : "user_id";
      const { data, error } = await (sb as any)
        .from(table)
        .select("*")
        .eq(byIdCol, userId)
        .maybeSingle();

      if (!error && data) return { table, row: data };
    } catch {
      // ignore
    }
  }
  return { table: null, row: null };
}

function normalizeType(v: any): string {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return "investor";
  if (s.includes("vc") || s.includes("venture")) return "vc";
  if (s.includes("angel")) return "angel";
  if (s.includes("family")) return "family_office";
  if (s.includes("corporate") || s.includes("strategic")) return "corporate";
  if (s.includes("pe") || s.includes("private")) return "pe";
  return "investor";
}

export default async function Page() {
  const sb = await supabaseServerClient();

  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;

  if (!user) redirect("/portal/login");

  const email = String(user.email || "").toLowerCase();

  const { row } = await bestEffortGetInvestorContext(sb as any, user.id);

  const investorType = normalizeType(
    row?.investor_type ?? row?.type ?? row?.category ?? row?.segment
  );

  const tierRank = Number(row?.tier_rank ?? row?.tier ?? 0);

  const headline =
    investorType === "vc"
      ? "Vireoka Intelligence for Institutional Diligence"
      : investorType === "angel"
      ? "Vireoka Investor Portal"
      : investorType === "corporate"
      ? "Vireoka Partner & Investor Portal"
      : "Vireoka Investor Portal";

  const primaryCards =
    investorType === "vc"
      ? [
          { href: "/portal/vdr", title: "Virtual Data Room", desc: "Tiered diligence materials, watermarked and logged." },
          { href: "/portal/cap-table", title: "Cap Table Simulator", desc: "Model dilution and valuation outcomes for the round." },
          { href: "/portal/scenarios", title: "Scenario Models", desc: "Deterministic projection views and downside cases." },
        ]
      : investorType === "angel"
      ? [
          { href: "/portal/vdr", title: "Data Room Highlights", desc: "Quick-start diligence set: deck, memo, and KPIs." },
          { href: "/portal/intelligence", title: "AI Insights", desc: "Ask questions and view structured answers." },
          { href: "/portal/activity", title: "Your Activity", desc: "Track your access and recent actions." },
        ]
      : investorType === "corporate"
      ? [
          { href: "/portal/intelligence", title: "AI Insights", desc: "Governance architecture, controls, and integration pathways." },
          { href: "/portal/vdr", title: "Security & Trust Pack", desc: "Controls, audit model, and evidence trails." },
          { href: "/portal/activity", title: "Engagement Log", desc: "Review your access trail and session activity." },
        ]
      : [
          { href: "/portal/intelligence", title: "AI Insights", desc: "Ask scenario questions and explore governance logic." },
          { href: "/portal/vdr", title: "Virtual Data Room", desc: "Tiered diligence materials with logging." },
          { href: "/portal/activity", title: "Activity", desc: "Review access and recent events." },
        ];

  const accessLabel =
    tierRank >= 3 ? "Full diligence access" : tierRank >= 2 ? "Standard diligence access" : "Basic access";

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <div className="text-xs tracking-wide uppercase text-neutral-500 font-semibold">
          Vireoka • Investor Portal
        </div>
        <h1 className="text-3xl font-semibold">{headline}</h1>
        <p className="text-neutral-700 max-w-3xl">
          Confidential diligence environment. Access is selective, time-bound, watermarked, and logged.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {primaryCards.map((c) => (
          <a key={c.href} href={c.href} className="rounded-xl border p-5 hover:bg-neutral-50">
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-neutral-600 mt-1">{c.desc}</div>
          </a>
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-2">
        <div className="font-semibold">Your access</div>
        <div className="text-sm text-neutral-700">
          Signed in as <span className="font-semibold">{email || "—"}</span>.
        </div>
        <div className="text-sm text-neutral-700">
          Access tier: <span className="font-semibold">{accessLabel}</span>
          <span className="text-neutral-500">{" "}•{" "}</span>
          Investor type: <span className="font-semibold">{investorType.replace("_", " ")}</span>
        </div>
      </div>

      <div className="rounded-xl border p-5">
        <div className="font-semibold">Vireoka focus areas</div>
        <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
          <li>Policy gates (ALLOW / REVIEW / BLOCK) for agentic actions</li>
          <li>Replayable evidence trails and traceable lineage</li>
          <li>Human oversight at scale: councils, quorums, confidence scoring</li>
        </ul>
      </div>
    </main>
  );
}
