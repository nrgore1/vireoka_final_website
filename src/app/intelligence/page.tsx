import Link from "next/link";

export default function IntelligenceLanding() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="flex flex-col gap-4">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
          Governed Intelligence Infrastructure • Autonomous Digital Workers
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
          The Operating System for Autonomous Digital Workers.
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-slate-600">
          Most AI tools assist humans. Vireoka goes one level deeper: it turns repeated operational
          responsibilities into <span className="font-medium text-slate-800">digital workers</span>{" "}
          that act inside policy boundaries, with full decision traceability.
        </p>

        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/intelligence/kairo"
            className="rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
          >
            Meet Kairo (our first worker)
          </Link>

          <Link
            href="/intelligence/request-access"
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Request portal access
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Focus: Kairo, the Digital Infrastructure Worker</h2>
          <p className="mt-2 text-sm text-slate-600">
            Kairo is designed to reduce AI infrastructure waste and operational firefighting. It observes GPU
            workloads, proposes actions, and (when enabled) executes policy-bound optimization with an audit trail.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Detects GPU idle waste and over-provisioning</li>
            <li>• Separates training vs inference lanes to protect SLOs</li>
            <li>• Produces a decision log for every recommendation and action</li>
            <li>• Designed for cross-cloud + cross-hardware environments</li>
          </ul>

          <div className="mt-5">
            <Link href="/intelligence/kairo" className="text-sm font-medium text-vireoka-indigo underline">
              Read the Kairo efficiency case →
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Why act now</h2>
          <p className="mt-2 text-sm text-slate-600">
            AI infrastructure spend is exploding while teams stay lean. The gap between workload complexity and
            human capacity is becoming the bottleneck. Digital workers turn that gap into compounding advantage.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-700">Capital efficiency</div>
              <div className="mt-1 text-sm text-slate-600">Reduce waste before it becomes your burn rate.</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-700">Reliability</div>
              <div className="mt-1 text-sm text-slate-600">Less firefighting, clearer incident trails.</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-700">Governance by default</div>
              <div className="mt-1 text-sm text-slate-600">Policies apply to digital workers like humans.</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-700">Expandable platform</div>
              <div className="mt-1 text-sm text-slate-600">Add new worker roles over time.</div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Explore by external role</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          These are external stakeholder roles we’re engaging (advisors, angels, VCs, partners, and contributors).
          You may identify with one or more. Each path shows how you can help Vireoka reach the market with
          confidence — and what you’ll get access to inside the Intelligence Portal.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <RoleCard
            title="Advisors"
            desc="Help sharpen positioning, pilots, and enterprise readiness. Get early access + briefings."
            href="/intelligence/advisors"
          />
          <RoleCard
            title="Angel Investors"
            desc="Evaluate the wedge and early traction. Get the seed narrative, demo, and roadmap."
            href="/intelligence/angels"
          />
          <RoleCard
            title="VC Funds & Partners"
            desc="Deep diligence on category creation and platform economics. Get data room access after NDA."
            href="/intelligence/partners"
          />
          <RoleCard
            title="Crowd & Community"
            desc="Follow product milestones, public artifacts, and launches. Help amplify."
            href="/intelligence/crowd"
          />
          <RoleCard
            title="Contributors"
            desc="Build with us: bounties, blueprints, and working groups. Access is gated."
            href="/intelligence/contributors"
          />
        </div>
      </section>
    </main>
  );
}

function RoleCard(props: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={props.href}
      className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{props.title}</h3>
        <span className="text-sm text-slate-400 group-hover:text-slate-600">→</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{props.desc}</p>
    </Link>
  );
}
