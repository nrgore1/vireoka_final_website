import { requireInvestorAccess } from "@/lib/investorGate";

export const metadata = { title: "Investor Portal" };

export default async function InvestorPortalPage() {
  // Enforce access on the server before rendering.
  await requireInvestorAccess();

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Investor Portal</h1>
      <p style={{ color: "#6b7280" }}>
        You have access. If you believe this is incorrect, please contact support.
      </p>
      {/* TODO: render portal content */}
    </main>
  );
}
