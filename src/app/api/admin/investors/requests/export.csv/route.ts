import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function requireAdmin(req: Request) {
  const token = req.headers.get("x-admin-token");
  return token && token === process.env.INVESTOR_ADMIN_TOKEN;
}

function toCsv(rows: any[]) {
  const header = [
    "email",
    "name",
    "firm",
    "message",
    "status",
    "created_at",
    "reviewed_at",
    "ip",
    "user_agent",
  ];

  const esc = (v: any) => `"${String(v ?? "").replaceAll('"', '""')}"`;

  const lines = [
    header.join(","),
    ...rows.map((r) =>
      header.map((h) => esc(r[h])).join(",")
    ),
  ];

  return lines.join("\n");
}

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = adminSupabase();
  const { data } = await supabase
    .from("investor_access_requests")
    .select("email,name,firm,message,status,created_at,reviewed_at,ip,user_agent")
    .order("created_at", { ascending: false })
    .limit(5000);

  const csv = toCsv(data || []);

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="investor_access_requests.csv"',
    },
  });
}
