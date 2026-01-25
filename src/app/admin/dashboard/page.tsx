export const dynamic = "force-dynamic";

async function fetchHeatmap() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/investors/heatmap`, {
    headers: {
      "x-admin-token": process.env.INVESTOR_ADMIN_TOKEN || "",
    },
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) return null;
  return res.json();
}

export default async function AdminDashboardPage() {
  const hm = await fetchHeatmap();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-vireoka-indigo">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-vireoka-graphite">
        Engagement heatmap (last 14 days scoring). Slack alerts fire once when a score crosses the threshold.
      </p>

      <div className="mt-6 rounded-xl border border-vireoka-line bg-white p-6">
        {!hm?.ok ? (
          <p className="text-sm text-vireoka-graphite">Heatmap unavailable (check admin token / env).</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-vireoka-graphite">
                Max score: <span className="font-medium text-vireoka-indigo">{hm.max?.toFixed?.(1) ?? hm.max}</span>
              </p>
              <p className="text-xs text-vireoka-graphite">
                Buckets: 0 (low) → 4 (high)
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-vireoka-line">
                    <th className="py-2 pr-4">Investor</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2 pr-4">Heat</th>
                    <th className="py-2 pr-4">NDA</th>
                    <th className="py-2 pr-4">Expiry</th>
                    <th className="py-2 pr-4">Hot Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {hm.data.map((r: any) => (
                    <tr key={r.email} className="border-b border-vireoka-line/60">
                      <td className="py-2 pr-4 text-vireoka-indigo">{r.email}</td>
                      <td className="py-2 pr-4 text-vireoka-graphite">{r.score.toFixed(1)}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={[
                            "inline-block h-3 w-16 rounded",
                            r.bucket === 4 ? "bg-vireoka-indigo" :
                            r.bucket === 3 ? "bg-vireoka-graphite" :
                            r.bucket === 2 ? "bg-vireoka-teal" :
                            r.bucket === 1 ? "bg-vireoka-line" :
                            "bg-vireoka-ash",
                          ].join(" ")}
                          title={`bucket ${r.bucket}`}
                        />
                      </td>
                      <td className="py-2 pr-4 text-vireoka-graphite">{r.ndaAcceptedAt ? "Yes" : "No"}</td>
                      <td className="py-2 pr-4 text-vireoka-graphite">{r.accessExpiresAt ? new Date(r.accessExpiresAt).toLocaleDateString() : "-"}</td>
                      <td className="py-2 pr-4 text-vireoka-graphite">{r.hotAlertedAt ? "Sent" : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
