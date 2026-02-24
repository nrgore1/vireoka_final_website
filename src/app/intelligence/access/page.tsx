export const metadata = {
  title: "Vireoka Intelligence — Access & Trust",
  description: "Role-based access and staged disclosure for Vireoka Intelligence.",
};

function Tier({
  name,
  who,
  includes,
  note,
}: {
  name: string;
  who: string;
  includes: string[];
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold tracking-wide text-neutral-500">{who}</div>
      <h2 className="mt-2 text-lg font-semibold text-neutral-900">{name}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
        {includes.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {note ? <p className="mt-3 text-sm leading-6 text-neutral-700">{note}</p> : null}
    </div>
  );
}

export default function AccessPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Access & trust model
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          We use staged disclosure and role-based access so collaborators can engage effectively
          without exposing confidential details broadly. This protects everyone and keeps the process clean.
        </p>
      </header>

      <section className="mt-10 grid gap-4">
        <Tier
          who="Public"
          name="Open Materials"
          includes={[
            "Vision and platform overview",
            "Role descriptions and how to engage",
            "Non-confidential updates and FAQs",
          ]}
        />
        <Tier
          who="Verified collaborator"
          name="Contributor Access"
          includes={[
            "Structured prompts and collaboration tasks",
            "Feedback templates and evaluation rubrics",
            "Non-sensitive demos or guided walkthroughs (as available)",
          ]}
          note="Best for domain experts, researchers, operators, and community contributors."
        />
        <Tier
          who="NDA + verification"
          name="Advisor / Angel Access"
          includes={[
            "Confidential briefs (market, product strategy, roadmap at a high level)",
            "Controlled access to investor/advisor materials",
            "Private Q&A sessions and collaboration threads",
          ]}
          note="This tier is gated to protect IP and ensure responsible distribution."
        />
        <Tier
          who="By invitation"
          name="Strategic / Partner Access"
          includes={[
            "Deeper technical/commercial discussions under strict controls",
            "Joint validation planning and pilot scoping",
            "Security and compliance coordination (as needed)",
          ]}
        />
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">How to request access</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Tell us your role and background.</li>
          <li>Tell us what you want to evaluate or contribute.</li>
          <li>We’ll respond with the appropriate lane and next steps (and NDA if needed).</li>
        </ol>
        <div className="mt-6">
          <a
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            href="/intelligence/apply"
          >
            Apply / Contact →
          </a>
        </div>
      </section>
    </main>
  );
}
