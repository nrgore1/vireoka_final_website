"use client";

import { useState } from "react";

const INVESTOR_TYPES = [
  { value: "VC", label: "Venture Capital" },
  { value: "Angel", label: "Angel Investor" },
  { value: "Family Office", label: "Family Office" },
  { value: "Corporate", label: "Corporate / Strategic" },
  { value: "PE", label: "Private Equity" },
  { value: "Other", label: "Other" },
];

export default function InvestorRequestForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    setReferenceCode(null);
    setLoading(true);

    try {
      const res = await fetch("/api/investors/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          company,
          investor_type: investorType,
          message,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || (await res.text()));

      setOk(true);
      setReferenceCode(data.referenceCode || data.reference_code || null);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <div className="rounded-lg border border-vireoka-line bg-white p-6">
        <h3 className="text-lg font-semibold">Thank you for your interest in Vireoka</h3>
        <p className="mt-2 text-sm text-neutral-700">
          Your investor access request has been successfully submitted. Our team will review it shortly.
        </p>
        {referenceCode ? (
          <p className="mt-3 text-sm">
            <span className="font-medium">Reference code:</span> {referenceCode}
          </p>
        ) : null}
        <p className="mt-4 text-sm text-neutral-700">
          Questions? Contact us at <a className="underline" href="mailto:info@vireoka.com">info@vireoka.com</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {err ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div> : null}

      <div className="grid gap-1">
        <label className="text-sm font-medium">Full name</label>
        <input className="rounded-md border px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Email</label>
        <input className="rounded-md border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Company</label>
        <input className="rounded-md border px-3 py-2" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Investor type</label>
        <select
          className="rounded-md border px-3 py-2"
          value={investorType}
          onChange={(e) => setInvestorType(e.target.value)}
          required
        >
          <option value="">Select…</option>
          {INVESTOR_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Message</label>
        <textarea className="rounded-md border px-3 py-2" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-vireoka-indigo px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Request access"}
      </button>
    </form>
  );
}
