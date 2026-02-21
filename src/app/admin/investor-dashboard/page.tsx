import DashboardClient from "./dashboardClient";

export default function AdminInvestorDashboardPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Admin — Investor Dashboard
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 18 }}>
        Approvals, NDA/email status, access status, outstanding days, and extension requests.
      </p>
      <DashboardClient />
    </div>
  );
}
