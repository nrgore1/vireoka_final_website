export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminToken } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  if (!requireAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("investors")
    .select("email,status,engagement_score,invited_at,last_access");

  const header = "email,status,engagement_score,invited_at,last_access";
  const rows = (data || []).map(i =>
    [
      i.email,
      i.status,
      i.engagement_score,
      i.invited_at || "",
      i.last_access || "",
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=investor_engagement.csv",
    },
  });
}
