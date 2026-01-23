export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminInvestorsPage() {
  const sb = supabaseAdmin();

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Investors</h1>
      <p className="mt-2 text-sm opacity-70">
        Investor management is rendered dynamically.
      </p>
    </div>
  );
}
