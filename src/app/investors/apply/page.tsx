"use client";

import { useState } from "react";
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
export default function InvestorApplyPage() {
  const [form, setForm] = useState({ email: "", name: "", org: "", role: "", intent: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit() {
    setMsg(null);
    setOk(false);

    const res = await fetch("/api/investors/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!data.ok) {
      setMsg("Please check your entries and try again.");
      return;
    }

    setOk(true);
    setMsg("Application received. Next: accept the NDA.");
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight">Investor application</h1>
      <p className="text-sm text-neutral-700">
        This form is for NDA-gated investor access. Public pages intentionally avoid confidential details.
      </p>

      <div className="grid gap-3">
        {[
          ["Email", "email"],
          ["Name", "name"],
          ["Organization", "org"],
          ["Role", "role"],
        ].map(([label, key]) => (
          <label key={key} className="text-sm">
            <div className="text-neutral-700">{label}</div>
            <input
              className="mt-1 w-full rounded-md border p-2"
              value={(form as any)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </label>
        ))}

        <label className="text-sm">
          <div className="text-neutral-700">Intent (why you want access)</div>
          <textarea
            className="mt-1 w-full rounded-md border p-2 min-h-[120px]"
            value={form.intent}
            onChange={(e) => setForm((f) => ({ ...f, intent: e.target.value }))}
          />
        </label>

        <button onClick={submit} className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90">
          Submit
        </button>

        {msg && <div className="text-sm text-neutral-700">{msg}</div>}

        {ok && (
          <div className="text-sm">
            <Link className="underline underline-offset-4" href={`/investors/nda?email=${encodeURIComponent(form.email)}`}>
              Continue to NDA →
            </Link>
          </div>
        )}

        <div className="text-sm">
          <Link className="underline underline-offset-4" href="/investors/status">
            Check status →
          </Link>
        </div>
      </div>
    </div>
  );
}
