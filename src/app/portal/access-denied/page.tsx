import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="space-y-2">
        <div className="text-xs tracking-wide uppercase text-neutral-500 font-semibold">
          Vireoka • Investor Portal
        </div>
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="text-neutral-700">
          Your account doesn’t currently have access to the Investor Portal.
        </p>
      </div>

      <div className="rounded-xl border p-5 space-y-3">
        <p className="text-neutral-700">
          If you believe this is a mistake, contact support or request access from your administrator.
        </p>

        <div className="flex gap-4">
          <Link className="underline" href="/portal/overview">
            Back to Portal
          </Link>
          <Link className="underline" href="/portal/login">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
