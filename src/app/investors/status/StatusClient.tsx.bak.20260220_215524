"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StatusResp = {
  ok: boolean;
  exists: boolean;
  investor?: {
    email: string;
    status: string;
    ndaAcceptedAt?: string;
    approvedAt?: string;
    expiresAt?: string;
  };
};

export default function InvestorStatusClient() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<StatusResp | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/investors/me", { cache: "no-store" }).catch(() => null);
      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (!data?.ok || !data?.investor?.email) return;
      setEmail(data.investor.email);
      await submit(data.investor.email);
    })();
  }, []);

  async function submit(addr?: string) {
    const e = (addr ?? email).trim();
    setMsg(null);
    setResult(null);

    if (!e) {
      setMsg("Please enter the email you used for your application.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/investors/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: e }),
    }).catch(() => null);
    setLoading(false);

    if (!res) {
      setMsg("Network error. Please try again.");
      return;
    }

    const data = (await res.json().catch(() => null)) as StatusResp | null;
    if (!data?.ok) {
      setMsg("Unable to fetch status.");
      return;
    }

    setResult(data);
  }

  function badge(status: string) {
    const base = "inline-flex items-center rounded-full border px-3 py-1 text-xs";
    return <span className={base}>{status}</span>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-semibold">Investor access status</h1>

      <div className="border p-4 rounded space-y-2">
        <input
          className="w-full border p-2 rounded"
          placeholder="you@firm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={() => submit()}
          disabled={loading}
          className="bg-neutral-900 text-white px-4 py-2 rounded"
        >
          {loading ? "Checking…" : "Check status"}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </div>

      {result?.exists && result.investor && (
        <div className="border p-4 rounded space-y-2">
          <div className="flex justify-between">
            <div>{result.investor.email}</div>
            {badge(result.investor.status)}
          </div>

          {result.investor.status === "PENDING_NDA" && (
            <Link
              className="underline text-sm"
              href={`/investors/nda?email=${encodeURIComponent(result.investor.email)}`}
            >
              Accept NDA →
            </Link>
          )}

          {result.investor.status === "APPROVED" && (
            <Link className="underline text-sm" href="/investors/portal">
              Go to portal →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
