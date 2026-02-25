import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, requireAdminToken } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["NEW", "APPROVED", "REVOKED"]),
});

export async function POST(req: Request) {
  // Admin token gate
  if (!requireAdminToken(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Validate body
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { id, status } = parsed.data;

  try {
    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("investor_leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: "update_failed", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id, status }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "server_error", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
