import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { requireAdminFromBearer } from "@/lib/auth/requireAdminFromBearer";

export async function GET(req: Request) {
  const admin = await requireAdminFromBearer(req);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 10;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = getServiceSupabase();

  const query = supabase
    .from("investor_applications")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (q) {
    query.or(
      `investor_name.ilike.%${q}%,email.ilike.%${q}%,organization.ilike.%${q}%`
    );
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    page,
    totalPages: Math.ceil((count || 0) / pageSize),
  });
}
