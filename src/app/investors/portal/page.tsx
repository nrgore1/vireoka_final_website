import { requireInvestor } from '@/lib/auth/requireInvestor';
import { getUser } from '@/lib/auth/getUser';

export default async function InvestorPortal() {
  const user = await getUser();
  await requireInvestor(user.id);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-semibold">
        Investor Portal
      </h1>
      <p className="mt-4">
        Confidential materials available under NDA.
      </p>
    </main>
  );
}
