export default function PortalInfographicsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Infographics</h1>
        <p className="text-gray-700">
          Use this area for crowd-sourced infographics: governance flow, delegation risk surface, agent readiness model,
          and digital employee lifecycle.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Suggested artifacts</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>“Scope → Policy → Authorization → Execution → Audit” flow poster</li>
          <li>Authority envelope examples across agents</li>
          <li>Governed Intelligence Index overview</li>
          <li>StableStack proving module: constraint enforcement map</li>
        </ul>
      </section>
    </main>
  );
}
