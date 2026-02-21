"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Visible in server logs / browser console for debugging
    console.error("Portal error:", error);
  }, [error]);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Something went wrong
      </h1>

      <p style={{ marginBottom: 12 }}>
        Please try again. If the problem continues, contact support.
      </p>

      {error?.digest ? (
        <p style={{ marginBottom: 16, opacity: 0.7 }}>
          Error reference: {error.digest}
        </p>
      ) : null}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => reset()}>Try again</button>
        <Link href="/portal/overview">Go to Overview</Link>
      </div>
    </div>
  );
}
