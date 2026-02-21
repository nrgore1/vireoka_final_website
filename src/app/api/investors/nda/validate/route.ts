import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { sha256 } from "@/lib/security/tokens";

export async function POST(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json().catch(() => null);

    const token = String(body?.token || "").trim();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const tokenHash = sha256(token);

    // IMPORTANT: validate must be READ-ONLY. Do NOT set used_at here.
    const { data: link, error } = await supabase
      .from("investor_nda_links")
      .select("id, application_id, expires_at, used_at, investor_applications!inner(email)")
      .eq("token_hash", tokenHash)
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    if (!link) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
    }

    const expiresAt = new Date(link.expires_at);
    if (Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, expired: true, error: "Link expired" },
        { status: 410 }
      );
    }

    // If already used, return ok=true with used=true so UI can redirect/continue.
    if (link.used_at) {
      const email = String((link as any).investor_applications?.email || "").toLowerCase();
      return NextResponse.json({
        ok: true,
        valid: false,
        used: true,
        used_at: link.used_at,
        email,
        application_id: link.application_id,
      });
    }

    const email = String((link as any).investor_applications?.email || "").toLowerCase();

    return NextResponse.json({
      ok: true,
      valid: true,
      used: false,
      expires_at: link.expires_at,
      email,
      application_id: link.application_id,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
