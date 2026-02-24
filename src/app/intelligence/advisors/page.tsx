export const metadata = {
  title: "Vireoka Intelligence — Advisors",
  description: "Advisor lane inside Vireoka Intelligence.",
};

export default function AdvisorsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/roles">
          ← Back to roles
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Advisors
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Advisors help Vireoka stay honest, practical, and aligned with real-world constraints.
          This lane is designed for people who want to influence direction without taking on day-to-day execution.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Who this is for</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>Governance, risk, compliance, and policy leaders</li>
            <li>Operators who’ve deployed AI in messy environments</li>
            <li>Security, privacy, and assurance practitioners</li>
            <li>Experienced founders / product leaders in enterprise or regulated markets</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">What you’ll do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>Challenge assumptions and sharpen positioning</li>
            <li>Review governance concepts and risk boundaries</li>
            <li>Help prioritize workflows with measurable impact</li>
            <li>Open doors to partners, pilots, or credibility signals (optional)</li>
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Engagement model</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Lightweight cadence (e.g., periodic reviews, structured feedback)</li>
          <li>Staged disclosure (NDA + verification for confidential materials)</li>
          <li>Clear boundaries: advisory influence without operational expectation</li>
        </ul>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          href="/intelligence/apply"
        >
          Apply as an Advisor →
        </a>
        <a
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          href="/intelligence/access"
        >
          Access model
        </a>
      </section>
    </main>
  );
}
