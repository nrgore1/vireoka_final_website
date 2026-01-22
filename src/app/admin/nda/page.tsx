"use client";

import { useState } from "react";

export default function AdminNdaPage() {
  const [adminToken, setAdminToken] = useState("");
  const [version, setVersion] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function upload() {
    setMsg(null);
    if (!file) return setMsg("Please choose a PDF file.");

    const form = new FormData();
    form.append("version", String(version));
    form.append("file", file);

    const res = await fetch("/api/admin/nda/upload", {
      method: "POST",
      headers: { "x-admin-token": adminToken },
      body: form,
    });

    const data = await res.json();
    if (!res.ok) return setMsg(`Error: ${data.error || "Unknown"}`);
    setMsg(`Uploaded NDA version ${data.version} and set active.`);
    setFile(null);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">NDA PDF Management</h1>

      <div className="space-y-3 rounded-xl border p-4">
        <label className="block text-sm font-medium">Admin Token</label>
        <input
          className="w-full rounded border px-3 py-2"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder="INVESTOR_ADMIN_TOKEN"
        />

        <label className="block text-sm font-medium">Version</label>
        <input
          type="number"
          className="w-full rounded border px-3 py-2"
          value={version}
          onChange={(e) => setVersion(Number(e.target.value))}
        />

        <label className="block text-sm font-medium">PDF File</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button className="rounded-lg bg-black px-4 py-2 text-white" onClick={upload}>
          Upload & Set Active
        </button>

        {msg && <p className="text-sm text-neutral-700">{msg}</p>}
      </div>
    </div>
  );
}
