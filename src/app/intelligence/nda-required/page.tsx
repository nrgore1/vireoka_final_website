import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export const metadata = {
  title: "Vireoka Intelligence — NDA Required",
  description: "Certain materials require NDA and verification before access.",
};

export default function NDARequiredPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        NDA Required
      </h1>

      <p className="mt-4 text-base leading-7 text-neutral-700">
        The material you are attempting to access is available only to verified
        collaborators under a signed Non-Disclosure Agreement (NDA).
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Request Access
        </h2>

        <p className="mt-3 text-sm leading-6 text-neutral-700">
          Please email{" "}
          <a className="underline font-semibold" href={CONTACT_MAILTO}>
            {CONTACT_EMAIL}
          </a>{" "}
          with:
        </p>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Your full name and organization</li>
          <li>Your intended role (Advisor, Angel, Partner, etc.)</li>
          <li>The specific materials you are requesting</li>
          <li>A brief description of your interest and alignment</li>
        </ul>

        <p className="mt-4 text-xs text-neutral-600">
          Access is granted at Vireoka’s discretion and may require verification.
        </p>
      </div>

      <div className="mt-8">
        <a href="/intelligence" className="text-sm font-semibold text-neutral-700 hover:underline">
          ← Back to Intelligence
        </a>
      </div>
    </main>
  );
}
