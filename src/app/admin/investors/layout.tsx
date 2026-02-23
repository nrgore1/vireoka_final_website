import Link from "next/link";

export default function AdminInvestorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <Link
          href="/admin/investor-dashboard"
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #111827",
            background: "#111827",
            color: "white",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Investor Dashboard
        </Link>

        <Link
          href="/admin/intelligence"
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "white",
            color: "#111827",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Investors
        </Link>

        <span style={{ color: "#6b7280", fontSize: 12 }}>
          Admin navigation
        </span>
      </div>

      {children}
    </div>
  );
}
