"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NdaSignedPage() {
  const params = useSearchParams();
  const tokenFromQuery = useMemo(() => params.get("token") || "", [params]);

  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let token = tokenFromQuery;

    try {
      if (!token) token = sessionStorage.getItem("vireoka_nda_token") || "";
    } catch {}

    let signerName = "";
    try {
      signerName = sessionStorage.getItem("vireoka_signer_name") || "";
    } catch {}

    if (!token) {
      setStatus("err");
      setMsg("Missing token. If you just signed, please use the original email link again.");
      return;
    }

    // Best-effort record; do not block the user if it fails.
    async function record() {
      setStatus("saving");
      setMsg(null);

      const r = await fetch("/api/investors/nda/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          signer_name: signerName || "Investor",
          nda_version: `signwell_template:${process.env.NEXT_PUBLIC_SIGNWELL_TEMPLATE_ID || "v1"}`,
        }),
      }).catch(() => null);

      if (!r || !r.ok) {
        setStatus("err");
        setMsg("Signed successfully, but we could not record it automatically. Please contact support.");
        return;
      }

      setStatus("ok");
    }

    record();
  }, [tokenFromQuery]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-semibold mb-4">NDA Signed</h1>

      {status === "saving" ? (
        <p className="text-gray-700">Finalizing…</p>
      ) : status === "ok" ? (
        <p className="text-gray-700">Thank you. Your NDA has been successfully recorded.</p>
      ) : status === "err" ? (
        <p className="text-gray-700">{msg || "Signed successfully."}</p>
      ) : (
        <p className="text-gray-700">Signed successfully.</p>
      )}

      <p className="mt-4 text-gray-700">
        If your account is approved, you can now proceed to the Investor Portal.
      </p>

      <a className="inline-block mt-8 underline" href="/portal/overview">
        Go to Investor Portal
      </a>
    </main>
  );
}
