export const metadata = {
  title: "Vireoka Intelligence — Stakeholder Roles",
  description:
    "External stakeholder roles (Advisor, Angel, Contributor, Partner) inside Vireoka Intelligence.",
};

function RoleCard({
  title,
  who,
  focus,
  href,
}: {
  title: string;
  who: string;
  focus: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="text-xs font-semibold tracking-wide text-neutral-500">{who}</div>
      <h2 className="mt-2 text-lg font-semibold text-neutral-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{focus}</p>
      <div className="mt-4 text-sm font-semibold text-neutral-900">Details →</div>
    </a>
  );
}

export default function RolesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Explore stakeholder roles
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          These are <span className="font-semibold text-neutral-900">external roles</span> for people who want to engage with Vireoka and
          help it reach the market with confidence. Choose the lane that matches how you want to contribute or evaluate.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <RoleCard
          who="NDA + verification"
          title="Advisors"
          focus="Shape positioning, governance guardrails, product strategy, and go-to-market. Help make Kairo enterprise-trustworthy."
          href="/intelligence/advisors"
        />
        <RoleCard
          who="NDA + verification"
          title="Angel investors"
          focus="Support the mission and validate strategy with staged access: demos, metrics snapshots, and structured diligence paths."
          href="/intelligence/angels"
        />
        <RoleCard
          who="Verified collaborator"
          title="Contributors"
          focus="Join working groups, bounties, and architecture reviews. Help build the digital worker ecosystem through practical output."
          href="/intelligence/crowd"
        />
        <RoleCard
          who="By invitation"
          title="Strategic partners"
          focus="Co-design pilots, integrations, or joint validation aligned to reliability, measurable ROI, and policy-bound operations."
          href="/intelligence/partners"
        />
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Not sure where you fit?</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          Request access, pick the closest role, and tell us what you want to evaluate or contribute. We’ll route you to the right lane.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            className="rounded-xl !bg-vireoka-indigo px-4 py-2 text-sm font-semibold !text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-vireoka-indigo/40"
            href="/intelligence/request-access"
          >
            Request access →
          </a>
          <a
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            href="/intelligence/access"
          >
            Access model
          </a>
        </div>
      </section>
    </main>
  );
}
