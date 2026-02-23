export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Access expired</h1>
      <p className="text-neutral-700">
        Your investor portal access window has expired. You can request an extension from the status page.
      </p>

      <div className="flex gap-3">
        <a className="underline" href="/portal/request-extension">Request extension</a>
        <a className="underline" href="/intelligence/status">Check status</a>
      </div>

      <p className="text-xs text-neutral-500">
        Access is time-bound by design to protect confidential materials.
      </p>
    </main>
  );
}
