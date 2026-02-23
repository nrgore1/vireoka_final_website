"use client";

import { useState } from "react";

export default function InvestorStatusClient() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function checkByCode() {
    setErr(null);
    setMsg(null);
    setRes(null);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("code", code.trim());

      const r = await fetch(`/api/intelligence/application-status?${params.toString()}`, { cache: "no-store" });
      const j = await r.json().catch(() => null);

      if (!r.ok || !j?.ok) setErr(j?.error ?? "Unable to check status.");
      else setRes(j);
    } catch (e: any) {
      setErr(e?.message ?? "Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function requestEmailLink() {
    setErr(null);
    setRes(null);
    setMsg(null);
    setLoading(true);

    try {
      const r = await fetch("/api/intelligence/status/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const j = await r.json().catch(() => null);
      setMsg(j?.message ?? "If we have an application associated with that email, we sent a secure status link.");
    } catch (e: any) {
      setMsg("If we have an application associated with that email, we sent a secure status link.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    if (code.trim()) return checkByCode();
    if (email.trim()) return requestEmailLink();
    setErr("Enter your email (to receive a secure link) or your reference code.");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-3xl font-semibold">Check your application status</h1>
      <p className="mt-3 text-sm text-gray-600">
        Use your reference code (preferred) or request a secure one-time link via email.
      </p>

      <div className="mt-8 grid gap-4 rounded-xl border p-5">
        <label className="text-sm">
          <div className="text-gray-600">Reference code</div>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 322cb3ae-5461-4f76-a4ea-268c24b61e63"
          />
        </label>

        <div className="text-center text-xs text-gray-500">— or —</div>

        <label className="text-sm">
          <div className="text-gray-600">Email (we’ll send a secure link)</div>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            type="email"
          />
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Working..." : "Continue"}
        </button>

        {err ? (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
            {err}
          </div>
        ) : null}

        {msg ? (
          <div className="rounded-md border bg-white px-4 py-3 text-sm">
            {msg}
          </div>
        ) : null}

        {res ? (
          <div className="rounded-md border bg-white px-4 py-3 text-sm">
            {!res.found ? (
              <div>No application found for that reference code.</div>
            ) : (
              <>
                <div className="font-medium">Status: {res.application?.status ?? "unknown"}</div>
                <div className="mt-2 text-gray-700">
                  <div>Email: {res.application?.email}</div>
                  <div>Reference code: {res.application?.reference_code}</div>
                  <div>Organization: {res.application?.organization ?? "-"}</div>
                </div>
                <div className="mt-3 rounded-md bg-gray-50 px-3 py-2">
                  <div className="font-medium">Next step</div>
                  <div className="text-gray-700">{res.next_step}</div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
