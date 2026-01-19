"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function NdaClient() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function accept() {
    if (!email) {
      setMsg("Missing email parameter.");
      return;
    }

    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/investors/nda", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      setMsg("Unable to record NDA acceptance.");
      return;
    }

    router.push("/investors/status");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Investor NDA</h1>

      <p className="text-neutral-700 text-sm">
        This content is restricted to qualified investors. By continuing, you
        agree not to disclose any non-public information.
      </p>

      <div className="rounded-lg border p-4 text-sm text-neutral-700">
        <p>
          This NDA covers confidential materials, product direction, internal
          governance systems, and technical architecture shared during the
          evaluation process.
        </p>
      </div>

      <button
        onClick={accept}
        disabled={loading}
        className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90"
      >
        {loading ? "Recording…" : "I Agree & Continue"}
      </button>

      {msg && <div className="text-sm text-red-600">{msg}</div>}
    </div>
  );
}
