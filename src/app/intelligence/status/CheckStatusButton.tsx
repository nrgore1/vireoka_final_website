"use client";

import { useEffect, useState } from "react";

export default function CheckStatusButton({ email }: { email: string }) {
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkEligibility() {
      setLoading(true);
      const res = await fetch("/api/intelligence/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        setEligible(Boolean(data.eligible));
      } else {
        setEligible(false);
      }
      setLoading(false);
    }

    if (email) checkEligibility();
  }, [email]);

  return (
    <button
      disabled={!eligible || loading}
      className={`px-4 py-2 rounded-md ${
        eligible
          ? "bg-blue-600 text-white"
          : "bg-gray-300 text-gray-600 cursor-not-allowed"
      }`}
      title={
        eligible
          ? "Check your investor status"
          : "Status available after NDA invitation"
      }
    >
      {loading ? "Checking…" : "Check Status"}
    </button>
  );
}
