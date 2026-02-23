import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { getInvestorContext } from "@/lib/portal/context";
import { LockedCard } from "@/components/portal/LockedCard";
import { requiredRankForFeature, tierLabel } from "@/lib/portal/tier";

export const dynamic = "force-dynamic";

export default async function Page() {
  const sb = await supabaseServerClient();
  const { data: userRes } = await sb.auth.getUser();
  if (!userRes?.user) redirect("/portal/login");

  const ctx = await getInvestorContext(sb as any);

  const headline =
    ctx.investorType === "vc"
      ? "Vireoka Intelligence for Full Due Diligence"
      : ctx.investorType === "family"
      ? "Vireoka Investor Portal for Long-Term Capital"
      : ctx.investorType === "corporate"
      ? "Vireoka Strategic Partner Portal"
      : ctx.investorType === "angel"
      ? "Vireoka Investor Portal (Intermediate Access)"
      : ctx.investorType === "advisor"
      ? "Vireoka Advisory Portal (Collaborative)"
      : ctx.investorType === "contractor"
      ? "Vireoka Contractor Portal (Functional)"
      : "Vireoka Investor Portal";

  const modules = [
    {
      href: "/portal/vdr",
      title: "Virtual Data Room",
      subtitle: "Diligence Materials",
      desc: "Tiered documents across legal, security, market, traction, GTM, and financials.",
      required: 10,
    },
    {
      href: "/portal/intelligence",
      title: "AI Data Room Search",
      subtitle: "Ask + Cite",
      desc: "Ask diligence questions over controlled documents and get cited answers.",
      required: requiredRankForFeature("intelligence"),
    },
    {
      href: "/portal/cap-table",
      title: "Cap Table Simulator",
      subtitle: "$10M round modeling",
      desc: "Interactive dilution, valuation, and waterfall outcomes for the raise.",
      required: requiredRankForFeature("cap_table"),
    },
    {
      href: "/portal/scenarios",
      title: "Scenario Simulator",
      subtitle: "Deterministic projections",
      desc: "CAC, churn, ARPU, expansion, EBITDA, downside cases—no hallucinations.",
      required: requiredRankForFeature("scenarios"),
    },
    {
      href: "/portal/activity",
      title: "Your Activity",
      subtitle: "Audit log",
      desc: "Your portal activity is logged for security and compliance.",
      required: 10,
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <div className="text-xs tracking-wide uppercase text-neutral-500 font-semibold">
          Vireoka • Controlled Diligence Environment
        </div>
        <h1 className="text-3xl font-semibold">{headline}</h1>
        <p className="text-neutral-700 max-w-3xl">
          A $10M raise requires controlled disclosure architecture—not just a folder of PDFs.
          This portal is time-bound, tiered, watermarked, and logged.
        </p>
        <div className="text-sm text-neutral-600">
          Current tier: <span className="font-semibold">{tierLabel(ctx.tierRank)}</span>
          {ctx.isAdmin && ctx.previewTier ? (
            <span className="ml-2 rounded-md border px-2 py-1 text-xs bg-neutral-50">
              Admin preview: {ctx.previewTier}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {modules.map((m) => (
          <LockedCard
            key={m.href}
            title={m.title}
            subtitle={m.subtitle}
            description={m.desc}
            href={m.href}
            locked={ctx.tierRank < m.required}
            ctaHref="/portal/request-extension"
          />
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-2">
        <div className="font-semibold">What Vireoka protects (always)</div>
        <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
          <li>Internal engine naming and proprietary multi-agent council weighting.</li>
          <li>Raw heuristics, training corpus, source code, and internal scoring mechanisms.</li>
          <li>Anything not required to establish diligence confidence at your tier.</li>
        </ul>
      </div>
    </main>
  );
}
