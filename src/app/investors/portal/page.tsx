import { requireInvestor } from "@/lib/auth/requireInvestor";

export default async function InvestorPortal() {
  const user = await requireInvestor();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-semibold">Investor Portal</h1>
      <p className="mt-2 opacity-80">Signed in as: {user.email}</p>

      <div className="mt-6">
        <p>Welcome to the Vireoka investor portal.</p>
      </div>
    </main>
  );
}
