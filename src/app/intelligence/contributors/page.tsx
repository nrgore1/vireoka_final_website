import Link from "next/link";

export default function ContributorsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
        Vireoka Intelligence • Contributors
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
        Build governed digital workers with us.
      </h1>

      <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600">
        Contributors help harden Kairo into a production-grade digital infrastructure worker: telemetry ingestion,
        reclaimability scoring, safe execution guardrails, audit logs, dashboards, and integrations.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">What you can work on</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• K8s + GPU metrics ingestion (Prometheus/Datadog)</li>
            <li>• Reclaimability scoring logic for mixed training + inference clusters</li>
            <li>• Safe execution controllers (shadow → approval → autonomous)</li>
            <li>• Audit log UX + exportable reports for pilots</li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Access</h2>
          <p className="mt-2 text-sm text-slate-600">
            Contributor materials live inside the Intelligence Portal and may require approval and NDA depending
            on the working group. Request access to get started.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/intelligence/request-access"
              className="rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
            >
              Request portal access
            </Link>
            <Link
              href="/intelligence/kairo"
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Read Kairo first
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <Link href="/intelligence" className="text-sm font-medium text-slate-600 underline">
          Back to Intelligence
        </Link>
      </div>
    </main>
  );
}
