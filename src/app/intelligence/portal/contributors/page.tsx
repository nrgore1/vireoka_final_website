import Link from "next/link";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-neutral-700">{children}</div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-800">
      <code>{code}</code>
    </pre>
  );
}

export default function ContributorsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-vireoka-indigo">
            Contributor Portal
          </h1>
          <p className="mt-1 text-sm text-neutral-700">
            Welcome to the central forge of the Vireoka ecosystem. To build a truly governed,
            autonomous digital workforce, we require diverse expertise spanning deep infrastructure,
            reasoning systems, data topology, and security UX.
          </p>
        </div>

        <Link
          href="/intelligence/portal"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
        >
          Back to Portal →
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        <Section title="Hubs & Categories">
          <p>
            Select your domain below to access the repositories, active bounties, and architectural
            blueprints for your specific working group.
          </p>
        </Section>

        <Section title="⚙️ Category 1: Agentic Orchestration & Core Engineering">
          <p className="font-medium text-neutral-900">
            Focus: Microservices, Event-Driven Architecture (EDA), Serverless, and Edge+Cloud routing.
          </p>

          <p className="mt-2">
            This hub is for systems engineers and backend architects building the physical pathways
            our digital workforce uses to communicate and execute tasks.
          </p>

          <div className="mt-3">
            <div className="text-sm font-semibold text-neutral-900">Current Working Groups</div>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-neutral-900">Infrastructure & DevOps (Kairo):</span>{" "}
                Expanding Kairo’s ability to autonomously provision Edge and Cloud resources and
                resolve telemetry anomalies.
              </li>
              <li>
                <span className="font-medium text-neutral-900">SDLC & Code Quality:</span> Integrating
                automated, secure PR review patterns into diverse CI/CD pipelines (GitHub Actions,
                GitLab).
              </li>
              <li>
                <span className="font-medium text-neutral-900">Creative & Growth Pods:</span> Expanding
                tool-access APIs that allow design and growth workflows to ship localized assets
                safely.
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">Active Bounties</div>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Optimize EDA routing logic to handle 10k+ concurrent autonomous events with
                sub-second latency.
              </li>
              <li>Build a new serverless connector for multi-cloud load balancing.</li>
            </ul>
          </div>
        </Section>

        <Section title="🧠 Category 2: Cognitive Engineering & System Logic">
          <p className="font-medium text-neutral-900">
            Focus: Model Access, Fine-Tuning, Prompt Management, and Logic Systems.
          </p>

          <p className="mt-2">
            This hub is for AI researchers and prompt engineers focused on safe reasoning,
            constraint-aware planning, and professional-grade agent behavior.
          </p>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">Active Bounties</div>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Submit a dataset of 500 edge-case PR reviews demonstrating how to prioritize
                long-term architectural stability over short-term deployment speed.
              </li>
              <li>
                Refine embedding-layer logic for Answer Engine Optimization (AEO) to better predict
                search intent shifts.
              </li>
            </ul>
          </div>
        </Section>

        <Section title="🕸️ Category 3: Memory & Data Architecture">
          <p className="font-medium text-neutral-900">
            Focus: Vector Stores, Graph Databases, and Structured/Unstructured Ingestion.
          </p>

          <p className="mt-2">
            An AI without memory is just a chatbot. This hub is for data engineers building the
            schemas that allow digital workers to maintain real-time context and safe dependency
            awareness.
          </p>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">Active Bounties</div>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Build automated data-scrubbing that updates Graph DB dependency edges when a new
                cloud resource is provisioned.
              </li>
              <li>
                Improve vector search retrieval speed for massive, multi-language compliance and
                brand documents.
              </li>
            </ul>
          </div>
        </Section>

        <Section title="🛡️ Category 4: Security UX & Frontend Operations">
          <p className="font-medium text-neutral-900">
            Focus: Agent UI Layer, Dashboards, Data Isolation, and Audit Logs.
          </p>

          <p className="mt-2">
            The greatest barrier to enterprise AI is trust. Here, you build the Security UX — the
            human-in-the-loop interfaces that allow leaders to safely orchestrate digital workers.
          </p>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">Active Bounties</div>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Design and code a mobile-responsive “Action Sandbox” where managers can review and
                edit proposed changes.
              </li>
              <li>
                Implement an immutable, visually scannable Audit Log UI that shows rationale behind
                autonomous actions.
              </li>
            </ul>
          </div>
        </Section>

        <Section title="Contributor Onboarding Guide">
          <p className="font-medium text-neutral-900">
            From Zero to First PR: Booting Your Local Digital Workforce
          </p>

          <p className="mt-2">
            Follow these steps to initialize your local sandbox, connect memory layers, and submit
            your first bounty PR.
          </p>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">
              Step 1: Clone & Provision the Local Sandbox
            </div>
            <CodeBlock
              code={`git clone https://github.com/vireoka/vireoka-core.git
cd vireoka-core`}
            />
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">
              Step 2: Initialize the Memory Layers
            </div>
            <CodeBlock
              code={`docker-compose up -d graph-db vector-store
python manage.py seed_mock_enterprise`}
            />
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">
              Step 3: Trigger the Event-Driven Architecture (EDA)
            </div>
            <CodeBlock code={`python manage.py start_eda_broker`} />
            <CodeBlock
              code={`curl -X POST http://localhost:8000/api/v1/events/ingress \\
  -H "Content-Type: application/json" \\
  -d "{\\"source\\":\\"telemetry\\",\\"event\\":\\"cpu_spike\\",\\"service_node\\":\\"checkout-api\\"}"`}
            />
            <p className="mt-2 text-xs text-neutral-600">
              Verify the event appears in the dashboard stream and routes to the correct worker lane.
            </p>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">Step 4: Claim Your First Bounty</div>
            <CodeBlock
              code={`git checkout -b feature/kairo-aws-routing
# or
git checkout -b fix/agent-code-linting-rules`}
            />
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">Step 5: Submit Your Pull Request</div>
            <p className="mt-2">
              Your PR description should include: target worker, objective, and a brief rationale
              describing how the change respects platform constraints and stability.
            </p>
          </div>
        </Section>

        <Section title="PR Review Guidelines: Maintainer’s Playbook">
          <p className="font-medium text-neutral-900">Governing the Digital Workforce Ecosystem</p>

          <p className="mt-2">
            Maintainers are the final governance layer. Don’t review syntax — review intent and
            system impact.
          </p>

          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              Verify automated checks (security, dependency impact, formatting). If blocked, let the
              contributor resolve issues first.
            </li>
            <li>
              Evaluate systemic integrity, bounded autonomy, and cross-cutting standards (accessibility,
              localization, auditability).
            </li>
            <li>
              Provide rationale with edits so the system learns preferences over time.
            </li>
            <li>
              Merge cleanly and approve bounty tagging for automated crediting.
            </li>
          </ol>

          <p className="mt-3 text-sm font-semibold text-neutral-900">
            “Automation secures the code. You secure the vision. Merge with intent.”
          </p>
        </Section>
      </div>
    </main>
  );
}
