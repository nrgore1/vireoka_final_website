import { requireInvestorAccess } from "@/lib/investorGate";

export const runtime = "nodejs";

export default async function InvestorPortalPage() {
  const investor = await requireInvestorAccess();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-semibold">Investor Portal</h1>
      <p className="text-sm text-neutral-700">
        Welcome, {investor.email}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-1">Product overview</h3>
          <p className="text-sm text-neutral-600">
            Governable AI architecture, systems, and controls.
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-1">Design</h3>
          <p className="text-sm text-neutral-600">
            Reference flows and system structure.
          </p>
        </div>
      </div>
    </div>
  );
}
