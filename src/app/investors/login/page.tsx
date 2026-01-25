export const dynamic = "force-dynamic";

export default function InvestorLoginPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-vireoka-indigo">Investor Login</h1>
      <p className="mt-3 text-sm text-vireoka-graphite">
        If you’ve been invited, use your verification link from email to sign in.
        If you don’t have access yet, request it from the Investor Access page.
      </p>

      <div className="mt-6 rounded-xl border border-vireoka-line bg-white p-6">
        <p className="text-sm text-vireoka-graphite">
          Please check your inbox for the invite / verification email.
        </p>
        <div className="mt-4">
          <a
            href="/request-access"
            className="inline-block rounded-md border border-vireoka-line px-4 py-2 text-sm text-vireoka-indigo hover:bg-vireoka-ash"
          >
            Request access
          </a>
        </div>
      </div>
    </div>
  );
}
