import Link from "next/link";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-800">
      {children}
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-2 overflow-auto rounded-lg bg-white p-3 text-xs text-gray-800 border border-gray-200">
      {code}
    </pre>
  );
}

function Card({
  id,
  icon,
  title,
  focus,
  body,
  groups,
  bounties,
}: {
  id: string;
  icon: string;
  title: string;
  focus: string;
  body: string;
  groups: string[];
  bounties: string[];
}) {
  return (
    <section id={id} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            {icon} {title}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Focus:</span> {focus}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill>Repositories</Pill>
          <Pill>Active bounties</Pill>
          <Pill>Blueprints</Pill>
        </div>
      </div>

      <p className="text-sm text-gray-700">{body}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Current working groups</h3>
          <ul className="mt-3 list-disc pl-6 text-sm text-gray-700 space-y-2">
            {groups.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">Active bounties</h3>
          <ul className="mt-3 list-disc pl-6 text-sm text-gray-700 space-y-2">
            {bounties.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function PortalContributorsPage() {
  return (
    <main className="space-y-8">
      <header className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h1 className="text-2xl font-semibold text-gray-900">Contributor Portal: Hubs & Categories</h1>
        <p className="text-gray-700">
          Welcome to the central forge of the Vireoka ecosystem. To build a truly governed, autonomous digital workforce,
          we require diverse expertise spanning deep infrastructure, system logic, data topology, and security-grade UX.
        </p>
        <p className="text-gray-700">
          Select your domain below to access the repositories, active bounties, and architectural blueprints for your working group.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Link className="text-sm font-semibold text-vireoka-indigo hover:underline" href="#agentic-orchestration">
            ⚙️ Agentic Orchestration & Core Engineering
          </Link>
          <span className="text-gray-300">•</span>
          <Link className="text-sm font-semibold text-vireoka-indigo hover:underline" href="#system-logic">
            🧠 System Logic & Prompt Ops
          </Link>
          <span className="text-gray-300">•</span>
          <Link className="text-sm font-semibold text-vireoka-indigo hover:underline" href="#memory-data">
            🕸️ Memory & Data Architecture
          </Link>
          <span className="text-gray-300">•</span>
          <Link className="text-sm font-semibold text-vireoka-indigo hover:underline" href="#security-ux">
            🛡️ Security UX & Frontend Ops
          </Link>
        </div>
      </header>

      <Card
        id="agentic-orchestration"
        icon="⚙️"
        title="Category 1: Agentic Orchestration & Core Engineering"
        focus="Microservices, Event-Driven Architecture (EDA), Serverless, and Edge + Cloud routing"
        body="This hub is for systems engineers and backend architects building the pathways our digital workforce uses to communicate and execute tasks. You will work on runtime orchestration, the gateway layer, and event routing that keeps agents fast, safe, and auditable."
        groups={[
          "Infrastructure & DevOps (Agent Kairo): expanding autonomous provisioning across Edge and Cloud resources; resolving telemetry anomalies through governed runbooks.",
          "SDLC & Code Quality (Agent Cody): deeper CI/CD integrations (GitHub Actions, GitLab) for secure automated PR reviews and policy checks.",
          "Creative & Growth Pods (Angelo, Vire, Viral): tool-access APIs that allow design and growth agents to deploy localized assets safely.",
        ]}
        bounties={[
          "Optimize EDA routing logic to handle 10k+ concurrent autonomous agent events with sub-second latency.",
          "Build a new serverless connector for Agent Kairo to manage multi-cloud (AWS + GCP) load balancing natively.",
        ]}
      />

      <Card
        id="system-logic"
        icon="🧠"
        title="Category 2: System Logic & Prompt Operations"
        focus="Model access patterns, prompt management, evaluation harnesses, persona profiles, and agent reasoning discipline"
        body="This hub is for AI engineers and researchers who treat prompting and evaluation as production infrastructure. Your goal: reduce failures, enforce multi-step reasoning discipline, strengthen refusal boundaries, and keep the system honest under adversarial input—while preserving utility."
        groups={[
          "Ethics & Reasoning Layer: structuring prompts and evaluation suites that enforce causality-aware checks and multi-sided reasoning.",
          "Holistic Systems Integration: translating equilibrium and trade-off thinking into operational logic (e.g., stability-first remediation).",
          "RLHF & Persona Profiles: refining tone, candor, and accuracy using feedback traces from real workflows.",
        ]}
        bounties={[
          "Submit 500 edge-case PR review examples showing how Agent Cody should prioritize long-term architectural stability over short-term deployment speed.",
          "Refine embedding/retrieval logic for Agent Viral’s Answer Engine Optimization (AEO) to better predict shifts in search intent.",
        ]}
      />

      <Card
        id="memory-data"
        icon="🕸️"
        title="Category 3: Memory & Data Architecture"
        focus="Vector stores, graph databases, structured/unstructured ingestion, and topology-aware guardrails"
        body="An agent without memory is just a chatbot. This hub ensures digital employees have accurate, real-time context of the systems they operate in—so they don’t cause cascading failures or drift off-brand."
        groups={[
          "Topology Layer (Graph DB): schema and runtime checks that map services, APIs, and infra dependencies so agents understand blast radius.",
          "Semantic Layer (Vector Store): ingestion pipelines for unstructured docs so agents can mirror brand voice, compliance constraints, and system knowledge accurately.",
        ]}
        bounties={[
          "Build an automated scrubber that updates graph dependency edges immediately when a new cloud resource is provisioned.",
          "Improve vector retrieval speed for massive multi-language brand compliance documents with tight latency budgets.",
        ]}
      />

      <Card
        id="security-ux"
        icon="🛡️"
        title="Category 4: Security UX & Frontend Operations"
        focus="Agent UI layer, dashboards, data isolation, policy controls, and audit visibility"
        body="This hub is for frontend developers, UX designers, and SecOps specialists. The barrier to enterprise agent adoption is trust. Here you’ll build Security UX: human-in-the-loop interfaces that make autonomy safe, legible, and controllable."
        groups={[
          "Orchestrator Dashboard: React components to visualize topology and monitor event streams in real time.",
          "Autonomy Governance: UI controls (Levels 1–4) that define exactly how much autonomy an agent gets before requiring a human click.",
          "Prompt Injection Defense: hardening inputs and gateway patterns to sanitize and isolate malicious commands.",
        ]}
        bounties={[
          "Design and code a mobile-responsive Action Sandbox where managers can review/edit Agent Cody’s proposed PRs on a phone.",
          "Implement an immutable, scannable Audit Log UI that shows the rationale behind every action taken by Agent Kairo.",
        ]}
      />

      <section id="onboarding" className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-900">Contributor Onboarding Guide</h2>
        <p className="text-gray-700">
          From zero to first PR: boot your local sandbox, initialize memory layers, trigger the event stream, and ship your first bounty.
          This guide is written as a reference workflow; align the commands to the repo(s) you’ve been granted access to.
        </p>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 1 — Clone & provision the local sandbox</summary>
          <div className="mt-3 space-y-3 text-sm text-gray-700">
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Clone the core repository and enter it:
                <CodeBlock code={`git clone <repo-url>\ncd <repo-folder>`} />
              </li>
              <li>
                Initialize backend environment (adjust per stack):
                <CodeBlock
                  code={`# example (python)\npython3 -m venv vireoka-env\nsource vireoka-env/bin/activate\npip install -r requirements.txt`}
                />
              </li>
              <li>
                Boot the UI layer:
                <CodeBlock code={`cd frontend\nnpm install\nnpm run dev`} />
              </li>
            </ol>
          </div>
        </details>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 2 — Initialize memory layers (graph + vector)</summary>
          <div className="mt-3 space-y-3 text-sm text-gray-700">
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Start data containers (example):
                <CodeBlock code={`docker compose up -d graph-db vector-store`} />
              </li>
              <li>
                Seed a mock enterprise topology + baseline docs (example):
                <CodeBlock code={`# example\npython scripts/seed_mock_enterprise.py`} />
              </li>
            </ol>
          </div>
        </details>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 3 — Trigger the Event-Driven Architecture (EDA)</summary>
          <div className="mt-3 space-y-3 text-sm text-gray-700">
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Start the local event broker (example):
                <CodeBlock code={`python scripts/start_eda_broker.py`} />
              </li>
              <li>
                Fire a test payload (example):
                <CodeBlock
                  code={`curl -X POST http://localhost:8000/api/v1/events/ingress \\\n  -H "Content-Type: application/json" \\\n  -d '{"source":"telemetry","event":"cpu_spike","service_node":"checkout-api"}'`}
                />
              </li>
              <li>
                Verify the dashboard: confirm the event hits the stream, routes to the correct agent, and produces a proposed action in the sandbox.
              </li>
            </ol>
          </div>
        </details>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 4 — Claim your first bounty</summary>
          <div className="mt-3 space-y-3 text-sm text-gray-700">
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Create your branch with clear naming:
                <CodeBlock code={`git checkout -b feature/kairo-aws-routing\n# or\ngit checkout -b fix/cody-linting-rules`} />
              </li>
              <li>Execute the work and keep changes aligned to the governance model (no bypasses).</li>
              <li>
                Run tests (example):
                <CodeBlock code={`npm test\n# or\npytest`} />
              </li>
            </ol>
          </div>
        </details>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 5 — Submit your pull request (PR)</summary>
          <div className="mt-3 space-y-3 text-sm text-gray-700">
            <p className="text-sm text-gray-700">Your PR description must include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Target agent/layer:</strong> (e.g., Kairo, Cody, gateway, UI)</li>
              <li><strong>Objective:</strong> what limitation does this solve?</li>
              <li><strong>Rationale:</strong> how does it preserve bounded autonomy and system stability?</li>
            </ul>
            <p className="text-sm text-gray-700">
              Agent Cody will run pre-flight checks (security, patterns, policy compliance). After it passes, a human maintainer
              reviews architectural intent and merges. Bounty credit is issued after merge.
            </p>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700">
              “Agent Cody secures the code. Humans secure the vision. Merge with intent.”
            </div>
          </div>
        </details>
      </section>

      <section id="maintainers" className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-900">PR Review Guidelines: Maintainer Playbook</h2>
        <p className="text-gray-700">
          As a maintainer, you are not a human linter. You are the final governance layer between community contributions and an
          enterprise-grade digital workforce. Review intent and systemic impact—not formatting.
        </p>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 1 — Agent Cody pre-flight (automated)</summary>
          <div className="mt-3 text-sm text-gray-700 space-y-2">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Security audit:</strong> secrets, unsafe patterns, injection vectors, OWASP issues</li>
              <li><strong>Topology awareness:</strong> flags breaking dependencies / latency spikes / blast radius</li>
              <li><strong>Repo hygiene:</strong> linting, formatting, and conventions</li>
            </ul>
            <p className="text-sm text-gray-700">
              If Agent Cody blocks the PR, do not override. Let the contributor resolve issues first.
            </p>
          </div>
        </details>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 2 — Architectural & logic audit (human review)</summary>
          <div className="mt-3 text-sm text-gray-700 space-y-2">
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Systemic integrity:</strong> respects EDA, emits correct async events, avoids hidden coupling</li>
              <li><strong>Bounded autonomy:</strong> never bypasses sandbox, approvals, or autonomy levels</li>
              <li><strong>Cross-cutting concerns:</strong> localization, accessibility, consistent audit visibility</li>
            </ol>
          </div>
        </details>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 3 — Feedback loop & preference learning</summary>
          <div className="mt-3 text-sm text-gray-700 space-y-2">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Modify & explain:</strong> if you change code, leave objective architectural rationale</li>
              <li><strong>Capture deltas:</strong> document preference changes so future reviews become more autonomous</li>
            </ul>
          </div>
        </details>

        <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">Step 4 — Merge & bounty distribution</summary>
          <div className="mt-3 text-sm text-gray-700 space-y-2">
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Squash & merge</strong> with clear scope tag (e.g., [Kairo] …, [Gateway] …)</li>
              <li><strong>Deploy governed</strong> through CI/CD with audit trail preserved</li>
              <li><strong>Approve bounty</strong> by applying the correct label so credits are issued automatically</li>
            </ol>
          </div>
        </details>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Next step</h2>
        <p className="text-gray-700">
          If you haven’t already, start by reviewing the digital employees catalog and the governance modules. Then pick a hub and
          claim a bounty aligned to your strengths.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/intelligence/portal/agents" className="text-sm font-semibold text-vireoka-indigo hover:underline">
            Explore Digital Employees →
          </Link>
          <Link href="/intelligence/portal/modules" className="text-sm font-semibold text-vireoka-indigo hover:underline">
            Explore Governance Modules →
          </Link>
        </div>
      </section>
    </main>
  );
}
