import { supabaseServer } from "@/lib/supabase/server";
import LeadsTableClient from "./LeadsTableClient";

export default async function AdminInvestorsPage() {
  const supabase = await supabaseServer();

  const { data: leads, error } = await supabase
    .from("investor_leads")
    .select("id, kind, status, full_name, email, company, message, ip, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div>
        <h2>Investor Leads</h2>
        <pre style={{ color: "crimson" }}>{error.message}</pre>
      </div>
    );
  }

  return (
    <div>
      <h2>Investor Leads</h2>
      <LeadsTableClient leads={(leads ?? []) as any} />
    </div>
  );
}
