export function ArchitectureDiagram() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-3 text-sm font-semibold text-gray-900">Governed Intelligence Stack</div>

      <svg viewBox="0 0 900 260" className="w-full h-auto">
        <defs>
          <style>
            {`
              .box { fill: #ffffff; stroke: #e5e7eb; stroke-width: 2; rx: 14; }
              .title { font: 600 14px system-ui; fill: #111827; }
              .sub { font: 500 12px system-ui; fill: #6b7280; }
              .arrow { stroke: #9ca3af; stroke-width: 2.5; marker-end: url(#m); }
            `}
          </style>
          <marker id="m" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
          </marker>
        </defs>

        <rect className="box" x="30"  y="60" width="150" height="140" />
        <text className="title" x="105" y="105" textAnchor="middle">Workflows</text>
        <text className="sub" x="105" y="130" textAnchor="middle">Apps / Ops / Tools</text>

        <line className="arrow" x1="190" y1="130" x2="250" y2="130" />

        <rect className="box" x="260" y="60" width="180" height="140" />
        <text className="title" x="350" y="100" textAnchor="middle">Digital Employees</text>
        <text className="sub" x="350" y="125" textAnchor="middle">Agent Kairo • Cody • Angelo</text>
        <text className="sub" x="350" y="145" textAnchor="middle">Vire • Viral • Stable</text>

        <line className="arrow" x1="450" y1="130" x2="510" y2="130" />

        <rect className="box" x="520" y="60" width="190" height="140" />
        <text className="title" x="615" y="96" textAnchor="middle">Vireoka Governance</text>
        <text className="sub" x="615" y="122" textAnchor="middle">Authority Envelopes</text>
        <text className="sub" x="615" y="142" textAnchor="middle">Policy Enforcement</text>
        <text className="sub" x="615" y="162" textAnchor="middle">Execution Authorization</text>

        <line className="arrow" x1="720" y1="130" x2="780" y2="130" />

        <rect className="box" x="790" y="60" width="80" height="140" />
        <text className="title" x="830" y="110" textAnchor="middle">Audit</text>
        <text className="sub" x="830" y="135" textAnchor="middle">Immutable</text>
        <text className="sub" x="830" y="155" textAnchor="middle">Trace</text>
      </svg>

      <p className="mt-4 text-sm text-gray-700">
        Governance is runtime architecture: every action must pass scope validation, policy enforcement, authorization, and audit logging.
      </p>
    </div>
  );
}
