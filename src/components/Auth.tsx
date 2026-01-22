"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

export default function Auth() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function signIn() {
    const res = await fetch("/api/investors/check-approved", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      setError("This email has not been approved for investor access.");
      return;
    }

    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/investors` },
    });

    setSent(true);
  }

  if (sent) return <p>Check your email for a secure login link.</p>;

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="you@firm.com"
        className="w-full rounded border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button onClick={signIn} className="w-full bg-black text-white py-2 rounded">
        Login
      </button>
    </div>
  );
}
