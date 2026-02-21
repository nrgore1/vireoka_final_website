import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";

type InvestorRow = {
  email: string;
  full_name?: string | null;
  company?: string | null;
  organization?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function getOrigin(h: Headers) {
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export default async function AdminInvestorsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();
  const hdrs = await headers();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect("/admin/login?next=/admin/investors");

  const origin = getOrigin(hdrs);

  const res = await fetch(`${origin}/api/admin/investors`, {
    cache: "no-store",
    headers: {
      cookie: cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; "),
    },
  });

  const json = await res.json().catch(() => null);
  const investors: InvestorRow[] = json?.ok ? json.investors : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Investors</h1>
        <Link className="text-sm underline" href="/admin">
          Back to admin
        </Link>
      </div>

      {!json?.ok ? (
        <div className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm">
          Error: {json?.error ?? "Failed to load investors."}
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {investors.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-600" colSpan={5}>
                  No investors found in the investors table.
                </td>
              </tr>
            ) : (
              investors.map((i) => (
                <tr key={i.email} className="border-b last:border-b-0">
                  <td className="px-4 py-3">{i.email}</td>
                  <td className="px-4 py-3">{(i.full_name as any) ?? "-"}</td>
                  <td className="px-4 py-3">{(i.company as any) ?? (i.organization as any) ?? "-"}</td>
                  <td className="px-4 py-3">{i.status ?? "-"}</td>
                  <td className="px-4 py-3">
                    {i.created_at ? new Date(i.created_at).toLocaleString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
