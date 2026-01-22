import InvestorGate from "./components/InvestorGate";
import Link from "next/link";

export default function InvestorsPage() {
  return (
    <InvestorGate>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <h1>Investor Materials</h1>
        <p style={{ maxWidth: 640, opacity: 0.85 }}>
          Governable AI for real-world accountability.
          This section contains confidential materials shared under NDA.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 32 }}>
          <Card
            title="Live Demo"
            href="/investors/demo"
            desc="Governed AI execution walkthrough"
          />
          <Card
            title="Figma Prototype"
            href="/investors/figma"
            desc="UI + workflow exploration"
          />
        </div>
      </main>
    </InvestorGate>
  );
}

function Card({ title, desc, href }: any) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 16,
          padding: 18,
          background: "rgba(255,255,255,.04)",
        }}
      >
        <h3>{title}</h3>
        <p style={{ opacity: 0.75 }}>{desc}</p>
      </div>
    </Link>
  );
}
