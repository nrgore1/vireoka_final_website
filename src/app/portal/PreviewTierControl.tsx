"use client";

import { useEffect, useState } from "react";

const TIERS = [
  { value: "", label: "Live (no preview)" },
  { value: "crowd", label: "Crowd (Public-Private)" },
  { value: "advisor", label: "Advisor" },
  { value: "contractor", label: "Contractor" },
  { value: "angel", label: "Angel" },
  { value: "corporate", label: "Corporate / Strategic" },
  { value: "family", label: "Family Office" },
  { value: "vc", label: "VC (Full Due Diligence)" },
];

export default function PreviewTierControl(props: { initial?: string | null }) {
  const [tier, setTier] = useState(props.initial || "");

  useEffect(() => {
    setTier(props.initial || "");
  }, [props.initial]);

  async function save(next: string) {
    setTier(next);
    await fetch("/api/portal/admin/preview-tier", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tier: next }),
    }).catch(() => null);

    // reload to apply server-side tier gates everywhere
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-neutral-500">Admin preview:</span>
      <select
        className="border rounded-md px-2 py-1 bg-white"
        value={tier}
        onChange={(e) => save(e.target.value)}
      >
        {TIERS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
