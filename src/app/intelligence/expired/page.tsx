import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Expired — Vireoka",
  robots: { index: false, follow: false },
};

export default function InvestorExpiredPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Access expired</h1>
      <p className="text-neutral-700">
        Your investor access window has expired. Please request a refreshed invite.
      </p>
    </div>
  );
}
