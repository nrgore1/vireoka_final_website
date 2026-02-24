export const metadata = {
  title: "Vireoka Intelligence — Crowdsourcing",
  description: "Contributor lane for structured evaluation and domain input.",
};

export default function CrowdPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/roles">
          ← Back to roles
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Crowdsourcing contributors
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          This lane is for domain experts and practitioners who want to help test, critique, and improve
          governed AI workflows. Contributions are structured to produce useful signal—not noise.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">What you can contribute</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Real-world edge cases and failure modes</li>
          <li>Evaluation criteria and governance expectations by domain</li>
          <li>Test scenarios and acceptance rubrics</li>
          <li>UX feedback: what would make this usable day-to-day?</li>
        </ul>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">How it works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>Apply and choose your domains (e.g., compliance, finance, healthcare, ops).</li>
            <li>Receive structured tasks (review templates, scenario prompts, rubrics).</li>
            <li>Submit feedback; earn reputation and deeper collaboration access.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">What we don’t do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>No public sharing of confidential materials.</li>
            <li>No vague “tell us what you think” requests—everything is scoped.</li>
            <li>No requirement to expose your own proprietary data.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          href="/intelligence/apply"
        >
          Join as a Contributor →
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
