"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function submit() {
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    window.location.href = "/investors";
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Login</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
      />
      <button onClick={submit}>Login</button>
    </main>
  );
}
