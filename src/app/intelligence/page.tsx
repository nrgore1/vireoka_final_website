import Link from "next/link";
import { CTABar } from "@/components/CTABar";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

const RoleLink = ({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) => (
  <Link
    href={href}
    className="rounded-2xl border border-gray-200 bg-white p-5 hover:bg-gray-50 transition"
  >
    <div className="text-sm font-semibold text-gray-900">{title}</div>
    <div className="mt-1 text-sm text-gray-700">{desc}</div>
  </Link>
);

export default function IntelligenceOverview() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-12">
      <section className="space-y-5">
        <h1 className="text-4xl font-bold text-vireoka-indigo">
          Vireoka Intelligence
        </h1>

        <p className="text-lg text-gray-700">
          Vireoka builds governance-native agentic infrastructure: digital employees that
          operate within defined authority, policy constraints, and audit-native execution.
          This is not generic AI tooling—this is runtime governance for delegation.
        </p>

        <CTABar
          primaryHref="/intelligence/portal"
          primaryLabel="Open Portal (if approved)"
          secondaryHref="/intelligence/request-access"
          secondaryLabel="Request Access"
        />
      </section>

      <ArchitectureDiagram />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Digital Employees</h2>
        <p className="text-gray-700">
          We deploy domain-specialized agents as digital employees, governed by a shared runtime:
          authority envelopes, pre-execution enforcement, escalation logic, and immutable audit.
        </p>

        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Agent Kairo</strong> — Infrastructure orchestration</li>
          <li><strong>Agent Angelo</strong> — Design systems management</li>
          <li><strong>Agent Cody</strong> — Code quality & architecture governance</li>
          <li><strong>Agent Vire</strong> — Website development and delivery</li>
          <li><strong>Agent Viral</strong> — Marketing systems and demand orchestration</li>
          <li><strong>Agent Stable</strong> — StableStack proving module (policy-constrained capital delegation)</li>
        </ul>

        <div className="pt-2">
          <Link
            href="/intelligence/stablestack"
            className="text-sm font-semibold text-vireoka-indigo hover:underline"
          >
            Explore StableStack proving module →
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-gray-900">Choose your role</h2>

        <p className="text-gray-700">
          These pages are written for <strong>external stakeholders</strong> we’re actively engaging—advisors,
          angels, VCs, partners, and contributors. You may fit one (or more) of these roles.
          Pick the lens that matches you, and you’ll see how you can help Vireoka reach the market with confidence.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <RoleLink
            href="/intelligence/advisors"
            title="Advisors"
            desc="Shape governance primitives, deployment models, and category standards. Be a structural partner—not a name on a slide."
          />
          <RoleLink
            href="/intelligence/angels"
            title="Angel Investors"
            desc="Early conviction in governed digital employees. Help accelerate credibility, introductions, and early pilots."
          />
          <RoleLink
            href="/intelligence/vc"
            title="VCs"
            desc="Infrastructure thesis, expansion path, and control-plane economics. Evaluate the runtime + proof modules."
          />
          <RoleLink
            href="/intelligence/partners"
            title="Partners"
            desc="Integrate governance into platforms, workflows, and agent ecosystems. Co-build modules and distribution pathways."
          />
          <RoleLink
            href="/intelligence/contributors"
            title="Contributors"
            desc="Help build the technical and research layer: policy models, audit systems, orchestration patterns, and agent templates."
          />
          <RoleLink
            href="/intelligence/request-access"
            title="Request Portal Access"
            desc="Get access to deeper material: agent catalog, governance modules, videos, demos, and the data room."
          />
        </div>

        <div className="text-sm text-gray-600">
          Not sure where you fit? Start with{" "}
          <Link href="/intelligence/vc" className="font-semibold text-vireoka-indigo hover:underline">
            VC
          </Link>{" "}
          for the highest-level thesis, or{" "}
          <Link href="/intelligence/advisors" className="font-semibold text-vireoka-indigo hover:underline">
            Advisors
          </Link>{" "}
          for the architecture lens.
        </div>
      </section>
    </main>
  );
}
