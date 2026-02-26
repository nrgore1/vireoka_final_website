export default function PortalDemoPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">UI Demo</h1>
        <p className="text-gray-700">
          Place links to your live demo, sandbox environment, or embedded walkthrough.
          This page is meant to show digital employees and governance controls in a realistic workflow.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Demo checklist</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Create / configure an agent (digital employee)</li>
          <li>Define authority envelope (scope, caps, escalation)</li>
          <li>Run a task; show policy enforcement blocking unsafe actions</li>
          <li>Show immutable audit log and export</li>
        </ul>
      </section>
    </main>
  );
}
