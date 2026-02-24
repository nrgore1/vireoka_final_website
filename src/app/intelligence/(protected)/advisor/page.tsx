export const metadata = { title: "Private — Advisor lane" };

export default function AdvisorLane() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/(protected)">
        ← Back to private workspace
      </a>
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Advisor lane</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-700">
        This area is reserved for verified advisors. If you can see this page but are missing
        materials, your role may be active but not fully provisioned yet.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-base font-semibold text-neutral-900">What lives here</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Structured review packets and feedback templates</li>
          <li>Non-sensitive summaries plus staged private briefs (as appropriate)</li>
          <li>Meeting notes and action items</li>
        </ul>
      </div>
    </main>
  );
}
