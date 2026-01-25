"use client";

import { useEffect, useState } from "react";

export default function InvestorAcceptPage({ searchParams }: any) {
  const token = searchParams?.token || "";
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!token) {
        setError("Invalid or missing invitation link.");
        return;
      }

      const res = await fetch("/api/investors/session/from-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || "Unable to verify invitation.");
        return;
      }

      setReady(true);
    })();
  }, [token]);

  if (error) {
    return (
      <main style={{ padding: 48 }}>
        <h1>Investor Access</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!ready) {
    return (
      <main style={{ padding: 48 }}>
        <h1>Investor Access</h1>
        <p>Verifying your invitation…</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 48, maxWidth: 720 }}>
      <h1>Non-Disclosure Agreement</h1>

      <p>Please review and accept the NDA to access investor materials.</p>

      <p>
        <a href={`/api/investors/nda/pdf?token=${encodeURIComponent(token)}`} target="_blank">
          Download NDA (PDF)
        </a>
      </p>

      <NdaForm token={token} />
    </main>
  );
}

function NdaForm({ token }: { token: string }) {
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) return setError("Please enter your full legal name.");
    if (!agree) return setError("Please confirm your agreement.");

    const res = await fetch("/api/investors/nda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, signatureName: name }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || "Unable to record NDA acceptance.");
      return;
    }

    window.location.href = "/investors";
  }

  return (
    <div style={{ marginTop: 24 }}>
      <input
        placeholder="Full legal name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div style={{ marginTop: 12 }}>
        <label>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree to the NDA
        </label>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <button onClick={submit} style={{ marginTop: 16 }}>
        Accept NDA & Continue
      </button>
    </div>
  );
}
