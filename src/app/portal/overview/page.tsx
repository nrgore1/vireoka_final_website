import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { getInvestorContext } from "@/lib/portal/context";

export const dynamic = "force-dynamic";

function cardsForTier(type: string, rank: number) {
  // Angel+ get Intelligence + filtered search; VC/Corporate/Family get full diligence motion
  if (type === "advisor" || type === "contractor") {
    return [
      { href: "/portal/vdr", title: "Positioning Pack", desc: "Executive memo, market framing, and terminology charter (sanitized)." },
      { href: "/portal/activity", title: "Your Activity", desc: "Access is time-bound, logged, and reviewable." },
      { href: "/portal/vdr", title: "Roadmap (High-Level)", desc: "12-month milestones without engine internals." },
    ];
  }

  if (type === "crowd") {
    return [
      { href: "/portal/vdr", title: "Executive Summary", desc: "Public-private diligence packet and guided demo materials." },
      { href: "/portal/vdr", title: "Use Cases", desc: "Vertical examples and proof points (aggregate only)." },
      { href: "/portal/activity", title: "Your Activity", desc: "A transparent log of your portal actions." },
    ];
  }

  if (type === "angel" || rank >= 20) {
    return [
      { href: "/portal/vdr", title: "Pitch + Traction", desc: "Deck, use of funds, and traction metrics." },
      { href: "/portal/intelligence", title: "AI Data Room Search", desc: "Ask questions over tier-filtered diligence docs (with citations)." },
      { href: "/portal/cap-table", title: "Cap Table Simulator", desc: "Model dilution outcomes for the $10M round (Angel+)." },
    ];
  }

  // VC / Family / Corporate default
  return [
    { href: "/portal/vdr", title: "Full VDR", desc: "Legal, security, GTM, and financial diligence materials (tiered)." },
    { href: "/portal/scenarios", title: "Scenario Simulator", desc: "Deterministic projections: CAC, churn, ARPU, expansion, EBITDA." },
    { href: "/portal/intelligence", title: "AI Data Room Search", desc: "Full-corpus diligence search with citations and query logging." },
  ];
}

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

  const cards = cardsForTier(ctx.investorType, ctx.tierRank);

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
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <a key={c.href} href={c.href} className="rounded-xl border p-5 hover:bg-neutral-50">
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-neutral-600 mt-1">{c.desc}</div>
          </a>
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

      <div className="rounded-xl border p-5 space-y-2">
        <div className="font-semibold">What you can do here</div>
        <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
          <li><span className="font-semibold">AI Data Room Search</span> (Angel+): ask diligence questions and get cited answers.</li>
          <li><span className="font-semibold">Cap Table Simulator</span> (Angel+): interactively model $10M round dilution.</li>
          <li><span className="font-semibold">Scenario Simulator</span> (Corporate/Family/VC): deterministic projections and downside cases.</li>
        </ul>
      </div>
    </main>
  );
}
