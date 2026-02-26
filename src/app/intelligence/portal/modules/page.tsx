type ModuleRow = {
  key: string;
  name: string;
  purpose: string;
  versions: { version: string; status: "stable" | "beta" | "draft" }[];
  typicalUse: string;
};

const MODULES: ModuleRow[] = [
  {
    key: "core-governance",
    name: "Core Governance Runtime",
    purpose: "Authority envelopes, policy enforcement, authorization, and audit-native execution.",
    versions: [
      { version: "v1.0", status: "stable" },
      { version: "v1.1", status: "beta" },
    ],
    typicalUse: "Required for all digital employees.",
  },
  {
    key: "stablestack-finance",
    name: "StableStack Financial Governance Module",
    purpose: "Policy templates and constraints for governed capital delegation (proving module).",
    versions: [
      { version: "v0.9", status: "beta" },
      { version: "v0.8", status: "draft" },
    ],
    typicalUse: "Agent Stable / StableStack demo and stress testing.",
  },
  {
    key: "infra-ops",
    name: "Infrastructure Operations Governance Module",
    purpose: "Change windows, escalation rules, and blast-radius constraints for infra workflows.",
    versions: [{ version: "v0.4", status: "draft" }],
    typicalUse: "Agent Kairo in controlled environments.",
  },
  {
    key: "code-quality",
    name: "Code Quality Governance Module",
    purpose: "Policy rules for PR review gates, security areas, and architectural exceptions.",
    versions: [{ version: "v0.6", status: "beta" }],
    typicalUse: "Agent Cody for governed code workflows.",
  },
  {
    key: "brand-design",
    name: "Design & Brand Governance Module",
    purpose: "Brand constraints, token governance, approval requirements for global design changes.",
    versions: [{ version: "v0.5", status: "beta" }],
    typicalUse: "Agent Angelo for design systems governance.",
  },
];

function Badge({ s }: { s: "stable" | "beta" | "draft" }) {
  const cls =
    s === "stable"
      ? "bg-green-50 border-green-200 text-green-900"
      : s === "beta"
      ? "bg-amber-50 border-amber-200 text-amber-900"
      : "bg-gray-50 border-gray-200 text-gray-800";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {s}
    </span>
  );
}

export default function PortalModulesPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Governance Modules</h1>
        <p className="text-gray-700">
          Vireoka stays industry-agnostic in the core runtime. Domain-specific constraints ship as modular policy packages.
          This keeps governance infrastructure durable as new workflows and markets evolve.
        </p>
      </section>

      <div className="space-y-4">
        {MODULES.map((m) => (
          <div key={m.key} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">{m.name}</div>
                <div className="mt-1 text-sm text-gray-700">{m.purpose}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {m.versions.map((v) => (
                  <span key={v.version} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-800">
                    {v.version} <Badge s={v.status} />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Typical use:</span> {m.typicalUse}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
