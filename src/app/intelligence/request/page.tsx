import CheckStatusButton from "../components/CheckStatusButton";

export default function InvestorRequestPage() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">
        Investor Access Request
      </h1>

      <p className="mb-6 text-gray-700">
        Please submit your information to request investor access.
        Approved investors will be invited to review and sign an NDA
        before accessing confidential materials.
      </p>

      <CheckStatusButton />
    </div>
  );
}
