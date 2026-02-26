export function GovernanceFlowDiagram() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-3 text-sm font-semibold text-gray-900">Runtime Governance Flow</div>

      <svg viewBox="0 0 900 120" className="w-full h-auto">
        <defs>
          <style>
            {`
              .box { fill: #ffffff; stroke: #e5e7eb; stroke-width: 2; rx: 14; }
              .t { font: 600 13px system-ui; fill: #111827; }
              .a { stroke: #9ca3af; stroke-width: 2.5; marker-end: url(#m); }
            `}
          </style>
          <marker id="m" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
          </marker>
        </defs>

        {[
          ["Trigger", 20],
          ["Scope", 170],
          ["Policy", 320],
          ["Authorize", 470],
          ["Execute", 620],
          ["Audit", 770],
        ].map(([label, x]) => (
          <g key={String(label)}>
            <rect className="box" x={Number(x)} y="30" width="120" height="60" />
            <text className="t" x={Number(x) + 60} y="66" textAnchor="middle">
              {String(label)}
            </text>
          </g>
        ))}

        <line className="a" x1="140" y1="60" x2="170" y2="60" />
        <line className="a" x1="290" y1="60" x2="320" y2="60" />
        <line className="a" x1="440" y1="60" x2="470" y2="60" />
        <line className="a" x1="590" y1="60" x2="620" y2="60" />
        <line className="a" x1="740" y1="60" x2="770" y2="60" />
      </svg>

      <p className="mt-4 text-sm text-gray-700">
        No bypass path. If a proposal violates constraints, it is blocked and recorded.
      </p>
    </div>
  );
}
