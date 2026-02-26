import Link from "next/link";
import { CTABar } from "@/components/CTABar";

export default function ContributorsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
      <h1 className="text-3xl font-bold text-vireoka-indigo">For Contributors</h1>

      <p className="text-gray-700">
        Vireoka is building governed intelligence infrastructure and digital employees. If you want to help
        shape the technical, research, and product layer—this is your entry point.
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Where you can contribute</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Governance primitives: authority envelopes, policy rules, escalation paths</li>
          <li>Audit-native execution: event schemas, exports, trace views</li>
          <li>Agent templates: infra, code quality, design, marketing, StableStack proving module</li>
          <li>Infographics + explainers: governance flow, agent readiness, digital employee lifecycle</li>
        </ul>
      </section>

      <CTABar
        primaryHref="/intelligence/request-access"
        primaryLabel="Request Portal Access"
        secondaryHref="/intelligence"
        secondaryLabel="Back to Intelligence"
      />

      <p className="text-sm text-gray-600">
        Prefer to start inside the portal? Visit{" "}
        <Link href="/intelligence/portal" className="font-semibold text-vireoka-indigo hover:underline">
          /intelligence/portal
        </Link>{" "}
        (approval required).
      </p>
    </main>
  );
}
