"use client";

import { useState } from "react";

export default function RequestAccessPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessId(null);

    try {
      const res = await fetch("/api/investors/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // 🔒 CRITICAL FIX — DO NOT PROCEED IF API FAILED
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      if (!data?.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setSuccessId(data.referenceCode || data.id);
      setForm({
        fullName: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (err: any) {
      console.error("Request access failed:", err);
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (successId) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto" }}>
        <h2>Thank you for your interest in Vireoka</h2>
        <p>
          Your investor access request has been successfully submitted.
        </p>
        <p>
          <strong>Reference code:</strong> {successId}
        </p>
        <p>
          What happens next?
        </p>
        <ul>
          <li>Internal review</li>
          <li>NDA review</li>
          <li>Strategic access activation</li>
        </ul>
        <p>
          Questions? Contact us at info@vireoka.com
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Investor Access Request</h2>

      {error && (
        <div style={{ color: "crimson", marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button disabled={loading} type="submit">
          {loading ? "Submitting..." : "Request Access"}
        </button>
      </form>
    </div>
  );
}
