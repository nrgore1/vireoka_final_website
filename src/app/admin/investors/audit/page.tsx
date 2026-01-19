import AdminAuditClient from "./AdminAuditClient";

export const metadata = {
  title: "Admin — Investor Audit Log",
};

export default function AdminAuditPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Investor Audit Log</h1>
      <AdminAuditClient />
    </div>
  );
}
