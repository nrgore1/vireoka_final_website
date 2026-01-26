import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminInvestorsPage() {
  const { data } = await supabase
    .from('investor_applications')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Investor Applications</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data?.map(app => (
            <tr key={app.id} className="border-t">
              <td>{app.investor_name}</td>
              <td>{app.email}</td>
              <td>{app.status}</td>
              <td className="space-x-2">
                <form action="/api/admin/investor-applications" method="POST">
                  <input type="hidden" name="id" value={app.id} />
                  <button name="action" value="approved">Approve</button>
                  <button name="action" value="rejected">Reject</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
