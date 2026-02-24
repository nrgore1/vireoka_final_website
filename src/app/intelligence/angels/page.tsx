export const metadata = {
  title: "Vireoka Intelligence — Angel Investors",
  description: "Angel investor lane inside Vireoka Intelligence.",
};

export default function AngelsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/roles">
          ← Back to roles
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Angel investors
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          This lane is for mission-aligned angels who want a disciplined diligence path and a clear understanding
          of how Vireoka creates durable trust in AI deployments—without relying on hype.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">What you can expect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Staged materials: public overview → private briefs under NDA (as appropriate)</li>
          <li>Structured Q&A: product direction, validation approach, and near-term milestones</li>
          <li>Clear “what we’re not doing”: no vague AI claims, no black-box dependency promises</li>
        </ul>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Who this is for</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>Angels with enterprise / regulated-market experience</li>
            <li>Investors who value governance, safety, and adoption realism</li>
            <li>People who can provide signal (intros, validation, credibility)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">How we run diligence</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            <li>Short alignment call</li>
            <li>NDA + verification (if moving forward)</li>
            <li>Guided walkthrough of materials + Q&A</li>
            <li>Optional: pilot-fit discussion with your operator network</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          href="/intelligence/apply"
        >
          Apply as an Angel →
        </a>
        <a
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          href="/intelligence/faq"
        >
          Read FAQ
        </a>
      </section>
    </main>
  );
}
