"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vireoka_investor_ok_v1";

export default function InvestorGate() {
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setOk(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const hint = useMemo(() => {
    // A small UX hint without leaking anything sensitive
    return "Enter the investor access password.";
  }, []);

  async function verify() {
    setErr(null);
    const res = await fetch("/api/intelligence/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });

    if (!res.ok) {
      setErr("Access denied.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, "1");
    setOk(true);
    setPw("");
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setOk(false);
  }

  if (!ok) {
    return (
      <div className="vk-card p-7">
        <div className="text-sm font-semibold">Investor Access</div>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>{hint}</p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border"
            style={{
              borderColor: "var(--vk-border)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--vk-text)",
              outline: "none",
            }}
          />
          <button onClick={verify} className="vk-btn vk-btn-primary" type="button">
            Enter
          </button>
        </div>

        {err && (
          <div className="mt-3 text-sm" style={{ color: "var(--vk-danger)" }}>
            {err}
          </div>
        )}

        <p className="mt-4 text-xs" style={{ color: "var(--vk-muted)" }}>
          Note: This is a lightweight gate for early-stage sharing. Replace with signed links or SSO for production investor workflows.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="vk-card p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Investor Demo</div>
            <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
              Use this portal to view product demo materials before funding decisions.
            </p>
          </div>
          <button className="vk-btn" onClick={logout} type="button">
            Logout
          </button>
        </div>

        <hr className="vk-hr my-6" />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="vk-card p-6">
            <div className="text-sm font-semibold">Demo Video</div>
            <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
              Replace the MP4 below with your real demo capture.
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--vk-border)" }}>
              <video controls preload="metadata" style={{ width: "100%", display: "block", background: "black" }}>
                <source src="/videos/investor-demo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="vk-card p-6">
            <div className="text-sm font-semibold">Investor Pack</div>
            <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
              Place PDFs in <code>/public/intelligence</code>.
            </p>
            <div className="mt-4 grid gap-2">
              <a className="vk-btn vk-btn-primary" href="/intelligence/vireoka-pitch-deck.pdf" target="_blank" rel="noreferrer">
                Pitch Deck (PDF)
              </a>
              <a className="vk-btn" href="/docs/vireoka-whitepaper.pdf" target="_blank" rel="noreferrer">
                Whitepaper (PDF)
              </a>
              <a className="vk-btn" href="/docs/vireoka-responsible-ai-charter.pdf" target="_blank" rel="noreferrer">
                Responsible AI Charter (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="vk-card p-6">
        <div className="text-sm font-semibold">Optional: Book a Live Demo</div>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Later you can integrate Calendly, HubSpot, or your own scheduling endpoint.
        </p>
        <a className="vk-btn" href="#" onClick={(e) => e.preventDefault()}>
          Coming soon
        </a>
      </div>
    </div>
  );
}
