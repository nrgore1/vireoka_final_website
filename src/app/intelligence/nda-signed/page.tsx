import { Suspense } from "react";
import NdaSignedClient from "./NdaSignedClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl px-6 py-20">Loading…</main>}>
      <NdaSignedClient />
    </Suspense>
  );
}
