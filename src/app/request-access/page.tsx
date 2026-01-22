"use client";

import { useState } from "react";

export default function RequestAccessPage() {
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/investors/request-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firm, message }),
    });

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md py-24 space-y-6">
      <h1 className="text-2xl font-semibold">Request Investor Access</h1>

      {status === "success" ? (
        <p className="text-green-700 space-y-2">
          <strong>Thank you for your interest in Vireoka.</strong><br />
          Your access request has been received and is currently under review.
          <br />
          We’ll follow up with you once a decision has been made.
        </p>

      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="you@firm.com"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Firm / Organization"
            className="w-full border rounded p-2"
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
          />

          <textarea
            placeholder="Optional message"
            className="w-full border rounded p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-black text-white py-2 rounded"
          >
            {status === "loading" ? "Submitting…" : "Request Access"}
          </button>

          {status === "error" && (
            <p className="text-red-600 text-sm">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      )}

      <p className="text-sm text-neutral-500">
        Already invited? <a href="/login" className="underline">Log in</a>
      </p>
    </div>
  );
}
