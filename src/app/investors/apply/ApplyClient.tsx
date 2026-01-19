"use client";

import { useState } from "react";
import Link from "next/link";

export default function InvestorApplyClient() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    org: "",
    role: "",
    intent: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit() {
    setMsg(null);
    setOk(false);

    const res = await fetch("/api/investors/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => null);

    if (!res || !res.ok) {
      setMsg("Unable to submit application.");
      return;
    }

    setOk(true);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Investor Application</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <button
        onClick={submit}
        className="bg-neutral-900 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {msg && <p className="text-sm">{msg}</p>}
      {ok && (
        <Link className="underline text-sm" href="/investors/status">
          Check status →
        </Link>
      )}
    </div>
  );
}
