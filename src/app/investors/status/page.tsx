"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
type StatusResp =
  | { ok: true; exists: false }
  | {
      ok: true;
      exists: true;
      investor: {
        email: string;
        status: string;
        ndaAcceptedAt: string | null;
        approvedAt: string | null;
        expiresAt: string | null;
      };
    };

export default function InvestorStatusPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<StatusResp | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user has a session cookie, try to hydrate status automatically.
    (async () => {
      const res = await fetch("/api/investors/me", { cache: "no-store" }).catch(() => null);
      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      const inv = data?.investor;
      if (!data?.ok || !inv?.email) return;
      setEmail(inv.email);
      // Now fetch full status
      await submit(inv.email);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setMsg("Unable to fetch status. Please check the email and try again.");
      return;
    }

    setResult(data);
  }

  function badge(status: string) {
    const base = "inline-flex items-center rounded-full border px-3 py-1 text-xs";
    if (status === "APPROVED") return <span className={base}>APPROVED</span>;
    if (status === "PENDING_NDA") return <span className={base}>NDA REQUIRED</span>;
    if (status === "PENDING_APPROVAL") return <span className={base}>PENDING REVIEW</span>;
    if (status === "EXPIRED") return <span className={base}>EXPIRED</span>;
    if (status === "REJECTED") return <span className={base}>NOT APPROVED</span>;
    return <span className={base}>{status}</span>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Investor access status</h1>
      <p className="text-sm text-neutral-700">
        Use the same email you applied with. If you already accepted the NDA on this device, we’ll try to load your
        status automatically.
      </p>

      <div className="rounded-lg border p-5 space-y-3">
        <label className="text-sm">
          <div className="text-neutral-700">Email</div>
          <input
            className="mt-1 w-full rounded-md border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@firm.com"
          />
        </label>

        <button
          onClick={() => submit()}
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90"
          type="button"
          disabled={loading}
        >
          {loading ? "Checking…" : "Check status"}
        </button>

        {msg ? <div className="text-sm text-neutral-700">{msg}</div> : null}
      </div>

      {result?.ok && !result.exists ? (
        <div className="rounded-lg border p-5">
          <div className="text-sm font-semibold">No application found</div>
          <p className="mt-2 text-sm text-neutral-700">
            We couldn’t find an investor application for that email.
          </p>
          <Link className="mt-3 inline-block text-sm underline underline-offset-4" href="/investors/apply">
            Start an application →
          </Link>
        </div>
      ) : null}

      {result?.ok && result.exists ? (
        <div className="rounded-lg border p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{result.investor.email}</div>
            {badge(result.investor.status)}
          </div>

          <div className="grid gap-2 text-sm text-neutral-700">
            <div>
              <span className="text-neutral-500">NDA accepted:</span>{" "}
              {result.investor.ndaAcceptedAt ? new Date(result.investor.ndaAcceptedAt).toLocaleString() : "—"}
            </div>
            <div>
              <span className="text-neutral-500">Approved:</span>{" "}
              {result.investor.approvedAt ? new Date(result.investor.approvedAt).toLocaleString() : "—"}
            </div>
            <div>
              <span className="text-neutral-500">Expires:</span>{" "}
              {result.investor.expiresAt ? new Date(result.investor.expiresAt).toLocaleString() : "—"}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {result.investor.status === "PENDING_NDA" ? (
              <Link className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50" href={`/investors/nda?email=${encodeURIComponent(result.investor.email)}`}>
                Accept NDA →
              </Link>
            ) : null}

            {result.investor.status === "APPROVED" ? (
              <Link className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90" href="/investors/portal">
                Go to portal →
              </Link>
            ) : null}

            {(result.investor.status === "PENDING_APPROVAL" || result.investor.status === "REJECTED" || result.investor.status === "EXPIRED") ? (
              <Link className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50" href="/investors">
                Back to investor access
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
