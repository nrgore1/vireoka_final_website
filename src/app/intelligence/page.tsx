import Link from "next/link";

export const metadata = {
  title: "Vireoka Intelligence",
  description:
    "The Operating System for Autonomous Digital Workers — starting with Kairo, the Digital Infrastructure Worker.",
};

export default function IntelligencePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
          Vireoka Intelligence
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-7 text-neutral-700">
          Vireoka is building the <span className="font-semibold text-neutral-900">Operating System for Autonomous Digital Workers</span>.
          These workers don’t just “assist” — they take responsibility for defined operational outcomes, while remaining policy-bound,
          auditable, and controllable by humans.
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-neutral-500">The first production role</div>
          <h2 className="mt-2 text-lg font-semibold text-neutral-900">Kairo — Digital Infrastructure Worker</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Kairo operates AI infrastructure in real environments: it monitors GPU workloads, flags waste and reliability risks,
            and (in progressive rollout) executes safe, policy-bound optimizations with full decision traceability.
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            Governance is not a separate product — it’s the mandatory trait of digital workers:{" "}
            <span className="font-semibold text-neutral-900">
              if humans must follow policies, digital workers must too.
            </span>
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">For external collaborators</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            The roles below are for people outside the company who want to help Vireoka reach market with confidence.
            You might fit one role today and a different one later — pick the closest lane and we’ll route you.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              className="rounded-xl !bg-vireoka-indigo px-4 py-2 text-sm font-semibold !text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-vireoka-indigo/40"
              href="/intelligence/request-access"
            >
              Request access →
            </Link>
            <Link
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              href="/intelligence/roles"
            >
              Explore stakeholder roles
            </Link>
          </div>
        </div>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-neutral-500">NDA + verification</div>
          <h3 className="mt-2 text-lg font-semibold text-neutral-900">Advisors</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Help sharpen positioning, guardrails, and go-to-market. Your input directly improves how Kairo earns trust in production
            and how Vireoka expands into additional worker roles.
          </p>
          <div className="mt-4 text-sm font-semibold text-neutral-900">
            <Link className="underline" href="/intelligence/portal/advisor">
              If approved: Advisor workspace →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-neutral-500">NDA + verification</div>
          <h3 className="mt-2 text-lg font-semibold text-neutral-900">Angels & early believers</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Follow progress with structured diligence: product demos, metrics snapshots, and staged materials that expand as trust builds.
          </p>
          <div className="mt-4 text-sm font-semibold text-neutral-900">
            <Link className="underline" href="/intelligence/portal/angel">
              If approved: Angel workspace →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-neutral-500">Verified collaborator</div>
          <h3 className="mt-2 text-lg font-semibold text-neutral-900">Contributors</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Help build the ecosystem: architecture reviews, test cases, security UX feedback, and developer bounties. Earn reputation and
            deeper access through high-quality contributions.
          </p>
          <div className="mt-4 text-sm font-semibold text-neutral-900">
            <Link className="underline" href="/intelligence/portal/contributors">
              If approved: Contributor hub →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-neutral-500">By invitation</div>
          <h3 className="mt-2 text-lg font-semibold text-neutral-900">Partners</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Integrations, pilot deployments, and joint validation. Ideal for teams that want to ship measurable infrastructure outcomes
            while keeping policy controls intact.
          </p>
          <div className="mt-4 text-sm font-semibold text-neutral-900">
            <Link className="underline" href="/intelligence/portal/partner">
              If approved: Partner workspace →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Why act now</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
          <li>
            <span className="font-semibold text-neutral-900">AI infrastructure spend is exploding</span> — GPU waste and operational
            firefighting are becoming default.
          </li>
          <li>
            <span className="font-semibold text-neutral-900">Digital workers will become a new labor layer</span> — early proof defines the
            category leaders.
          </li>
          <li>
            <span className="font-semibold text-neutral-900">The best collaborators get compounding leverage</span> — early access is not
            just information; it’s influence on how the system is built.
          </li>
        </ul>
      </section>
    </main>
  );
}
