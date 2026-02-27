import Link from "next/link";

export default function CrowdPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
        Vireoka Intelligence • Crowd & Community
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
        Follow the build: Kairo, our first digital infrastructure worker.
      </h1>

      <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600">
        This path is for people who want to track progress, share feedback, and amplify launches. You don’t need
        a formal title — if you can help us test messaging, validate the wedge, and spread credible updates, you
        belong here.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">What we're building</h2>
          <p className="mt-2 text-sm text-slate-600">
            Vireoka is the operating system for autonomous digital workers — software entities with delegated
            responsibilities, policy boundaries, and audit trails. Our first production role is{" "}
            <span className="font-medium text-slate-800">Kairo</span>, focused on eliminating GPU waste safely.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/intelligence/kairo" className="text-sm font-medium text-vireoka-indigo underline">
              Read the Kairo efficiency case →
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">How you can help</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Share the Kairo thesis with operators and founders who feel GPU burn pain.</li>
            <li>• Give feedback on landing-page clarity and “why now” urgency.</li>
            <li>• Introduce us to AI-native teams running mixed training + inference clusters.</li>
            <li>• Help us recruit contributors for observability, K8s integrations, and dashboards.</li>
          </ul>

          <div className="mt-5">
            <Link
              href="/intelligence/request-access"
              className="rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
            >
              Request portal access
            </Link>
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">A simple promise</h2>
        <p className="mt-2 text-sm text-slate-600">
          We will not ship hype. We will ship measurable savings and safe execution. If Kairo cannot prove impact
          without harming SLOs, we will keep it in shadow mode until it can.
        </p>
      </section>

      <div className="mt-8">
        <Link href="/intelligence" className="text-sm font-medium text-slate-600 underline">
          Back to Intelligence
        </Link>
      </div>
    </main>
  );
}
