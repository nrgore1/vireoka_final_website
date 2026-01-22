import { createClient } from "@supabase/supabase-js";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export default async function InvestorDashboard() {
  const supabase = adminSupabase();

  const { data: investors } = await supabase
    .from("investors")
    .select("email, nda_signed, invited_at, invite_expires_at, access_expires_at, last_access")
    .order("invited_at", { ascending: false })
    .limit(50);

  const { data: logs } = await supabase
    .from("investor_access_logs")
    .select("investor_email, path, event, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="text-2xl font-semibold">Investor Activity Dashboard</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Investors</h2>
        <div className="overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">NDA</th>
                <th className="p-2 text-left">Last access</th>
                <th className="p-2 text-left">Invite exp</th>
                <th className="p-2 text-left">Access exp</th>
              </tr>
            </thead>
            <tbody>
              {(investors || []).map((i) => (
                <tr key={i.email} className="border-t">
                  <td className="p-2">{i.email}</td>
                  <td className="p-2">{i.nda_signed ? "Yes" : "No"}</td>
                  <td className="p-2">{i.last_access || "-"}</td>
                  <td className="p-2">{i.invite_expires_at || "-"}</td>
                  <td className="p-2">{i.access_expires_at || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Access Logs</h2>
        <div className="overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Event</th>
                <th className="p-2 text-left">Path</th>
              </tr>
            </thead>
            <tbody>
              {(logs || []).map((l, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{l.created_at}</td>
                  <td className="p-2">{l.investor_email}</td>
                  <td className="p-2">{l.event}</td>
                  <td className="p-2">{l.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
