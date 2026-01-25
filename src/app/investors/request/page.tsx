"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function InvestorAccessPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim().toLowerCase(),
      role: String(form.get("role") || "").trim(),
      firm: String(form.get("firm") || "").trim(),
    };

    if (!payload.name || !payload.email) {
      setError("Full name and email are required.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/investors/request-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || "Unable to submit request.");
      return;
    }

    setSubmitted(true);
    scrollToForm();
  }

  return (
    <main className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-slate-900">
          Investor access <span className="font-normal">(NDA required)</span>
        </h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          We share detailed technical and financial materials with verified investors under NDA.
        </p>
        <p className="mt-2 max-w-3xl text-slate-600">
          Access is time-bound and reviewed manually to protect confidential IP.
        </p>

        {/* Access steps */}
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-medium text-slate-900">Access steps</h2>

          <ol className="mt-4 space-y-2 text-slate-700">
            <li>1. Apply with your investor details</li>
            <li>2. Review and accept the NDA</li>
            <li>3. Await approval (manual review)</li>
            <li>4. Access granted (time-bound)</li>
          </ol>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={scrollToForm}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Apply
            </button>

            <button
              onClick={() => router.push("/investors/pending")}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Check status
            </button>

            <button
              onClick={() => router.push("/investors")}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Investor portal
            </button>
          </div>
        </section>

        {/* Apply card */}
        <section
          ref={formRef}
          className="mt-8 rounded-lg border border-slate-200 bg-white p-6"
        >
          {!submitted ? (
            <>
              <h2 className="text-lg font-medium text-slate-900">
                Apply for investor access
              </h2>

              <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm text-slate-700">Full name</label>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700">Role</label>
                  <input
                    name="role"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700">Firm</label>
                  <input
                    name="firm"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading ? "Submitting…" : "Request access"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium text-slate-900">Thank you</h2>
              <p className="mt-4 text-slate-700">
                Thank you for your interest in <strong>Vireoka</strong>.
              </p>
              <p className="mt-2 text-slate-700">
                Your request has been received and is currently under review by our team.
              </p>
              <p className="mt-2 text-slate-700">
                If approved, you will receive an email with instructions to review and
                accept the Non-Disclosure Agreement.
              </p>
              <p className="mt-4 text-slate-700">
                — <strong>The Vireoka Team</strong>
              </p>
            </>
          )}
        </section>

        {/* Why NDA */}
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-medium text-slate-900">
            Why NDA gating exists
          </h2>
          <p className="mt-3 text-slate-700">
            Our public material is intentionally high-level. The NDA portal contains
            deeper technical documentation and demonstrations intended only for
            qualified investors.
          </p>
        </section>
      </div>
    </main>
  );
}
