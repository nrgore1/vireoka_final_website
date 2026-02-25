"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Role = "advisor" | "angel" | "crowd" | "partner" | "vc";

const ROLE_OPTIONS: { value: Role; label: string; help: string }[] = [
  { value: "advisor", label: "Advisor", help: "Strategic, technical, governance, market, or domain guidance." },
  { value: "angel", label: "Angel Investor", help: "Early-stage investment interest and diligence access." },
  { value: "vc", label: "Venture Capitalist", help: "VC diligence access and partner evaluation for follow-on opportunities." },
  { value: "crowd", label: "Crowd Contributor", help: "Feedback, pilots, research participation, or community programs." },
  { value: "partner", label: "Partner", help: "Platform, integration, channel, or ecosystem collaboration." },
];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function RequestAccessPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<Role>("advisor");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refCode, setRefCode] = useState<string | null>(null);

  const roleHelp = useMemo(() => {
    return ROLE_OPTIONS.find((r) => r.value === role)?.help || "";
  }, [role]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setRefCode(null);

    const n = fullName.trim();
    const em = email.trim().toLowerCase();
    const c = company.trim();
    const msg = message.trim();

    if (!n) return setErrorMsg("Please enter your full name.");
    if (!em || !isEmail(em)) return setErrorMsg("Please enter a valid email address.");
    if (!c) return setErrorMsg("Please enter your company (use “Individual” if not applicable).");

    setStatus("submitting");

    try {
      const res = await fetch("/api/investors/request-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: n,
          email: em,
          company: c,
          role,
          message: msg || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const serverMsg =
          data?.message ||
          "We couldn’t submit your request. Please try again, and contact us if it continues.";
        setErrorMsg(serverMsg);
        setStatus("error");
        return;
      }

      setRefCode(data.referenceCode || null);
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
          Request access
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl">
          Access to Vireoka Intelligence is NDA-gated. Submit a request and we’ll follow up quickly.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Form */}
        <section className="lg:col-span-7">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              {status === "success" ? (
                <div>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-sm font-medium text-neutral-900">Request received</p>
                    <p className="mt-1 text-sm text-neutral-700">
                      Thanks — we’ll email you soon with next steps.
                    </p>
                    {refCode ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        Reference code: <span className="font-mono">{refCode}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      href="/intelligence/login"
                    >
                      Back to login
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setErrorMsg(null);
                        setRefCode(null);
                      }}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                    >
                      Submit another request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Role selector */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      I’m requesting access as
                    </label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ROLE_OPTIONS.map((opt) => {
                        const active = opt.value === role;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setRole(opt.value)}
                            className={[
                              "text-left rounded-xl border p-4 transition shadow-sm",
                              active
                                ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-600/10"
                                : "border-neutral-200 bg-white hover:bg-neutral-50",
                            ].join(" ")}
                          >
                            <div className="text-sm font-semibold text-neutral-900">{opt.label}</div>
                            <div className="mt-1 text-xs text-neutral-600">{opt.help}</div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-neutral-600">{roleHelp}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">Full name</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                        placeholder="Jane Doe"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">Email</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Company</label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                      placeholder='Company name (or “Individual”)'
                      autoComplete="organization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Message (optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                      placeholder="What are you hoping to review or discuss?"
                    />
                  </div>

                  {errorMsg ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      {errorMsg}
                    </div>
                  ) : null}

                  {/* Submit row (always visible) */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 pb-2">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className={[
                        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow",
                        "bg-indigo-600 text-white hover:bg-indigo-700",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                        status === "submitting" ? "opacity-70 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {status === "submitting" ? "Submitting…" : "Request access"}
                    </button>

                    <Link className="text-sm text-neutral-700 hover:text-neutral-900" href="/intelligence/login">
                      Back to login
                    </Link>
                  </div>

                  <p className="pt-2 text-xs text-neutral-500">
                    By requesting access, you agree not to share confidential materials you may receive.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Right: How access works (kept on right) */}
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <h2 className="text-sm font-semibold text-neutral-900">How access works</h2>
            <ol className="mt-3 space-y-3 text-sm text-neutral-700">
              <li>
                <span className="font-medium text-neutral-900">1) Request</span> — Submit the form with your role.
              </li>
              <li>
                <span className="font-medium text-neutral-900">2) Review</span> — We confirm fit and share next steps.
              </li>
              <li>
                <span className="font-medium text-neutral-900">3) NDA</span> — Approved users complete the NDA workflow.
              </li>
              <li>
                <span className="font-medium text-neutral-900">4) Portal</span> — Access is granted to role-based materials.
              </li>
            </ol>

            <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-semibold text-neutral-900">Tip</p>
              <p className="mt-1 text-xs text-neutral-600">
                If you don’t have a company, enter “Individual.” If you re-submit with the same email, we’ll update your
                details.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
