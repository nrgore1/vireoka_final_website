import Link from "next/link";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
      {children}
    </span>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-neutral-700">{children}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex flex-wrap justify-center gap-2">
          <Chip>Autonomous Digital Workers</Chip>
          <Chip>Policy-bound execution</Chip>
          <Chip>Audit by default</Chip>
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-vireoka-indigo sm:text-5xl">
          Vireoka is the operating system for autonomous digital workers.
        </h1>

        <p className="mt-4 text-lg leading-7 text-neutral-700">
          The first production role is{" "}
          <span className="font-medium text-neutral-900">Kairo</span> — a Digital Infrastructure
          Worker that helps teams run AI workloads with less waste and less firefighting, without
          expanding their DevOps team.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/intelligence/request-access"
            className="inline-flex items-center justify-center rounded-xl bg-vireoka-indigo px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Request Portal Access
          </Link>

          <Link
            href="/intelligence"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
          >
            Explore Vireoka Intelligence →
          </Link>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Access is gated. If required, you’ll receive an NDA link by email before approval.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Card title="Kairo — what it does">
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              Monitors production AI systems and detects GPU waste, capacity drift, and noisy
              firefighting patterns.
            </li>
            <li>
              Produces safe, policy-aware recommendations (shadow mode) and can execute changes
              gradually (approved mode) with rollback.
            </li>
            <li>
              Optimizes across environments and vendors by focusing on customer efficiency — not
              maximizing any single cloud’s consumption.
            </li>
            <li>Turns savings into a measurable ledger: “Kairo saved you $X this month.”</li>
          </ul>
        </Card>

        <Card title="What makes it durable">
          <p>
            Autonomy only works when it’s accountable. Kairo operates inside an authority envelope:
            proposals are validated against policy before execution, and every action is recorded
            during execution.
          </p>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-xs font-semibold text-neutral-900">Runtime flow</div>
            <div className="mt-2 grid grid-cols-6 gap-2 text-[11px] text-neutral-700">
              {["Trigger", "Scope", "Policy", "Authorize", "Execute", "Audit"].map((x) => (
                <div
                  key={x}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-center shadow-sm"
                >
                  {x}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-neutral-600">
              No bypass path. If a proposal violates constraints, it is blocked and logged.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Who the Intelligence Portal is for</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          The portal is designed for external stakeholders who can help Vireoka reach the market
          with confidence — investors, advisors, partners, operators, and contributors. You can
          engage in any role and switch as needed.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Advisors", "Angels", "VC / funds", "Partners", "Operators", "Contributors"].map((x) => (
            <span
              key={x}
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700"
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
