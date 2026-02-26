"use client";

import { useState } from "react";

export function RequestAccessForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const form = new FormData(e.currentTarget);

    const payload = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      role: String(form.get("role") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/investors/request-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      setMsg("Request submitted. Please check your email for next steps.");
      e.currentTarget.reset();
    } catch (err: any) {
      setMsg(`Error: ${err?.message || "Submission failed"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <input
        name="fullName"
        placeholder="Full Name"
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-2"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-2"
      />

      <input
        name="company"
        placeholder="Company / Firm"
        className="w-full rounded-lg border border-gray-300 px-4 py-2"
      />

      <select
        name="role"
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white"
      >
        <option value="">Select your role</option>
        <option value="advisor">Advisor</option>
        <option value="angel">Angel Investor</option>
        <option value="vc">VC</option>
        <option value="partner">Partner</option>
        <option value="contributor">Contributor</option>
      </select>

      <textarea
        name="message"
        placeholder="Why are you interested in Vireoka?"
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-4 py-2"
      />

      {/* 🔥 Guaranteed Visible Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="block w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Access"}
        </button>
      </div>

      {msg && (
        <div className="text-sm text-gray-700 pt-4">
          {msg}
        </div>
      )}

    </form>
  );
}
