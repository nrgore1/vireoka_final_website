import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { requireAdminFromBearer } from "@/lib/auth/requireAdminFromBearer";

export async function GET(req: Request) {
  const admin = await requireAdminFromBearer(req);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("id");
  if (!applicationId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("investor_application_audit_logs")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
