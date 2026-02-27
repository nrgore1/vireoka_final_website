"use client";

import { useState } from "react";

export default function RequestAccessForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/investors/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, company, role, note }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setMsg("Request submitted. Please check your email for next steps.");
      setFullName("");
      setEmail("");
      setCompany("");
      setRole("");
      setNote("");
    } catch (e: any) {
      setMsg(`Error: ${String(e?.message || e)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          required
          type="email"
        />
      </div>

      <div>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company / Firm"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="Advisor">Advisor</option>
          <option value="Angel">Angel Investor</option>
          <option value="VC">VC / Fund</option>
          <option value="Partner">Partner</option>
          <option value="Contributor">Contributor</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why are you interested in Vireoka?"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
        style={{ backgroundColor: "#3F2B96", color: "#ffffff", border: "1px solid rgba(0,0,0,0.05)" }}
      >
        {submitting ? "Submitting..." : "Request access"}
      </button>

      {msg ? <p className="pt-2 text-sm text-slate-700">{msg}</p> : null}
    </form>
  );
}
