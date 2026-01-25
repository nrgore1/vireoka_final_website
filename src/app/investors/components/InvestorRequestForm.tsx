"use client";

import { useState } from "react";

type Form = {
  full_name: string;
  email: string;
  role: string;
  firm: string;
  notes: string;
};

export default function InvestorRequestForm({ onDone }: { onDone?: () => void }) {
  const [form, setForm] = useState<Form>({
    full_name: "",
    email: "",
    role: "",
    firm: "",
    notes: "",
  });
  const [msg, setMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/investors/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        firm: form.firm,
        notes: form.notes || undefined,
      }),
    }).catch(() => null);

    setBusy(false);

    if (!res || !res.ok) {
      setMsg("Unable to submit request. Please check fields and try again.");
      return;
    }
    setMsg("Request submitted. We will review and follow up by email.");
    onDone?.();
  }

  return (
    <div className="mt-6 rounded-xl border p-6">
      <h2 className="text-lg font-semibold text-vireoka-indigo">Request Investor Access</h2>
      <p className="mt-2 text-sm text-vireoka-graphite">
        Provide details for review. Approved investors will be prompted to accept the NDA immediately after first login.
      </p>

      <div className="mt-5 grid gap-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email address</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Firm / Organization</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.firm}
            onChange={(e) => setForm({ ...form, firm: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Comments (optional)</label>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {busy ? "Submitting..." : "Submit request"}
          </button>
          {msg ? <p className="text-sm text-vireoka-graphite">{msg}</p> : null}
        </div>
      </div>
    </div>
  );
}
