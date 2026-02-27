import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
        Vireoka Intelligence • VC Funds & Partners
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Diligence Vireoka as AI labor infrastructure: an OS for autonomous digital workers.</h1>

      <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600">
        For funds, studios, and strategic partners: we can share deeper materials after NDA, including architecture notes, pilot metrics, and a working data room.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">What you'll see</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Category thesis: digital workers as delegated operational responsibility</li>
            <li>• Kairo wedge: production-safe cost + reliability optimization</li>
            <li>• Roadmap to multi-role platform economics (platform + worker modules)</li>
            <li>• Governance as enterprise-grade autonomy (policy + audit trail)</li>
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
