import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export default async function AdminInvestorsPage() {
  const supabase = supabaseAdmin();

  const { data: investors } = await supabase
    .from("investors")
    .select("*")
    .order("invited_at", { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Investors</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th>Email</th>
            <th>Status</th>
            <th>Invited</th>
            <th>Last Access</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {investors?.map((i) => (
            <tr key={i.email} className="border-b">
              <td>{i.email}</td>
              <td>{i.status}</td>
              <td>{i.invited_at || "-"}</td>
              <td>{i.last_access || "-"}</td>
              <td className="space-x-2">
                <form action={`/api/admin/investors/approve`} method="POST">
                  <input type="hidden" name="email" value={i.email} />
                  <button className="text-green-600">Approve</button>
                </form>
                <form action={`/api/admin/investors/revoke`} method="POST">
                  <input type="hidden" name="email" value={i.email} />
                  <button className="text-red-600">Revoke</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
