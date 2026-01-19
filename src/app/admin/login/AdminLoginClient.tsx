"use client";

import { useState } from "react";

export default function AdminLoginClient() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    }).catch(() => null);

    setLoading(false);

    if (!res) return setMsg("Network error.");

    const data = await res.json().catch(() => null);
    if (!data?.ok) return setMsg("Unauthorized.");

    window.location.href = "/admin/investors";
  }

  return (
    <div className="space-y-3">
      <label className="text-sm block">
        <div className="text-neutral-700">Password</div>
        <input
          className="mt-1 w-full rounded-md border p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </label>

      <button
        onClick={submit}
        disabled={loading}
        className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90"
        type="button"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>

      {msg ? <div className="text-sm text-red-600">{msg}</div> : null}
    </div>
  );
}
