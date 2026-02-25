export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdminTokenOrThrow } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    requireAdminTokenOrThrow(req);
    const supabase = supabaseAdmin();

    const r = await supabase
      .from("investor_leads")
      .select("id, full_name, email, company, investor_type, kind, reference_code, status, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (r.error) return NextResponse.json({ ok: false, error: r.error.message }, { status: 500 });

    return NextResponse.json({ ok: true, leads: r.data || [] }, { status: 200 });
  } catch (e: any) {
    const status = e?.status || 401;
    return NextResponse.json({ ok: false, error: status === 401 ? "unauthorized" : (e?.message || "error") }, { status });
  }
}
