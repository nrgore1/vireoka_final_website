export const dynamic = "force-dynamic";

export default function Page(props: any) {
  const step = String(props?.searchParams?.step || "");

  const title =
    step === "nda" ? "NDA required" :
    step === "activation" ? "Access activation pending" :
    "Portal not yet available";

  const message =
    step === "nda"
      ? "To access the investor portal, please review and accept the NDA using your secure link."
      : step === "activation"
      ? "Your NDA is complete. An admin must activate your portal access window. You’ll receive an email when access is enabled."
      : "Your portal access is not active yet.";

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-neutral-700">{message}</p>

      <div className="flex gap-3">
        <a className="underline" href="/investors/status">Check status</a>
        <a className="underline" href="/">Back to site</a>
      </div>

      <p className="text-xs text-neutral-500">
        Access is invite-only, time-bound, and activity is logged.
      </p>
    </main>
  );
}
