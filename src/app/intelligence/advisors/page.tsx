import { CTABar } from "@/components/CTABar";

export default function AdvisorsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
      <h1 className="text-3xl font-bold text-vireoka-indigo">For Advisors</h1>

      <p className="text-gray-700">
        Vireoka is defining governance primitives for agentic digital employees: authority envelopes, runtime enforcement,
        escalation logic, and audit-native execution. We invite advisors who can help shape durable architecture and category standards.
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Where your guidance matters</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Enterprise deployment patterns for governed agents</li>
          <li>Governance standardization and “agent readiness” frameworks</li>
          <li>Responsible autonomy models and escalation thresholds</li>
          <li>Regulated workflow considerations (audit, revocation, policy lifecycle)</li>
        </ul>
      </section>

      <CTABar primaryHref="/intelligence/request-access" primaryLabel="Request Access" secondaryHref="/intelligence" secondaryLabel="Back" />
    </main>
  );
}
