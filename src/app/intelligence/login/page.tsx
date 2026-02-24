import Link from "next/link";

export default function IntelligenceLoginPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2 items-start">
        {/* Left: Title + value */}
        <section className="rounded-2xl border border-vireoka-line bg-white p-7 shadow-sm">
          <p className="text-xs font-medium tracking-wide text-vireoka-indigo/80 uppercase">
            Vireoka Intelligence
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-vireoka-graphite">
            Vireoka Intelligence Login
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
            Access is available to approved participants after NDA + Terms acceptance. If you
            already have an invite, use the verification link from your email to complete sign-in.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-vireoka-line bg-vireoka-ash p-4">
              <p className="text-sm font-medium text-vireoka-graphite">What you’ll get</p>
              <ul className="mt-2 text-sm text-neutral-700 space-y-1">
                <li>• Role-based confidential portal</li>
                <li>• Updates, briefs, and private material</li>
                <li>• Secure access controls</li>
              </ul>
            </div>

            <div className="rounded-xl border border-vireoka-line bg-vireoka-ash p-4">
              <p className="text-sm font-medium text-vireoka-graphite">Need access?</p>
              <p className="mt-2 text-sm text-neutral-700">
                Submit a request. We’ll review and email your next steps.
              </p>
              <Link
                href="/intelligence/request-access"
                className="mt-3 inline-flex items-center justify-center rounded-md border border-vireoka-line px-3 py-2 text-sm text-vireoka-indigo hover:bg-white"
              >
                Request access →
              </Link>
            </div>
          </div>

          <div className="mt-6 text-xs text-neutral-500">
            Questions? Email{" "}
            <a className="underline underline-offset-4" href="mailto:info@vireoka.com">
              info@vireoka.com
            </a>
          </div>
        </section>

        {/* Right: “How it works” */}
        <section className="rounded-2xl border border-vireoka-line bg-white p-7 shadow-sm">
          <h2 className="text-lg font-semibold text-vireoka-graphite">How access works</h2>

          <ol className="mt-4 space-y-4 text-sm text-neutral-700">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-vireoka-line bg-vireoka-ash text-xs font-semibold text-vireoka-indigo">
                1
              </span>
              <div>
                <p className="font-medium text-vireoka-graphite">Request access</p>
                <p className="mt-1">
                  Tell us your role (Advisor / Angel / Crowd / Partner) and what you’re looking for.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-vireoka-line bg-vireoka-ash text-xs font-semibold text-vireoka-indigo">
                2
              </span>
              <div>
                <p className="font-medium text-vireoka-graphite">Review + invite</p>
                <p className="mt-1">
                  We’ll email a verification link to complete sign-in.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-vireoka-line bg-vireoka-ash text-xs font-semibold text-vireoka-indigo">
                3
              </span>
              <div>
                <p className="font-medium text-vireoka-graphite">NDA + Terms acceptance</p>
                <p className="mt-1">
                  You’ll be guided to accept NDA and Terms before viewing confidential materials.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-vireoka-line bg-vireoka-ash text-xs font-semibold text-vireoka-indigo">
                4
              </span>
              <div>
                <p className="font-medium text-vireoka-graphite">Role-based portal</p>
                <p className="mt-1">
                  Content is available based on your approved role and access level.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-6 rounded-xl border border-vireoka-line bg-vireoka-ash p-4">
            <p className="text-sm font-medium text-vireoka-graphite">Already invited?</p>
            <p className="mt-1 text-sm text-neutral-700">
              Use the link in your email. If it expired, request access again and we’ll resend.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
