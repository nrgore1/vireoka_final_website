import { accessCheck } from "@/agents/investor/investorManagerAgent";

export default async function InvestorDocuments() {
  const r = await accessCheck();
  const role = r.ok ? String(r.role || "").toLowerCase() : "";
  const isVC = role === "vc" || role.includes("venture");

  return (
    <main style={{ padding: 40 }}>
      <h1>Document Vault</h1>
      <p>All documents in this area are confidential.</p>

      <ul style={{ marginTop: 16 }}>
        <li><a href="#">Pitch Deck (confidential)</a></li>
        <li><a href="#">Governance Overview (confidential)</a></li>

        {isVC ? (
          <>
            <li><a href="#">Financial Model (VC-only)</a></li>
            <li><a href="#">Data Room Index (VC-only)</a></li>
          </>
        ) : null}
      </ul>
    </main>
  );
}
