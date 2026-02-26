import Link from "next/link";

type AgentCard = {
  slug: string;
  name: string;
  role: string;
  summary: string;
  governed: string[];
};

const AGENTS: AgentCard[] = [
  {
    slug: "kairo",
    name: "Agent Kairo",
    role: "Infrastructure Management",
    summary:
      "Orchestrates infrastructure workflows: observability, incident response, change control, and remediation.",
    governed: ["Change constraints", "Escalation rules", "Audit trail for actions"],
  },
  {
    slug: "cody",
    name: "Agent Cody",
    role: "Code Quality & Architecture Governance",
    summary:
      "Reviews code quality, enforces standards, flags risks, and proposes remediations under policy constraints.",
    governed: ["Policy-bound checks", "Approval gates", "Immutable review logs"],
  },
  {
    slug: "angelo",
    name: "Agent Angelo",
    role: "Design Management",
    summary:
      "Maintains design systems, consistency, and design governance across teams and product surfaces.",
    governed: ["Brand constraints", "Change approvals", "Design audit history"],
  },
  {
    slug: "vire",
    name: "Agent Vire",
    role: "Website Development & Delivery",
    summary:
      "Builds and ships web experiences with governed execution, approvals, and auditable deployments.",
    governed: ["Scope validation", "Protected deploy gates", "Deployment audit"],
  },
  {
    slug: "viral",
    name: "Agent Viral",
    role: "Marketing Systems & Growth Orchestration",
    summary:
      "Creates and optimizes campaigns within defined brand and compliance constraints.",
    governed: ["Brand policy", "Approval paths", "Traceable campaign actions"],
  },
  {
    slug: "stable",
    name: "Agent Stable",
    role: "StableStack Proving Module",
    summary:
      "Demonstrates policy-constrained, AI-assisted stablecoin yield routing as a governance stress-test environment.",
    governed: ["Authority envelopes", "Policy enforcement", "Audit-native execution"],
  },
];

function Card({ a }: { a: AgentCard }) {
  return (
    <Link
      href={`/intelligence/portal/agents/${a.slug}`}
      className="rounded-2xl border border-gray-200 bg-white p-6 hover:bg-gray-50 transition"
    >
      <div className="text-sm font-semibold text-gray-900">{a.name}</div>
      <div className="mt-1 text-sm text-gray-600">{a.role}</div>
      <p className="mt-3 text-sm text-gray-700">{a.summary}</p>
      <ul className="mt-4 list-disc pl-6 text-sm text-gray-700 space-y-1">
        {a.governed.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </Link>
  );
}

export default function PortalAgentsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Digital Employees</h1>
        <p className="text-gray-700">
          These agents operate as digital employees under Vireoka’s governance runtime: authority envelopes, policy enforcement,
          execution authorization, and immutable audit logging.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {AGENTS.map((a) => (
          <Card key={a.slug} a={a} />
        ))}
      </div>
    </main>
  );
}
