export default function PortalVideosPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
        <p className="text-gray-700">
          Add your thesis video, product walkthrough, governance runtime demo, and StableStack proving module walkthrough here.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Suggested playlist</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Category thesis: Governed Intelligence and digital employees</li>
          <li>Governance runtime: authority envelopes, policy enforcement, audit</li>
          <li>Digital employee catalog tour (Kairo, Cody, Angelo, Vire, Viral, Stable)</li>
          <li>StableStack: policy-constrained rebalancing + audit trace</li>
        </ul>
      </section>
    </main>
  );
}
