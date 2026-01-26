'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      investor_name: formData.get('investor_name'),
      email: formData.get('email'),
      organization: formData.get('organization'),
      role: formData.get('role'),
      investor_type: formData.get('investor_type'),
      turnstileToken: formData.get('turnstileToken') || null,
    };

    const res = await fetch('/api/investor-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError('We were unable to submit your application. Please try again.');
      return;
    }

    router.push(`/investors/thank-you?ref=${json.reference_code ?? ''}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold mb-4">Investor Access Application</h1>

      <p className="text-gray-600 mb-8">
        Submit your information below to request access to Vireoka’s investor materials.
        All applications are reviewed by our internal team.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="investor_name" required placeholder="Full name" className="input" />
        <input name="email" type="email" required placeholder="Email address" className="input" />
        <input name="organization" required placeholder="Organization / Firm" className="input" />
        <input name="role" required placeholder="Role / Title" className="input" />

        <select name="investor_type" required className="input">
          <option value="">Investor type</option>
          <option value="VC">Venture Capital</option>
          <option value="Family Office">Family Office</option>
          <option value="Angel">Angel Investor</option>
          <option value="Corporate">Corporate / Strategic</option>
        </select>

        {/* Turnstile token injected client-side if enabled */}
        <input type="hidden" name="turnstileToken" />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black text-white py-3 font-medium disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </main>
  );
}
