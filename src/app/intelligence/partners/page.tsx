export const metadata = {
  title: "Vireoka Intelligence — Partners",
  description: "Partner lane for pilots, integration, and joint validation.",
};

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/roles">
          ← Back to roles
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Strategic partners
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          This lane is for organizations that want to co-design validation pilots, governance-aligned integrations,
          or joint offerings—especially in contexts where trust, traceability, and control are non-negotiable.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Partnership themes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Defined pilot scope with measurable outcomes</li>
          <li>Governance fit: permissions, auditability, escalation paths</li>
          <li>Security and privacy alignment (only what’s needed)</li>
          <li>Operational adoption: training, change management, workflow clarity</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">How we start</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Exploration call (use-case + constraints)</li>
          <li>Mutual NDA (if proceeding)</li>
          <li>Pilot definition (success metrics, owners, timeline)</li>
          <li>Run + review (evidence, gaps, next iteration)</li>
        </ol>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          href="/intelligence/apply"
        >
          Discuss a partnership →
        </a>
        <a
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          href="/intelligence/platform"
        >
          Platform overview
        </a>
      </section>
    </main>
  );
}
