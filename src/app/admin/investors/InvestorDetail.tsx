import AdminInvestorTimeline from "./AdminInvestorTimeline";

type Investor = {
  email: string;
  status: string;
  approved_at?: string;
  expires_at?: string;
};

export default function InvestorDetail({
  investor,
}: {
  investor: Investor;
}) {
  return (
    <section className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">
        Activity timeline
      </h3>

      <AdminInvestorTimeline email={investor.email} />
    </section>
  );
}
