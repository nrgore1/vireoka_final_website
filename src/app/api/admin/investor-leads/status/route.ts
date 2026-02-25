export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, requireAdminTokenOrThrow } from "@/lib/supabase/admin";

const Schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["NEW", "APPROVED", "REVOKED"]),
});

export async function POST(req: Request) {
  try {
    requireAdminTokenOrThrow(req);

    const body = await req.json();
    const { id, status } = Schema.parse(body);

    const supabase = supabaseAdmin();
    const r = await supabase
      .from("investor_leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, status")
      .single();

    if (r.error) return NextResponse.json({ ok: false, error: r.error.message }, { status: 500 });

    return NextResponse.json({ ok: true, id: r.data.id, status: r.data.status }, { status: 200 });
  } catch (e: any) {
    const msg = e?.message || "Invalid request";
    const status = e?.status || (msg.includes("uuid") || msg.includes("enum") ? 400 : 401);
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
