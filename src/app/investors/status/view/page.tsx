import { Suspense } from "react";
import ViewClient from "./viewClient";

export const metadata = {
  title: "Investor Status",
};

export default function InvestorStatusViewPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
      <ViewClient />
    </Suspense>
  );
}
