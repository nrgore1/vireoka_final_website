import { trustArtifacts } from "@/lib/content";

export default function TrustCenterPage() {
  return (
    <div className="grid gap-6">
      <div>
        <div className="vk-pill">Enterprise Trust</div>
        <h1 className="mt-3 text-3xl font-semibold">Trust Center</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          How Vireoka earns trust: auditability, policy enforcement, cryptographic integrity, and reproducible governance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {trustArtifacts.map((t) => (
          <div key={t.title} className="vk-card p-6">
            <div className="text-sm font-semibold">{t.title}</div>
            <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>{t.summary}</p>
            <div className="mt-4 grid gap-2">
              {t.items.map((i) => (
                <a key={i.href} href={i.href} className="vk-btn" style={{ justifyContent: "space-between" }}>
                  <span>{i.label}</span>
                  <span style={{ color: "var(--vk-muted)" }}>→</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section id="lineage" className="vk-card p-7">
        <h2 className="text-xl font-semibold">Lineage & Replay</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Every governed decision produces a lineage chain (inputs, evidence, policy version, council votes, confidence scoring).
          Replay re-evaluates the same chain to verify integrity and reproducibility.
        </p>
      </section>

      <section id="exports" className="vk-card p-7">
        <h2 className="text-xl font-semibold">Signed Exports</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Exports are generated for audit and board review. They can be JSON for systems and PDF for humans.
          Both should remain verifiable and tamper-evident.
        </p>
      </section>

      <section id="keys" className="vk-card p-7">
        <h2 className="text-xl font-semibold">Key Management & Rotation</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Keys are rotated with KID-based identification and safe decrypt pathways that preserve backward readability during transitions.
        </p>
      </section>

      <section id="policy" className="vk-card p-7">
        <h2 className="text-xl font-semibold">Policy Engine</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Policies translate intent into enforceable outcomes: ALLOW, ALLOW_WITH_REVIEW, or BLOCK—with explicit reasons.
        </p>
      </section>

      <section id="councils" className="vk-card p-7">
        <h2 className="text-xl font-semibold">Councils & Dissent</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Multiple reasoning perspectives evaluate decisions independently. Disagreement is preserved as an asset, not collapsed away.
        </p>
      </section>

      <section id="execution" className="vk-card p-7">
        <h2 className="text-xl font-semibold">Execution Guardrails</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Execution (when enabled) requires dry-runs, cost estimates, rollback metadata, and strict policy thresholds.
        </p>
      </section>
    </div>
  );
}
