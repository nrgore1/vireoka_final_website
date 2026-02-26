import Link from "next/link";
import { CTABar } from "@/components/CTABar";
import { GovernanceFlowDiagram } from "@/components/GovernanceFlowDiagram";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-14">
      <section className="space-y-6">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700">
          Governed Intelligence Infrastructure • Digital Employees • Runtime Enforcement
        </div>

        <h1 className="text-5xl font-bold text-vireoka-indigo leading-tight">
          Vireoka builds governed digital employees for the delegation era.
        </h1>

        <p className="text-lg text-gray-700 max-w-3xl">
          Most AI vendors ship generic copilots and call it transformation.
          Vireoka breaks that cliché by deploying domain-specialized agents as digital employees—
          operating inside authority envelopes, policy constraints, and immutable audit trails.
        </p>

        <CTABar
          primaryHref="/intelligence"
          primaryLabel="Explore Vireoka Intelligence"
          secondaryHref="/intelligence/request-access"
          secondaryLabel="Request Portal Access"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">What we deploy</h2>
          <p className="text-gray-700">
            Digital employees that coordinate workflows across infrastructure, design, development, finance,
            and marketing—without adding uncontrolled autonomy.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Agent Kairo (infra)</li>
            <li>Agent Angelo (design)</li>
            <li>Agent Cody (code governance)</li>
            <li>Agent Vire (web delivery)</li>
            <li>Agent Viral (marketing orchestration)</li>
          </ul>
          <div className="pt-2">
            <Link href="/intelligence" className="text-sm font-semibold text-vireoka-indigo hover:underline">
              See role-specific intelligence →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">What makes it durable</h2>
          <p className="text-gray-700">
            Governance is runtime architecture. Every action is validated before execution and recorded during execution.
          </p>
          <GovernanceFlowDiagram />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">StableStack proving module</h2>
        <p className="text-gray-700">
          StableStack demonstrates policy-constrained, AI-assisted capital delegation—one of the highest-stakes environments
          to validate governance primitives that generalize across industries.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/intelligence/stablestack" className="rounded-xl bg-vireoka-indigo px-5 py-3 text-sm font-semibold text-white hover:opacity-95">
            Explore StableStack
          </Link>
          <Link href="/intelligence/portal" className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            Portal (if approved)
          </Link>
        </div>
      </section>
    </main>
  );
}
