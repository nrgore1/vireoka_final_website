"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INVESTOR_TYPES = [
  { value: "Advisors", label: "Advisor (Time Investor)" },
  { value: "Contractors", label: "Contractor (Technical Contributor)" },
  { value: "Crowdsourcing", label: "Crowdsourcing Investor" },
  { value: "Angel", label: "Angel Investor" },
  { value: "VC", label: "Venture Capital (Tier-1 Lead)" },
  { value: "Family Office", label: "Family Office" },
  { value: "Corporate", label: "Corporate / Strategic" },
];

const CHECK_SIZES = [
  "Time-only / Advisory",
  "$5k–$25k",
  "$25k–$250k",
  "$250k–$1M",
  "$1M+",
  "Strategic / Non-financial",
];

const HORIZONS = ["0–3 months", "3–6 months", "6–12 months", "12+ months"];

export default function InvestorApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      investor_name: formData.get("investor_name"),
      email: formData.get("email"),
      organization: formData.get("organization"),
      role: formData.get("role"),
      investor_type: formData.get("investor_type"),

      // Added fields (safe if backend ignores them)
      check_size: formData.get("check_size"),
      horizon: formData.get("horizon"),
      intent: formData.get("intent"),
      turnstileToken: formData.get("turnstileToken") || null,
    };

    const res = await fetch("/api/investor-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError("We were unable to submit your application. Please try again.");
      return;
    }

    router.push(`/investors/thank-you?ref=${json.reference_code ?? ""}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold mb-4">Investor Access Application</h1>

      <p className="text-gray-600 mb-8">
        Vireoka uses time-bound, tiered access and audit logging. Submit your information to request access to NDA-gated materials.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="investor_name" required placeholder="Full name" className="input" />
        <input name="email" type="email" required placeholder="Email address" className="input" />
        <input name="organization" required placeholder="Organization / Firm" className="input" />
        <input name="role" required placeholder="Role / Title" className="input" />

        <select name="investor_type" required className="input">
          <option value="">Investor type</option>
          {INVESTOR_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select name="check_size" required className="input">
          <option value="">Skin in the game (check size / contribution)</option>
          {CHECK_SIZES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <select name="horizon" required className="input">
          <option value="">Timeline (when do you need diligence)</option>
          {HORIZONS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <textarea
          name="intent"
          rows={5}
          placeholder="What are you looking to evaluate? (e.g., governance moat, GTM, financial model, integration fit)"
          className="input"
        />

        <input type="hidden" name="turnstileToken" />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black text-white py-3 font-medium disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </main>
  );
}
