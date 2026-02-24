export const metadata = {
  title: "Vireoka Intelligence — Vision",
  description: "Vireoka’s vision for ethical AI, governance, and trusted digital work.",
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

export default function VisionPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Vision: Ethical AI that’s usable in the real world
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Vireoka’s thesis is simple: organizations won’t adopt AI at scale unless they can
          trust it—technically, operationally, and ethically. Trust requires governance that
          is not an afterthought, and automation that is not a black box.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">The problem we’re solving</h2>
        <Bullets
          items={[
            "AI systems can be useful but still unsafe, unaccountable, or non-compliant.",
            "Teams need speed, but leadership needs traceability and risk control.",
            "Automation often breaks when context changes—creating hidden operational debt.",
            "Most solutions treat governance as paperwork instead of a living system.",
          ]}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Our approach</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          We focus on “governed intelligence”: a practical layer that helps teams make and
          execute decisions with constraints, evidence, and accountability—without exposing
          proprietary implementation details publicly.
        </p>
        <Bullets
          items={[
            "Decision-to-action workflows that support oversight, review, and escalation.",
            "Policy-aware automation that stays inside defined boundaries.",
            "Clear audit trails and structured reasoning artifacts for critical actions.",
            "Role-based disclosure: share what’s needed, when it’s needed—nothing more.",
          ]}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">What success looks like</h2>
        <Bullets
          items={[
            "Organizations can deploy AI with confidence across regulated or high-stakes contexts.",
            "Users get reliable assistance that behaves predictably under constraints.",
            "Leaders can explain “why” something happened, not just “what” happened.",
            "Governance becomes a product capability—measurable, testable, improvable.",
          ]}
        />
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          href="/intelligence/roles"
        >
          Choose a role
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
