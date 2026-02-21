import { Suspense } from "react";
import RespondClient from "./respondClient";

// This page depends on URL search params (token) and should render via CSR bailout safely.
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-sm text-neutral-700">Loading…</div>}>
        <RespondClient />
      </Suspense>
    </main>
  );
}
