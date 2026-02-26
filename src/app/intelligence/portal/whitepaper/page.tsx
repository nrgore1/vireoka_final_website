export default function PortalWhitepaperPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Whitepaper</h1>
        <p className="text-gray-700">
          Publish the “Governed Intelligence: Architecture for the Delegation Era” whitepaper here. Keep the portal version richer:
          diagrams, runtime spec excerpts, and governance index methodology.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Portal edition sections</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Why overlay governance fails for delegated systems</li>
          <li>Authority envelopes as an architectural primitive</li>
          <li>Policy enforcement + authorization at runtime</li>
          <li>Audit-native execution and revocation</li>
          <li>StableStack proving module: constrained capital delegation</li>
        </ul>
      </section>
    </main>
  );
}
