import Link from "next/link";

function CodeBlock(props: { code: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
      <code>{props.code}</code>
    </pre>
  );
}

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">{props.title}</h2>
      <div className="mt-3 text-sm text-slate-700">{props.children}</div>
    </section>
  );
}

export default function ContributorPortal() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
            Intelligence Portal • Contributors
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Contributor Hub: build Kairo and the governed worker runtime.
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600">
            Welcome to the central forge of the Vireoka ecosystem. To build a governed, autonomous digital workforce,
            we need deep infrastructure engineering, system logic, memory/data architecture, and security UX.
          </p>
        </div>

        <Link href="/intelligence/portal" className="mt-2 text-sm font-medium text-vireoka-indigo underline">
          Back to portal →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="⚙️ Agentic Orchestration & Core Engineering">
          <p className="text-slate-600">
            Systems engineers and backend architects building the pathways Kairo uses to observe and act.
          </p>
          <ul className="mt-3 space-y-2">
            <li>• Event-driven routing and safe execution controllers (shadow → approval → autonomous).</li>
            <li>• Multi-cloud connectors and K8s-native integrations.</li>
            <li>• Scale and reliability work to handle high event throughput.</li>
          </ul>
        </Section>

        <Section title="🧠 System Logic & Decisioning">
          <p className="text-slate-600">
            Translate operational constraints into reclaimability scoring and action policies for mixed training + inference clusters.
          </p>
          <ul className="mt-3 space-y-2">
            <li>• Reclaimability scoring features: utilization trend, memory residency, burst frequency, queue depth.</li>
            <li>• Guardrails: protected pools, change windows, rollback triggers, max-change limits.</li>
            <li>• Decision journal: reason, policy matched, expected savings, outcome verification.</li>
          </ul>
        </Section>

        <Section title="🕸️ Memory & Data Architecture">
          <p className="text-slate-600">
            Make the worker context-rich: ingest telemetry, normalize signals, and support fast lookups for decisioning and audits.
          </p>
          <ul className="mt-3 space-y-2">
            <li>• Schemas for metrics snapshots, actions, and outcomes.</li>
            <li>• Exportable reports for pilots (weekly ROI summaries).</li>
            <li>• Retrieval patterns for “why did we do this?” explainability.</li>
          </ul>
        </Section>

        <Section title="🛡️ Security UX & Frontend Operations">
          <p className="text-slate-600">
            Build trust: approval flows, autonomy sliders, immutable audit logs, and safe human overrides.
          </p>
          <ul className="mt-3 space-y-2">
            <li>• “Action Sandbox” UI for reviewing proposed actions.</li>
            <li>• Audit log UI with rationale and rollback links.</li>
            <li>• Safe input handling and guardrails for admin actions.</li>
          </ul>
        </Section>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Contributor onboarding guide (local sandbox)">
          <p className="text-slate-600">
            This is a reference workflow used by our internal team to keep contributor onboarding consistent.
          </p>

          <p className="mt-4 font-semibold">Step 1: Clone and install</p>
          <CodeBlock
            code={`git clone https://github.com/vireoka/vireoka-core.git
cd vireoka-core
npm install
npm run dev`}
          />

          <p className="mt-4 font-semibold">Step 2: Start local data services (example)</p>
          <CodeBlock code={`docker compose up -d`} />

          <p className="mt-4 font-semibold">Step 3: Fire a test event (example)</p>
          <CodeBlock
            code={`curl -X POST http://localhost:8000/api/v1/events/ingress \\
  -H "Content-Type: application/json" \\
  -d '{\"source\":\"telemetry\",\"event\":\"cpu_spike\",\"service_node\":\"checkout-api\"}'`}
          />
        </Section>

        <Section title="Maintainer playbook (PR review)">
          <p className="text-slate-600">
            Maintainers are the final governance layer. Don’t lint by hand — focus on architectural intent and systemic impact.
          </p>

          <ul className="mt-3 space-y-2">
            <li>
              <span className="font-semibold">1) Automated pre-flight:</span> security checks, dependency impact hints, formatting.
            </li>
            <li>
              <span className="font-semibold">2) Human architecture review:</span> does it preserve bounded autonomy and EDA patterns?
            </li>
            <li>
              <span className="font-semibold">3) Feedback loop:</span> explain deltas so the system learns preferred patterns.
            </li>
            <li>
              <span className="font-semibold">4) Merge with intent:</span> clean commit message and bounty crediting.
            </li>
          </ul>
        </Section>
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Suggested first bounties</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>• Add GPU memory residency to reclaimability scoring.</li>
          <li>• Build an audit log “diff” view: recommendation → action → outcome.</li>
          <li>• Create a training-lane execution guardrail: max 5% nodes per window.</li>
          <li>• Export weekly ROI summary as CSV + email.</li>
        </ul>
      </div>
    </main>
  );
}
