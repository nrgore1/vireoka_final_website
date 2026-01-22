import InvestorGate from "../components/InvestorGate";

export default function FigmaPage() {
  return (
    <InvestorGate>
      <main style={{ padding: 40 }}>
        <h1>Figma Prototype</h1>
        <p style={{ opacity: 0.75 }}>
          For review purposes only. Do not share.
        </p>

        <div style={{ marginTop: 24, height: "80vh", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)" }}>
          <iframe
            src="PASTE_YOUR_FIGMA_EMBED_URL_HERE"
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          />
        </div>
      </main>
    </InvestorGate>
  );
}
