import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminOrThrow } from "@/lib/adminGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdminOrThrow(req);

    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("investor_leads")
      .select("id, full_name, email, company, investor_type, reference_code, status, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, leads: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
}
