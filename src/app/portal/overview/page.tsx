import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { getInvestorContext } from "@/lib/portal/context";
import { LockedCard } from "@/components/portal/LockedCard";
import { requiredRankForFeature, tierLabel } from "@/lib/portal/tier";

export const dynamic = "force-dynamic";

export default async function Page() {
  const sb = await supabaseServerClient();
  const ctx = await getInvestorContext(sb as any);

  const headline =
    ctx.investorType === "vc"
      ? "Full diligence environment for governed agentic workforces"
      : ctx.investorType === "family"
      ? "Long-term capital + risk framing for governed AI operations"
      : ctx.investorType === "corporate"
      ? "Strategic partner workspace for integration + governance"
      : ctx.investorType === "angel"
      ? "Intermediate access to product + governance narrative"
      : ctx.investorType === "advisor"
      ? "Collaborative advisory environment (controlled disclosure)"
      : ctx.investorType === "contractor"
      ? "Functional technical workspace (sanitized architecture)"
      : "Controlled strategic access environment";

  const modules = [
    {
      href: "/portal/vdr",
      title: "Virtual Data Room",
      subtitle: "Governed Diligence Materials",
      desc: "Structured disclosures across governance, infrastructure, financials, GTM, and agent architecture.",
      required: 10,
    },
    {
      href: "/portal/intelligence",
      title: "Agentic Intelligence Layer",
      subtitle: "Ask + Cite + Model",
      desc: "Query controlled materials and run deterministic scenario analysis—governed, logged, and citation-backed.",
      required: requiredRankForFeature("intelligence"), // Angel+
    },
    {
      href: "/portal/cap-table",
      title: "Capital Modeling",
      subtitle: "$10M Raise Simulation",
      desc: "Interactive valuation, dilution, and ownership modeling designed for fast diligence alignment.",
      required: requiredRankForFeature("cap_table"), // Angel+
    },
    {
      href: "/portal/scenarios",
      title: "Strategic Scenario Simulator",
      subtitle: "Growth + Risk Projections",
      desc: "Stress-test TAM capture, CAC, ARPU, churn, expansion, burn, and ROI paths under governance constraints.",
      required: requiredRankForFeature("scenarios"), // Corporate/Family/VC
    },
    {
      href: "/portal/activity",
      title: "Your Activity Log",
      subtitle: "Audit Transparency",
      desc: "A full record of your interactions within this controlled environment for security and compliance.",
      required: 10,
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-4">
        <div className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
          Vireoka • Governed Agentic Workforce Platform
        </div>

        <h1 className="text-3xl font-semibold">Vireoka Intelligence</h1>

        <p className="text-neutral-700 max-w-3xl">
          Vireoka Intelligence is a controlled-access strategic workspace for capital partners, advisors,
          technologists, and collaborators. It demonstrates how governed AI agents operate as structured
          digital employees inside enterprise environments.
        </p>

        <p className="text-neutral-700 max-w-3xl">
          Our approach breaks the cliché of “AI tools” and “generic copilots.” We build agentic ecosystems
          where autonomy is scoped by policy, actions are logged, and outcomes are reproducible—so AI can scale
          without creating uncontrolled operational risk.
        </p>

        <div className="text-sm text-neutral-600">
          Current tier: <span className="font-semibold">{tierLabel(ctx.tierRank)}</span>
          {ctx.isAdmin && ctx.previewTier ? (
            <span className="ml-2 rounded-md border px-2 py-1 text-xs bg-neutral-50">
              Admin preview: {ctx.previewTier}
            </span>
          ) : null}
        </div>

        <div className="text-sm text-neutral-600">{headline}</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
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

      <div className="rounded-xl border p-6 space-y-3">
        <div className="font-semibold text-lg">What makes Vireoka different</div>
        <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
          <li>AI agents operate as governed digital employees, not disconnected scripts.</li>
          <li>Composable architecture: add agents by function (infra, design, code, web, growth) without monolith lock-in.</li>
          <li>Event-driven orchestration so agents react in real time, safely.</li>
          <li>Scoped autonomy levels: observe vs execute, with human approval gates where required.</li>
          <li>Auditability-first: actions, decisions, and evidence trails are traceable.</li>
        </ul>
      </div>
    </main>
  );
}
