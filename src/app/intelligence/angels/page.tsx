import { CTABar } from "@/components/CTABar";

export default function AngelsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
      <h1 className="text-3xl font-bold text-vireoka-indigo">For Angel Investors</h1>

      <p className="text-gray-700">
        Vireoka is building the governance control plane for digital employees. We’re not shipping generic copilots—
        we’re deploying governed agents that can execute work within defined authority and policy constraints.
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Why act now</h2>
        <p className="text-gray-700">
          As agentic AI shifts from assistance to delegation, governance becomes infrastructure. The control plane is still forming.
          Early conviction in control planes compounds.
        </p>
      </section>

      <CTABar primaryHref="/intelligence/request-access" primaryLabel="Request Access" secondaryHref="/intelligence/stablestack" secondaryLabel="See StableStack" />
    </main>
  );
}
