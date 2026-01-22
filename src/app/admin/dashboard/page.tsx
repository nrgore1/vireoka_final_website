import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export default async function AdminDashboard() {
  const supabase = supabaseAdmin();

  const [{ count: pending }, { count: approved }] = await Promise.all([
    supabase
      .from("investors")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("investors")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  const { data: engagedRows } = await supabase
    .from("email_tracking_events")
    .select("email")
    .in("event", ["open", "click"]);

  const engaged = new Set(engagedRows?.map(r => r.email)).size;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Investor Funnel</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="border rounded p-6">
          <div className="text-sm text-neutral-500">Pending</div>
          <div className="text-3xl font-bold">{pending || 0}</div>
        </div>

        <div className="border rounded p-6">
          <div className="text-sm text-neutral-500">Approved</div>
          <div className="text-3xl font-bold">{approved || 0}</div>
        </div>

        <div className="border rounded p-6">
          <div className="text-sm text-neutral-500">Engaged</div>
          <div className="text-3xl font-bold">{engaged}</div>
        </div>
      </div>

      <p className="text-sm text-neutral-600">
        Engaged = at least one email open or click.
      </p>
    </div>
  );
}
