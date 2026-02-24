export const metadata = {
  title: "Vireoka Intelligence — Platform",
  description: "A high-level overview of Vireoka’s governed intelligence platform approach.",
};

export default function PlatformPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Platform: Governed intelligence, modular by design
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Vireoka is built to help teams move from experimentation to durable deployment.
          The platform is modular so organizations can adopt capabilities in stages—starting
          with a narrow workflow and expanding as confidence grows.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Governance, not bureaucracy</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Governance is embedded into how work happens: constraints, approvals, escalation paths,
            and auditability—designed to be usable by operators, not just compliance teams.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Practical autonomy</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Automation is most valuable when it can operate independently—within boundaries.
            We emphasize safe defaults, clear permissions, and predictable behavior.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Structured evidence</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Decisions and actions should be explainable. The platform captures structured artifacts
            that support review, incident response, and continuous improvement.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Staged disclosure</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            We share information by role and verification status—starting with public concept briefs,
            then deeper materials under NDA in the protected portal.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">How to evaluate Vireoka</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          If you’re assessing fit, we recommend starting with a single workflow that has:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Clear success metrics (time saved, error reduction, better compliance outcomes)</li>
          <li>Known risks (data sensitivity, decision impact, regulatory implications)</li>
          <li>A defined approval path (who can authorize, review, or override)</li>
          <li>Observable outputs (logs, artifacts, and measurable behavior)</li>
        </ul>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          href="/intelligence/digital-employees"
        >
          Digital Employees →
        </a>
        <a
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          href="/intelligence/access"
        >
          Access & trust model
        </a>
      </section>
    </main>
  );
}
