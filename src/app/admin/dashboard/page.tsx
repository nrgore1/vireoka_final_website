export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminDashboardPage() {
  const sb = supabaseAdmin();

  // Minimal safe render (actual data loads at runtime)
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-sm opacity-70">
        This page is rendered dynamically.
      </p>
    </div>
  );
}
