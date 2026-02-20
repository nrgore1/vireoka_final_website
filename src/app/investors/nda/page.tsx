export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ token?: string }>;

async function validateToken(token: string) {
  const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
  const res = await fetch(`${origin}/api/investors/nda/validate?token=${encodeURIComponent(token)}`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function NdaPage({ searchParams }: { searchParams: SearchParams }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold">NDA Link</h1>
        <p className="mt-4 text-gray-700">Missing NDA token.</p>
      </main>
    );
  }

  const result = await validateToken(token);

  if (!result?.ok) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold">NDA Link</h1>
        <p className="mt-4 text-gray-700">{result?.error || 'Invalid link.'}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold mb-4">Vireoka Non-Disclosure Agreement</h1>

      <div className="rounded-md border p-5 text-sm text-gray-800 leading-6 space-y-3">
        <p><strong>Confidentiality.</strong> You agree to keep all non-public information shared by Vireoka confidential.</p>
        <p><strong>Purpose.</strong> Information is provided solely for evaluating a potential investment relationship.</p>
        <p><strong>No Distribution.</strong> You may not disclose, copy, or distribute confidential materials to third parties.</p>
        <p><strong>Term.</strong> Confidentiality obligations continue after access is granted.</p>
        <p className="text-gray-600">This is a simplified NDA display. Replace with your final legal text (PDF/embed) as needed.</p>
      </div>

      <form
        className="mt-8 space-y-4"
        action="/api/investors/nda/sign"
        method="POST"
      >
        <input type="hidden" name="token" value={token} />
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input name="signer_name" className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="signer_email" type="email" className="w-full border rounded px-3 py-2" required />
        </div>

        <p className="text-xs text-gray-600">
          By signing, you consent to electronic signature capture including timestamp, IP address, and user-agent.
        </p>

        <button className="rounded bg-black text-white px-4 py-2">
          Sign NDA
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        After signing, you can log in and access the Investor Portal.
      </p>
    </main>
  );
}
