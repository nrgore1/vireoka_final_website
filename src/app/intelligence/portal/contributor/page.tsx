import Link from "next/link";

export const metadata = {
  title: "Vireoka Intelligence — Contributor Portal",
  description:
    "Contributor hub for the Vireoka ecosystem: working groups, bounties, architecture blueprints, and onboarding.",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-neutral-900">{children}</h2>;
}

function Card({
  title,
  focus,
  items,
}: {
  title: string;
  focus: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{focus}</p>
      <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-neutral-700 space-y-1">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ContributorPortalPage() {
  const curlExample = `curl -X POST http://localhost:8000/api/v1/events/ingress \\
  -H "Content-Type: application/json" \\
  -d '{"source":"telemetry","event":"cpu_spike","service_node":"checkout-api"}'`;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="max-w-3xl">
        <Link className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/portal">
          ← Back to Portal
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Contributor Portal: Hubs & Categories
        </h1>

        <p className="mt-4 text-base leading-7 text-neutral-700">
          Welcome to the central forge of the Vireoka ecosystem. To build a governed, autonomous digital workforce,
          we need diverse expertise spanning infrastructure engineering, system logic, data topology, and security UX.
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
          <p className="text-sm leading-6 text-neutral-700">
            Select your domain below to access working groups, active bounties, and architectural blueprints for your lane.
          </p>
        </div>
      </header>

      <section className="mt-10 grid gap-4">
        <Card
          title="⚙️ Category 1: Agentic Orchestration & Core Engineering"
          focus="Microservices, Event-Driven Architecture (EDA), Serverless, and Edge+Cloud routing."
          items={[
            "Infrastructure & DevOps (Kairo): expand autonomous provisioning and telemetry-driven remediation.",
            "SDLC & Code Quality (Agent Code): deeper CI/CD integration for automated, secure PR reviews.",
            "Creative & Growth Pods (Angelo, Vire, Viral): expand tool-access APIs for localized web assets and campaigns.",
            "Active bounty: optimize EDA routing logic for 10k+ concurrent agent events with sub-second latency.",
            "Active bounty: add a serverless connector for multi-cloud load balancing workflows.",
          ]}
        />

        <Card
          title="🧠 Category 2: Cognitive Engineering & System Logic"
          focus="Model access, prompt management, evaluation harnesses, and reasoning guardrails."
          items={[
            "Ethics & reasoning layer: structured prompts + eval datasets that reduce hallucinations and enforce multi-sided reasoning.",
            "RLHF & persona profiles: refine tone, candor, and accuracy for production-grade digital employees.",
            "Active bounty: submit 500 edge-case PR reviews showing how Agent Code should prioritize long-term stability over short-term speed.",
            "Active bounty: refine embedding/retrieval logic for intent prediction and answer-engine optimization workflows.",
          ]}
        />

        <Card
          title="🕸️ Category 3: Memory & Data Architecture"
          focus="Vector stores, graph databases, and structured/unstructured data ingestion."
          items={[
            "Topology layer (Graph DB): map microservices, APIs, infra dependencies so agents avoid cascading failures.",
            "Semantic layer (Vector): ingestion pipelines for brand and operational documents; high-fidelity retrieval at scale.",
            "Active bounty: automated data-scrubber to update dependency edges when infra changes occur.",
            "Active bounty: improve vector retrieval latency for multi-language compliance and brand documents.",
          ]}
        />

        <Card
          title="🛡️ Category 4: Security UX & Frontend Operations"
          focus="Agent UI layer, dashboards, data isolation, audit logs, and human-in-the-loop governance."
          items={[
            "Orchestrator dashboard: visualize topology and monitor event streams in real time.",
            "Autonomy governance: refine UI controls that define exactly how much an agent can do without a human click.",
            "Prompt injection defense: sanitize inputs and isolate malicious instructions at the edge.",
            "Active bounty: mobile-responsive action sandbox for reviewing/approving Agent Code pull requests.",
            "Active bounty: immutable, scannable audit log UI explaining the rationale behind Kairo actions.",
          ]}
        />
      </section>

      <section className="mt-12">
        <SectionTitle>Contributor Onboarding Guide</SectionTitle>
        <p className="mt-3 text-sm leading-6 text-neutral-700">
          From zero to first PR: boot your local sandbox, initialize memory layers, trigger EDA, and submit your first bounty.
          Treat this as an ecosystem — not a repo.
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900">Step 1: Clone & provision the local sandbox</h3>
          <pre className="mt-3 overflow-auto rounded-xl bg-neutral-900 p-4 text-xs text-white">
{`git clone https://github.com/vireoka/vireoka-core.git
cd vireoka-core

python3 -m venv vireoka-env
source vireoka-env/bin/activate
pip install -r requirements/backend.txt

cd frontend-ui
npm install
npm run start`}
          </pre>

          <h3 className="mt-6 text-lg font-semibold text-neutral-900">Step 2: Initialize the memory layers</h3>
          <pre className="mt-3 overflow-auto rounded-xl bg-neutral-900 p-4 text-xs text-white">
{`docker-compose up -d graph-db vector-store
python manage.py seed_mock_enterprise`}
          </pre>

          <h3 className="mt-6 text-lg font-semibold text-neutral-900">Step 3: Trigger the Event-Driven Architecture (EDA)</h3>
          <pre className="mt-3 overflow-auto rounded-xl bg-neutral-900 p-4 text-xs text-white">
{`python manage.py start_eda_broker

${curlExample}`}
          </pre>

          <h3 className="mt-6 text-lg font-semibold text-neutral-900">Step 4: Claim your first bounty</h3>
          <pre className="mt-3 overflow-auto rounded-xl bg-neutral-900 p-4 text-xs text-white">
{`git checkout -b feature/kairo-aws-routing
# or
git checkout -b fix/agent-code-linting-rules

pytest tests/core_agents/`}
          </pre>

          <h3 className="mt-6 text-lg font-semibold text-neutral-900">Step 5: Submit your pull request (PR)</h3>
          <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-neutral-700 space-y-1">
            <li><span className="font-semibold text-neutral-900">Target agent:</span> Kairo / Vire / API Gateway / Agent Code</li>
            <li><span className="font-semibold text-neutral-900">Objective:</span> what limitation does this solve?</li>
            <li><span className="font-semibold text-neutral-900">Rationale:</span> how does this protect systemic dependencies and long-term stability?</li>
          </ul>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            Agent Code is your first reviewer. If it blocks the PR, fix issues with the agent before requesting human maintainer time.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle>Vireoka PR Review Guidelines: Maintainer’s Playbook</SectionTitle>
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm leading-6 text-neutral-700">
            As a maintainer, you’re not a human linter. You’re the final governance layer between community contributions and production
            digital workers.
          </p>

          <h3 className="mt-5 text-base font-semibold text-neutral-900">Step 1: Agent Code pre-flight (automated)</h3>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-neutral-700 space-y-1">
            <li>Security audit (secrets, OWASP risks, injection vectors).</li>
            <li>Topology / dependency warnings for routing or infra changes.</li>
            <li>Formatting and lint consistency.</li>
          </ul>

          <h3 className="mt-5 text-base font-semibold text-neutral-900">Step 2: Architectural & logic audit (human)</h3>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-neutral-700 space-y-1">
            <li>Systemic integrity: respects EDA and cross-agent awareness.</li>
            <li>Bounded autonomy: no bypass of action sandbox or approval gates.</li>
            <li>Cross-cutting concerns: localization, accessibility, and operational safety.</li>
          </ul>

          <h3 className="mt-5 text-base font-semibold text-neutral-900">Step 3: Feedback loop</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            If you adjust a good PR, explain the architectural rationale. The delta becomes institutional memory that improves future
            automated reviews.
          </p>

          <h3 className="mt-5 text-base font-semibold text-neutral-900">Step 4: Merge & distribute bounties</h3>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-neutral-700 space-y-1">
            <li>Squash and merge with clean commit message (e.g., <span className="font-mono">[Kairo] Improves multi-region scaling policy</span>).</li>
            <li>CI/CD deploys upgrades to the fleet.</li>
            <li>Tag bounty-approved so contributor credits are issued.</li>
          </ul>

          <p className="mt-4 text-sm font-semibold text-neutral-900">
            Agent Code secures the code. You secure the vision.
          </p>
        </div>
      </section>
    </main>
  );
}
