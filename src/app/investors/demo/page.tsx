"use client";

import InvestorGate from "../components/InvestorGate";
import { useState } from "react";

export default function DemoPage() {
  const [step, setStep] = useState(0);

  const steps = [
    "Decision Pending",
    "Governance Gate",
    "Review Council",
    "Decision Lineage",
    "Replay Integrity",
    "Export Proof",
  ];

  return (
    <InvestorGate>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 60 }}>
        <h1>Live Investor Demo</h1>
        <p style={{ opacity: 0.75 }}>
          Governed AI execution — before automation acts.
        </p>

        <div style={{ display: "flex", gap: 24, marginTop: 32 }}>
          <aside style={{ width: 260 }}>
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: "100%",
                  marginBottom: 8,
                  padding: 12,
                  borderRadius: 10,
                  background: step === i ? "rgba(138,180,255,.2)" : "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.12)",
                  color: "#e7eefc",
                }}
              >
                {s}
              </button>
            ))}
          </aside>

          <section style={{ flex: 1, border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 24 }}>
            <h2>{steps[step]}</h2>
            <p style={{ opacity: 0.8 }}>
              This step demonstrates how governance is enforced before execution.
            </p>
          </section>
        </div>
      </main>
    </InvestorGate>
  );
}
