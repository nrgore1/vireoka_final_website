import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/serverClient";

function nowIso() {
  return new Date().toISOString();
}

export async function GET() {
  try {
    const sb = await supabaseServerClient();

    const { data: userRes, error: userErr } = await sb.auth.getUser();
    if (userErr || !userRes?.user) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      userId: userRes.user.id,
      checkedAt: nowIso(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unexpected error", checkedAt: nowIso() },
      { status: 500 }
    );
  }
}
