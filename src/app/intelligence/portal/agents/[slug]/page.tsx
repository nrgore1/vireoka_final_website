import Link from "next/link";
import { notFound } from "next/navigation";

type AgentDetail = {
  slug: string;
  name: string;
  role: string;
  whatItDoes: string[];
  governance: string[];
  exampleTasks: string[];
  escalation: string[];
};

const AGENTS: AgentDetail[] = [
  {
    slug: "kairo",
    name: "Agent Kairo",
    role: "Infrastructure Management",
    whatItDoes: [
      "Monitors health signals and correlates incidents across services.",
      "Proposes remediations under change-control constraints.",
      "Automates runbook execution when policy allows.",
    ],
    governance: [
      "Authority envelope restricts high-risk actions (e.g., prod changes) unless escalation is satisfied.",
      "Policy engine validates scope (service, environment, allowed actions).",
      "Audit ledger records proposals, approvals, and executed steps.",
    ],
    exampleTasks: [
      "Detect anomaly → open incident → propose mitigation → request approval → execute → record audit.",
      "Enforce patch window policy and rollback rules for deployments.",
    ],
    escalation: [
      "Escalate to human on: production changes, security anomalies, high-blast-radius actions.",
      "Block and log actions that violate policy or exceed scope.",
    ],
  },
  {
    slug: "cody",
    name: "Agent Cody",
    role: "Code Quality & Architecture Governance",
    whatItDoes: [
      "Performs PR reviews aligned to internal standards.",
      "Flags risky changes and requests explicit approval for exceptions.",
      "Generates refactor plans under scope constraints.",
    ],
    governance: [
      "Policy constraints enforce review requirements by area (security, payments, auth).",
      "Authority envelope controls what Cody can change automatically vs propose.",
      "Immutable audit: diffs, approvals, and exception reasoning captured.",
    ],
    exampleTasks: [
      "Run code quality gates → propose fixes → require approval for architectural exceptions.",
      "Detect sensitive areas → enforce extra checks and escalation.",
    ],
    escalation: [
      "Escalate to senior reviewer on: auth flows, financial logic, security rules.",
      "Block auto-merge when governance conditions fail.",
    ],
  },
  {
    slug: "angelo",
    name: "Agent Angelo",
    role: "Design Management",
    whatItDoes: [
      "Maintains design tokens and system consistency.",
      "Generates governed design variants aligned to brand rules.",
      "Flags inconsistencies and proposes corrections.",
    ],
    governance: [
      "Brand policy constraints enforce typography, color usage, and tone.",
      "Authority envelope restricts destructive changes without approval.",
      "Audit logs record what changed, who approved, and why.",
    ],
    exampleTasks: [
      "Detect token drift → propose patch → require approval for global changes.",
      "Generate UI variants with strict brand constraints.",
    ],
    escalation: [
      "Escalate on: global token changes, brand exceptions, major layout shifts.",
      "Block changes that violate brand policy rules.",
    ],
  },
  {
    slug: "vire",
    name: "Agent Vire",
    role: "Website Development & Delivery",
    whatItDoes: [
      "Builds website updates, landing pages, and content structures.",
      "Manages deployments through governed gates.",
      "Maintains consistent IA patterns and performance constraints.",
    ],
    governance: [
      "Scope validation prevents editing protected routes without approval.",
      "Policy enforcement ensures content/branding consistency.",
      "Audit captures build actions, deployment steps, and diffs.",
    ],
    exampleTasks: [
      "Create role-based intelligence pages → validate governance → deploy with audit trail.",
      "Implement nav changes under controlled approvals.",
    ],
    escalation: [
      "Escalate on: auth/cookie/session changes, production config changes.",
      "Block deploy if policy checks fail (security/perf/brand).",
    ],
  },
  {
    slug: "viral",
    name: "Agent Viral",
    role: "Marketing Systems & Growth Orchestration",
    whatItDoes: [
      "Creates campaign plans and content variants within brand constraints.",
      "Optimizes distribution schedules and messaging under policy.",
      "Tracks performance signals and proposes adjustments.",
    ],
    governance: [
      "Policy constraints ensure consistency, claims discipline, and compliance.",
      "Authority envelope restricts publishing and paid spend without approvals.",
      "Audit logs content generation, approvals, and publication actions.",
    ],
    exampleTasks: [
      "Generate AEO-friendly content blocks → submit for review → publish with audit.",
      "Create campaign variants and track performance without policy drift.",
    ],
    escalation: [
      "Escalate on: claims, financial language, regulated topics, paid spend changes.",
      "Block publishing when approvals missing.",
    ],
  },
  {
    slug: "stable",
    name: "Agent Stable",
    role: "StableStack Proving Module",
    whatItDoes: [
      "Generates yield routing proposals within user-defined authority envelopes.",
      "Runs policy validation before execution.",
      "Records immutable audit traces for each rebalance decision.",
    ],
    governance: [
      "Authority envelopes constrain protocol exposure, liquidity window, and risk caps.",
      "Policy engine blocks rebalances that violate constraints.",
      "Audit ledger records proposals, approvals, and on-chain execution proofs.",
    ],
    exampleTasks: [
      "Propose rebalance → validate constraints → authorize → execute → audit.",
      "Explain why a proposed action was blocked (policy violation trace).",
    ],
    escalation: [
      "Escalate on: new strategy introduction, policy exceptions, threshold breaches.",
      "Block execution when constraints fail—no bypass path.",
    ],
  },
];

export default function AgentDetailPage({ params }: { params: { slug: string } }) {
  const a = AGENTS.find((x) => x.slug === params.slug);
  if (!a) return notFound();

  return (
    <main className="space-y-6">
      <Link href="/intelligence/portal/agents" className="text-sm font-semibold text-vireoka-indigo hover:underline">
        ← Back to Digital Employees
      </Link>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">{a.name}</h1>
        <p className="text-gray-700">{a.role}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">What it does</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            {a.whatItDoes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Governance guarantees</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            {a.governance.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Example tasks</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            {a.exampleTasks.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Escalation & blocking</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            {a.escalation.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
