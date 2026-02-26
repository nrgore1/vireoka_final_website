import Link from "next/link";
import { RequestAccessForm } from "./requestAccessForm";

export default function RequestAccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-vireoka-indigo">Request Portal Access</h1>
        <p className="text-gray-700">
          The Vireoka Intelligence Portal is gated. Submit a request and, once approved, your access will work automatically
          via an httpOnly session cookie—no ModHeader or manual headers required.
        </p>
      </header>

      {/* What to expect (NDA + approval) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">What happens after you submit</h2>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>
            <strong>We review your request.</strong> You may be asked for a quick follow-up to confirm role, firm, or fit.
          </li>
          <li>
            <strong>NDA (if required).</strong> Some portal materials require an NDA before access is granted.
            If needed, you’ll receive an NDA link by email.
          </li>
          <li>
            <strong>Approval + portal access.</strong> Once approved (and NDA accepted when applicable),
            the server sets an <strong>httpOnly</strong> session cookie for your browser.
          </li>
          <li>
            <strong>No manual setup.</strong> You can return to{" "}
            <Link href="/intelligence/portal" className="font-semibold text-vireoka-indigo hover:underline">
              /intelligence/portal
            </Link>{" "}
            and access will work automatically.
          </li>
        </ol>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Note:</strong> Approval times can vary. If you don’t see an email, check spam/junk folders.
          You can also re-submit with a brief note about what you’re evaluating.
        </div>
      </section>

      {/* Form */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <RequestAccessForm />
      </section>

      <div className="text-sm text-gray-600">
        Already approved? Visit{" "}
        <Link href="/intelligence/portal" className="font-semibold text-vireoka-indigo hover:underline">
          /intelligence/portal
        </Link>
        .
      </div>
    </main>
  );
}
