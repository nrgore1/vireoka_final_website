import AdminAuditClient from "./AdminAuditClient";

export const metadata = {
  title: "Admin — Investor Audit",
  robots: { index: false, follow: false },
};

export default function AdminAuditPage() {
  return (
    <main className="max-w-5xl mx-auto py-10 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Investor Audit Log</h1>
          <p className="text-sm text-neutral-600">Approve / reject / revoke / delete events.</p>
        </div>
        <a className="text-sm underline underline-offset-4" href="/admin/investors">
          Back to investors →
        </a>
      </div>

      <AdminAuditClient />
    </main>
  );
}
