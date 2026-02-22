"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NdaSignedClient() {
  const params = useSearchParams();
  const tokenFromQuery = useMemo(() => params.get("token") || "", [params]);

  const [state, setState] = useState<"saving" | "ok" | "warn">("saving");
  const [msg, setMsg] = useState<string>("Finalizing…");

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
      setState("warn");
      setMsg("Signed, but missing token to finalize. Please re-open the NDA link from your email.");
      return;
    }

    async function finalize() {
      const r = await fetch("/api/investors/nda/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          signer_name: signerName || "Investor",
          nda_version: "signwell_template",
        }),
      }).catch(() => null);

      if (!r || !r.ok) {
        setState("warn");
        setMsg("Signed successfully, but we could not record it automatically. Please contact support.");
        return;
      }

      setState("ok");
      setMsg("Thank you. Your NDA has been successfully recorded.");
    }

    finalize();
  }, [tokenFromQuery]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-semibold mb-4">NDA Signed</h1>
      <p className="text-gray-700">{msg}</p>

      <p className="mt-4 text-gray-700">
        If your account is approved, you can now proceed to the Investor Portal.
      </p>

      <a className="inline-block mt-8 underline" href="/portal/overview">
        Go to Investor Portal
      </a>

      {state === "warn" ? (
        <p className="mt-4 text-xs text-neutral-500">
          If you continue to see this message, reply to your invite email and we’ll complete activation manually.
        </p>
      ) : null}
    </main>
  );
}
