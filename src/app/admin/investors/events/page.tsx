import AdminInvestorEventsClient from "./AdminInvestorEventsClient";

export const metadata = { title: "Admin — Investor Events" };

export default function AdminInvestorEventsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Investor Activity Timeline</h1>
      <AdminInvestorEventsClient />
    </div>
  );
}
