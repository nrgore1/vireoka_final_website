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

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = adminSupabase();
  const { data } = await supabase
    .from("investor_access_requests")
    .select("id,email,name,firm,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return NextResponse.json({ rows: data || [] });
}
