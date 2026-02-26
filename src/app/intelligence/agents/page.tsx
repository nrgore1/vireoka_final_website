import Link from "next/link";
import { CTABar } from "@/components/CTABar";

export default function PublicAgentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-vireoka-indigo">Digital Employees</h1>
        <p className="text-gray-700">
          Vireoka deploys domain-specialized agents as digital employees—governed by a shared runtime: authority envelopes,
          policy enforcement, execution authorization, and immutable audit logging.
        </p>

        <CTABar
          primaryHref="/intelligence/request-access"
          primaryLabel="Request Portal Access"
          secondaryHref="/intelligence"
          secondaryLabel="Back to Intelligence"
        />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Examples</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Agent Kairo</strong> — infrastructure orchestration (governed operations)</li>
          <li><strong>Agent Cody</strong> — code quality & architecture governance</li>
          <li><strong>Agent Angelo</strong> — design systems governance</li>
          <li><strong>Agent Vire</strong> — website delivery under governed execution</li>
          <li><strong>Agent Viral</strong> — governed marketing orchestration</li>
          <li><strong>Agent Stable</strong> — StableStack proving module (policy-constrained capital delegation)</li>
        </ul>
        <p className="text-gray-700">
          Deeper agent profiles and governance guarantees live inside the portal.
        </p>
        <div className="pt-2">
          <Link href="/intelligence/portal/agents" className="text-sm font-semibold text-vireoka-indigo hover:underline">
            View full catalog (portal) →
          </Link>
        </div>
      </section>
    </main>
  );
}
