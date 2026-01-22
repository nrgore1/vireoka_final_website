import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("investor_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }

  // CSV response
  const rows = [
    ["email", "type", "path", "created_at"],
    ...(data ?? []).map((r: any) => [
      r.email,
      r.type,
      r.path ?? "",
      r.created_at,
    ]),
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=investor-events.csv",
    },
  });
}
