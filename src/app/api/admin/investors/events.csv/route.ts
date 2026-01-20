import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: Request) {
  requireAdmin(req);

  const supabase = getSupabase();

  const { data } = await supabase
    .from("investor_events")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  const csv = [
    "email,event,path,created_at",
    ...rows.map(
      r =>
        `"${r.email}","${r.event}","${r.path}","${r.created_at}"`
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": "attachment; filename=events.csv",
    },
  });
}
