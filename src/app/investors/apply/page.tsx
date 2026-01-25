import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Access Request | Vireoka",
};

export default function InvestorApplyPage() {
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-vireoka-indigo mb-6">
        Request Investor Access
      </h1>

      <p className="mb-8 text-slate-600">
        Request access to Vireoka’s investor materials. Approved investors will
        be invited to review materials under NDA.
      </p>

      <form
        method="POST"
        action="/api/investors/apply"
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Full name
          </label>
          <input
            name="name"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email address
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Firm / Organization
          </label>
          <input
            name="organization"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* ✅ SUBMIT BUTTON (missing before) */}
        <div className="pt-4">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-vireoka-indigo
                       px-5 py-2.5 text-sm font-medium text-white
                       hover:bg-vireoka-indigo/90"
          >
            Request access
          </button>
        </div>
      </form>
    </section>
  );
}
