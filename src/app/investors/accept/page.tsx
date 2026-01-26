import { redirect } from "next/navigation";
import { verifyInvestorSession } from "@/lib/investorSession";
import { getInvestorByEmail } from "@/lib/investorStore";

export default async function AcceptNdaPage() {
  const session = await verifyInvestorSession();
  if (!session) {
    redirect("/investors/request");
  }

  // ✅ Correct: resolve investor via session.email
  const investor = await getInvestorByEmail(session.email);
  if (!investor) {
    redirect("/investors/request");
  }

  // NDA already signed → skip
  if (investor.nda_accepted_at) {
    redirect("/investors");
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">
        Confidentiality Agreement
      </h1>

      <p className="mb-6 text-gray-700">
        Please review and accept the Non-Disclosure Agreement
        to access confidential investor materials.
      </p>

      {/* NDA acceptance UI goes here */}
    </div>
  );
}
