import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: Request) {
  await requireAdmin(req);

  const email = new URL(req.url).searchParams.get("email");
  if (!email) {
    return new NextResponse("Missing email", { status: 400 });
  }

  const { data } = await supabase
    .from("investor_events")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  const csv = [
    "event,path,created_at",
    ...rows.map(
      (r) =>
        `"${r.event}","${r.path ?? ""}","${r.created_at}"`
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": `attachment; filename="${email}-events.csv"`,
    },
  });
}
