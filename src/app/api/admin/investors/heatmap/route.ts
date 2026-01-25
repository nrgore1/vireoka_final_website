import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/supabase/admin";
import { listInvestorsForHeatmap } from "@/lib/investorStore";

export async function GET(req: Request) {
  if (!requireAdminToken(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const rows = await listInvestorsForHeatmap();

  // Convert into heat buckets for quick UI rendering
  const max = Math.max(...rows.map((r: any) => Number(r.engagement_score || 0)), 0);
  const bucket = (s: number) => {
    if (max <= 0) return 0;
    const pct = s / max;
    if (pct >= 0.8) return 4;
    if (pct >= 0.6) return 3;
    if (pct >= 0.4) return 2;
    if (pct >= 0.2) return 1;
    return 0;
  };

  const data = rows.map((r: any) => ({
    email: r.email,
    score: Number(r.engagement_score || 0),
    bucket: bucket(Number(r.engagement_score || 0)),
    ndaAcceptedAt: r.nda_accepted_at || null,
    accessExpiresAt: r.access_expires_at || null,
    hotAlertedAt: r.hot_alerted_at || null,
  }));

  return NextResponse.json({ ok: true, max, data });
}
