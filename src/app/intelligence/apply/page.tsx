import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export const metadata = {
  title: "Vireoka Intelligence — Apply / Contact",
  description: "Request access or propose collaboration inside Vireoka Intelligence.",
};

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Apply / Contact
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Tell us who you are, what role fits you best, and what you want to contribute or evaluate.
          We’ll respond with the right next steps (and NDA when appropriate).
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">What to include</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Your intended role: Advisor / Angel / Contributor / Partner</li>
          <li>Your background and domain focus</li>
          <li>What you want to validate or help shape</li>
          <li>Any constraints (timing, confidentiality, conflict considerations)</li>
        </ul>

        <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="text-sm font-semibold text-neutral-900">Email</div>
          <p className="mt-1 text-sm text-neutral-700">
            Send your note to{" "}
            <a className="font-semibold underline" href={CONTACT_MAILTO}>
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-2 text-xs text-neutral-600">
            If you’re requesting NDA materials, mention it explicitly so we can route you correctly.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/access">
          Learn about access tiers →
        </a>
      </section>
    </main>
  );
}
