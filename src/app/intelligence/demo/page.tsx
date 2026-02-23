import InvestorGate from "../components/InvestorGate";

export default function DemoPage() {
  return (
    <InvestorGate>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Investor Demo</h1>
        <p>Confidential demo content.</p>
      </div>
    </InvestorGate>
  );
}
