import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
        Vireoka Intelligence • Advisors
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Help Vireoka turn Kairo into a production-grade digital infrastructure worker.</h1>

      <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600">
        If you’ve built or led infrastructure, MLOps, SRE, FinOps, or platform engineering teams, your feedback helps us ship a credible autonomous operator layer without risking production.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">What you'll see</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Kairo positioning + wedge definition (GPU waste → infra autonomy)</li>
            <li>• Pilot design: shadow mode, guardrails, SLO-safe rollout</li>
            <li>• Enterprise readiness: audit trails, policy boundaries, approvals</li>
            <li>• Review messaging, pricing, and success metrics dashboards</li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Primary focus: Kairo</h2>
          <p className="mt-2 text-sm text-slate-600">
            Kairo is our first autonomous-ready digital worker: a production path focused on reducing GPU waste
            safely (shadow → guarded execution → closed-loop validation). Governance is embedded as policy + auditability.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/intelligence/kairo"
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Read Kairo overview
            </Link>
            <Link
              href="/intelligence/request-access"
              className="rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
            >
              Request portal access
            </Link>
          </div>

          <div className="mt-4">
            <Link href="/intelligence" className="text-sm font-medium text-slate-600 underline">
              Back to Intelligence
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
