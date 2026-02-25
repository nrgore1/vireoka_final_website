import { redirect } from "next/navigation";
import Link from "next/link";
import { readAdminSession } from "@/lib/adminSession";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sess = await readAdminSession();
  if (!sess?.email) redirect("/admin/login");

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>Admin</h1>
          <span style={{ color: "#6b7280", fontSize: 12 }}>{sess.email}</span>

          <Link
            href="/admin/intelligence"
            style={{ fontSize: 12, color: "#111827", textDecoration: "underline" }}
          >
            Intelligence
          </Link>

          <Link
            href="/admin/investor-leads"
            style={{ fontSize: 12, color: "#111827", textDecoration: "underline" }}
          >
            Leads
          </Link>
        </div>

        <form action="/api/admin/logout" method="post">
          <button style={{ padding: "8px 12px", cursor: "pointer" }}>
            Sign out
          </button>
        </form>
      </div>

      {children}
    </div>
  );
}
