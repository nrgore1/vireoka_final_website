import Link from "next/link";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { GovernanceFlowDiagram } from "@/components/GovernanceFlowDiagram";

export default function PortalHome() {
  return (
    <main className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Inside the Portal</h2>
        <p className="mt-2 text-gray-700">
          This portal contains deeper material for stakeholders evaluating Vireoka’s governed agentic framework:
          architecture primitives, digital employee governance, and demonstration modules like StableStack.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/intelligence/portal/vdr" className="rounded-xl bg-vireoka-indigo px-5 py-3 text-sm font-semibold text-white hover:opacity-95">
            View Data Room
          </Link>
          <Link href="/intelligence/stablestack" className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            StableStack (Proving Module)
          </Link>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <ArchitectureDiagram />
        <GovernanceFlowDiagram />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Next</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
          <li>Digital employee governance model + authority envelope examples</li>
          <li>Audit exports for regulated workflows</li>
          <li>StableStack policy-constrained rebalancing demonstration</li>
        </ul>
      </section>
    </main>
  );
}
