import { CTABar } from "@/components/CTABar";

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
      <h1 className="text-3xl font-bold text-vireoka-indigo">For Partners</h1>

      <p className="text-gray-700">
        We partner with platforms and teams deploying agents at scale—where governance, auditability,
        and controlled delegation are non-negotiable.
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Partnership pathways</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Embed Vireoka governance runtime into agent systems</li>
          <li>Co-develop digital employee templates and policy modules</li>
          <li>Audit export + governance reporting integrations</li>
          <li>Certification and standards participation</li>
        </ul>
      </section>

      <CTABar primaryHref="/intelligence/request-access" primaryLabel="Request Access" secondaryHref="/intelligence" secondaryLabel="Back" />
    </main>
  );
}
