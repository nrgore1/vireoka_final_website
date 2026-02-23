import Link from "next/link";

export const runtime = "nodejs";

export default function InvestorDesignPage() {
  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Design</h1>
      <p className="text-sm text-neutral-700">
        Design assets are available to invited investors after NDA acceptance. If you were invited, use the Portal to
        access materials.
      </p>

      <div className="rounded-lg border p-5 space-y-3">
        <div className="text-sm text-neutral-700">
          If you don’t have access yet, request access from the Investor landing page.
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/intelligence"
            className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90"
          >
            Vireoka Intelligence
          </Link>
          <Link
            href="/intelligence/portal"
            className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Open portal
          </Link>
        </div>
      </div>
    </div>
  );
}
