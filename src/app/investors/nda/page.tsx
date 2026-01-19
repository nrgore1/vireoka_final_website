import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function InvestorNdaPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Investor NDA</h1>
      <p className="text-neutral-700">
        This content is restricted to qualified investors under NDA.
      </p>
      {/* existing content below */}
    </div>
  );
}
export default function InvestorNdaPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Investor NDA</h1>
      <p className="text-neutral-700">
        This content is restricted to qualified investors under NDA.
      </p>
      {/* existing content below */}
    </div>
  );
}
