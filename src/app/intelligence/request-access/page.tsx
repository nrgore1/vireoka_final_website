"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Role = "advisor" | "angel" | "crowd" | "partner";

const ROLE_OPTIONS: { value: Role; label: string; help: string }[] = [
  { value: "advisor", label: "Advisor", help: "Strategic, technical, governance, market, or domain guidance." },
  { value: "angel", label: "Angel Investor", help: "Early-stage investment interest and diligence access." },
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
    const em = email.trim();
    const co = company.trim();

    if (!n) return setErrorMsg("Please enter your full name.");
    if (!em) return setErrorMsg("Please enter your email address.");
    if (!isEmail(em)) return setErrorMsg("Please enter a valid email address.");
    if (!co) return setErrorMsg('Please enter your company / affiliation (you can write "Individual" if applicable).');

    setStatus("submitting");
    try {
      const res = await fetch("/api/investors/request-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: n,
          email: em,
          company: co,
          role,
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        const fallback =
          data?.message ||
          "We couldn’t submit your request. Please try again. If the problem continues, email info@vireoka.com.";
        setStatus("error");
        setErrorMsg(fallback);
        return;
      }

      setStatus("success");
      setRefCode(data?.referenceCode || null);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg("Network error. Please try again in a moment.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2 items-start">
        {/* Left: Form */}
        <section className="rounded-2xl border border-vireoka-line bg-white p-7 shadow-sm">
          <p className="text-xs font-medium tracking-wide text-vireoka-indigo/80 uppercase">
            Vireoka Intelligence
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-vireoka-graphite">
            Request access
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
            Submit your details and preferred role. If approved, we’ll email a secure verification link and guide you
            through NDA + Terms acceptance.
          </p>

          {status === "success" ? (
            <div className="mt-6 rounded-xl border border-vireoka-line bg-vireoka-ash p-5">
              <p className="text-sm font-semibold text-vireoka-graphite">Request received</p>
              <p className="mt-1 text-sm text-neutral-700">
                Please check your email for next steps.
              </p>
              {refCode ? (
                <p className="mt-3 text-xs text-neutral-600">
                  Reference code: <span className="font-mono">{refCode}</span>
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/intelligence/login"
                  className="inline-flex items-center justify-center rounded-md border border-vireoka-line px-3 py-2 text-sm text-vireoka-indigo hover:bg-white"
                >
                  Go to login →
                </Link>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setErrorMsg(null);
                    setRefCode(null);
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-vireoka-line px-3 py-2 text-sm text-vireoka-graphite hover:bg-white"
                >
                  Submit another request
                </button>
              </div>
            </div>
          ) : (
            <form className="mt-6" onSubmit={onSubmit}>
              {/* Friendly error */}
              {errorMsg ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">Please fix this</p>
                  <p className="mt-1 text-sm text-red-700">{errorMsg}</p>
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-vireoka-graphite">Full name</label>
                  <input
                    className="mt-1 w-full rounded-md border border-vireoka-line px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-vireoka-indigo/20"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-vireoka-graphite">Email</label>
                  <input
                    className="mt-1 w-full rounded-md border border-vireoka-line px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-vireoka-indigo/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-vireoka-graphite">Company / affiliation</label>
                  <input
                    className="mt-1 w-full rounded-md border border-vireoka-line px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-vireoka-indigo/20"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder='Company, or "Individual"'
                    autoComplete="organization"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-vireoka-graphite">Requested role</label>
                  <select
                    className="mt-1 w-full rounded-md border border-vireoka-line px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-vireoka-indigo/20 bg-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-neutral-600">{roleHelp}</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-vireoka-graphite">
                    Message <span className="text-xs text-neutral-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full min-h-[110px] rounded-md border border-vireoka-line px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-vireoka-indigo/20"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What are you hoping to access or collaborate on?"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting…" : "Request access"}
                </button>

                <Link
                  href="/intelligence/login"
                  className="text-sm text-vireoka-indigo underline underline-offset-4"
                >
                  Back to login
                </Link>
              </div>

              <p className="mt-4 text-xs text-neutral-500">
                By requesting access, you agree not to share confidential materials you may receive.
                For questions, email{" "}
                <a className="underline underline-offset-4" href="mailto:info@vireoka.com">
                  info@vireoka.com
                </a>
                .
              </p>
            </form>
          )}
        </section>

        {/* Right: Trust + what happens next */}
        <section className="rounded-2xl border border-vireoka-line bg-white p-7 shadow-sm">
          <h2 className="text-lg font-semibold text-vireoka-graphite">What happens next</h2>

          <div className="mt-4 space-y-4 text-sm text-neutral-700">
            <div className="rounded-xl border border-vireoka-line bg-vireoka-ash p-4">
              <p className="font-medium text-vireoka-graphite">1) Review</p>
              <p className="mt-1">We review the request and may ask for clarification.</p>
            </div>

            <div className="rounded-xl border border-vireoka-line bg-vireoka-ash p-4">
              <p className="font-medium text-vireoka-graphite">2) Email verification</p>
              <p className="mt-1">You’ll receive a secure sign-in link to confirm your email.</p>
            </div>

            <div className="rounded-xl border border-vireoka-line bg-vireoka-ash p-4">
              <p className="font-medium text-vireoka-graphite">3) NDA + Terms</p>
              <p className="mt-1">You must accept both before viewing role-specific confidential content.</p>
            </div>

            <div className="rounded-xl border border-vireoka-line bg-vireoka-ash p-4">
              <p className="font-medium text-vireoka-graphite">4) Role-based portal</p>
              <p className="mt-1">Access is granted based on your approved role and access level.</p>
            </div>
          </div>

          <div className="mt-6 text-xs text-neutral-500">
            We don’t expose internal implementation details here. Access controls are enforced at the portal boundary.
          </div>
        </section>
      </div>
    </main>
  );
}
