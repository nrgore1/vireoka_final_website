import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-vireoka-indigo">Request received</h1>
      <p className="mt-3 text-neutral-700">
        Your access request is under review. Once approved, you’ll be able to accept the NDA and access role-based materials.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/intelligence/login"
          className="rounded-lg border border-vireoka-line bg-white px-4 py-2 text-sm font-semibold hover:bg-vireoka-ash"
        >
          Back to login
        </Link>
        <Link
          href="/intelligence"
          className="rounded-lg bg-vireoka-indigo px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Return to Intelligence
        </Link>
      </div>
    </main>
  );
}
