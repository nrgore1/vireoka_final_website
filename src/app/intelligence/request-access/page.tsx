"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Role = "advisor" | "angel" | "crowd" | "partner" | "vc";

const ROLE_OPTIONS: { value: Role; label: string; help: string }[] = [
  { value: "advisor", label: "Advisor", help: "Strategic, technical, governance, market, or domain guidance." },
  { value: "angel", label: "Angel Investor", help: "Early-stage investment interest and diligence access." },
  { value: "vc", label: "Venture Capital", help: "Institutional diligence, governance posture, and strategic review." },
  { value: "crowd", label: "Crowd Contributor", help: "Feedback, pilots, research participation, or community programs." },
  { value: "partner", label: "Partner", help: "Platform, integration, channel, or ecosystem collaboration." },
];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function friendlyFieldError(label: string) {
  return `Please enter a valid ${label}.`;
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

  const roleHelp = useMemo(() => ROLE_OPTIONS.find((r) => r.value === role)?.help || "", [role]);

  const canSubmit = useMemo(() => {
    const n = fullName.trim();
    const em = email.trim();
    const c = company.trim();
    return n.length >= 2 && isEmail(em) && c.length >= 2 && status !== "submitting";
  }, [fullName, email, company, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setRefCode(null);

    const n = fullName.trim();
    const em = email.trim().toLowerCase();
    const c = company.trim();
    const msg = message.trim();

    if (n.length < 2) return setErrorMsg(friendlyFieldError("full name"));
    if (!isEmail(em)) return setErrorMsg(friendlyFieldError("email address"));
    if (c.length < 2) return setErrorMsg(friendlyFieldError("company / affiliation"));

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
        setStatus("error");
        setErrorMsg(
          data?.message ||
            "We couldn’t submit your request right now. Please try again in a moment, or contact info@vireoka.com."
        );
        return;
      }

      setStatus("success");
      setRefCode(data.referenceCode || null);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-6">
        <p className="text-sm text-neutral-600">
          <Link className="underline underline-offset-4" href="/intelligence/login">
            Back to login
          </Link>
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
          Request access to Vireoka Intelligence
        </h1>
        <p className="mt-2 text-neutral-700 max-w-2xl">
          Submit a request and we’ll review it. If approved, you’ll be able to sign the NDA and access role-specific
          materials.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <section className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <form onSubmit={onSubmit} className="p-6 sm:p-8">
            {status === "success" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-medium text-emerald-900">Request received.</p>
                <p className="mt-1 text-sm text-emerald-900/80">We’ll follow up via email. You can close this page.</p>
                {refCode ? (
                  <p className="mt-3 text-xs text-emerald-900/70">
                    Reference: <span className="font-mono">{refCode}</span>
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/intelligence/login"
                    className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                  >
                    Back to login
                  </Link>
                  <Link
                    href="/intelligence"
                    className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                  >
                    Return to Intelligence
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {errorMsg ? (
                  <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm font-medium text-rose-900">Please fix the issue below</p>
                    <p className="mt-1 text-sm text-rose-900/80">{errorMsg}</p>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="text-sm font-medium text-neutral-800">Full name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-sm font-medium text-neutral-800">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                      placeholder="you@company.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-neutral-800">Company / affiliation</label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                      placeholder="Organization or “Individual”"
                      autoComplete="organization"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-neutral-800">Requested role</label>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {ROLE_OPTIONS.map((opt) => {
                        const active = role === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setRole(opt.value)}
                            className={[
                              "text-left rounded-xl border px-4 py-3 transition",
                              active ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:bg-neutral-50",
                            ].join(" ")}
                          >
                            <p className="text-sm font-semibold text-neutral-900">{opt.label}</p>
                            <p className="mt-1 text-xs text-neutral-600">{opt.help}</p>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">{roleHelp}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-neutral-800">Message (optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1 w-full min-h-[110px] rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                      placeholder="What are you looking to review or explore?"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-neutral-500">
                    By requesting access, you agree not to share confidential materials you may receive.
                  </p>

                  {/* Submit button: always visible */}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={[
                      "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold",
                      "bg-neutral-900 text-white hover:bg-neutral-800",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "shadow-sm",
                    ].join(" ")}
                  >
                    {status === "submitting" ? "Submitting…" : "Request access"}
                  </button>
                </div>
              </>
            )}
          </form>
        </section>

        <aside className="lg:col-span-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-neutral-900">How access works</h2>
          <ol className="mt-3 space-y-3 text-sm text-neutral-700">
            <li><span className="font-semibold">1) Request</span> — submit your details and intended role.</li>
            <li><span className="font-semibold">2) Review</span> — we confirm fit and set the appropriate access level.</li>
            <li><span className="font-semibold">3) NDA</span> — approved users can sign the NDA and accept terms.</li>
            <li><span className="font-semibold">4) Portal</span> — role-based materials unlock based on approval + NDA.</li>
          </ol>
        </aside>
      </div>
    </main>
  );
}
