import SubmitButton from './SubmitButton';
import { submitInvestorApplication } from './actions';

export const dynamic = 'force-dynamic';

const INVESTOR_TYPES = [
  { value: 'Advisors', label: 'Advisor (Time Investor)' },
  { value: 'Contractors', label: 'Contractor (Technical Contributor)' },
  { value: 'Crowdsourcing', label: 'Crowdsourcing Investor' },
  { value: 'Angel', label: 'Angel Investor ($25k–$250k)' },
  { value: 'VC', label: 'Venture Capital (Tier-1 Lead)' },
  { value: 'Family Office', label: 'Family Office' },
  { value: 'Corporate', label: 'Corporate / Strategic' },
];

const CHECK_SIZES = [
  'Time-only / Advisory',
  '$5k–$25k',
  '$25k–$250k',
  '$250k–$1M',
  '$1M+',
  'Strategic / Non-financial',
];

const HORIZONS = ['0–3 months', '3–6 months', '6–12 months', '12+ months'];

export default function InvestorApplyPage() {
  async function action(formData: FormData) {
    'use server';
    try {
      await submitInvestorApplication(formData);
    } catch (e: any) {
      // Re-throw so Next shows it via error boundary / formState; page will show message below
      throw e;
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold mb-4">Investor Access Application</h1>

      <p className="text-gray-600 mb-8">
        Vireoka uses time-bound, tiered access and audit logging. Submit your information to request access to NDA-gated materials.
      </p>

      {/* Next will display the thrown server action error as a runtime error unless we catch it with an error boundary.
          So we keep the action simple and rely on server logs + quick schema check below. */}
      <form action={action} className="space-y-6">
        <input name="investor_name" required placeholder="Full name" className="input" />
        <input name="email" type="email" required placeholder="Email address" className="input" />
        <input name="organization" required placeholder="Organization / Firm" className="input" />
        <input name="role" required placeholder="Role / Title" className="input" />

        <select name="investor_type" required className="input">
          <option value="">Investor type</option>
          {INVESTOR_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select name="check_size" required className="input">
          <option value="">Skin in the game (check size / contribution)</option>
          {CHECK_SIZES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select name="horizon" required className="input">
          <option value="">Timeline (when do you need diligence?)</option>
          {HORIZONS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <textarea
          name="intent"
          rows={5}
          placeholder="What are you looking to evaluate? (e.g., governance moat, GTM, financial model, integration fit)"
          className="input"
        />

        <SubmitButton />
      </form>

      <p className="mt-6 text-xs text-neutral-500">
        If submission fails, check server logs for the Supabase error message (missing table/column is the most common cause).
      </p>
    </main>
  );
}
