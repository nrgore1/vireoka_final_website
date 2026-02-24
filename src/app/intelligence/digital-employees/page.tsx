export const metadata = {
  title: "Vireoka Intelligence — Digital Employees",
  description: "A safe, governed approach to task automation and assistant workflows.",
};

export default function DigitalEmployeesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Digital Employees: trusted automation for real teams
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          “Digital Employees” are controlled automation workflows that help teams execute repetitive
          or complex tasks—while keeping accountability, permissions, and oversight intact.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">What they are (high level)</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li><b>Task-oriented</b>: scoped to specific outcomes (draft, summarize, validate, route, reconcile).</li>
          <li><b>Permissioned</b>: limited by role, policy, and environment.</li>
          <li><b>Auditable</b>: produce artifacts that can be reviewed and traced.</li>
          <li><b>Escalation-aware</b>: when uncertainty is high, they route to humans rather than guessing.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Where they help most</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Operations: handoffs, triage, status updates, structured reporting</li>
          <li>Compliance: evidence collection, checklist workflows, controlled drafting</li>
          <li>Customer workflows: intake, classification, response preparation under review</li>
          <li>Internal knowledge: retrieval, brief creation, decision memos</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Why “governed” matters</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          Automation without guardrails creates risk. Our focus is the operating model:
          who can do what, under which constraints, with what evidence, and how exceptions are handled.
        </p>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          href="/intelligence/roles"
        >
          Get involved →
        </a>
        <a
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          href="/intelligence/faq"
        >
          FAQ
        </a>
      </section>
    </main>
  );
}
