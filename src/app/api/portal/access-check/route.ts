import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/serverClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function nowIso() {
  return new Date().toISOString();
}

export async function GET() {
  try {
    const sb = await supabaseServerClient();

    const { data: userRes, error: userErr } = await sb.auth.getUser();
    const user = userRes?.user;

    if (userErr || !user) {
      return NextResponse.json(
        { ok: true, allowed: false, reason: "unauthenticated", ts: nowIso() },
        { status: 200 }
      );
    }

    // ✅ Admin bypass (Option A)
    try {
      const { data: prof } = await (sb as any)
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = String(prof?.role || "").toLowerCase();
      if (role === "admin") {
        return NextResponse.json(
          {
            ok: true,
            allowed: true,
            reason: "admin",
            tier_rank: 40,
            stakeholder_type: "vc",
            expires_at: null,
            ts: nowIso(),
          },
          { status: 200 }
        );
      }
    } catch {
      // fall through to investor checks
    }

    // Investor checks
    const { data: inv, error: invErr } = await (sb as any)
      .from("investors")
      .select(
        "id, nda_signed_at, access_granted_at, access_expires_at, access_revoked_at, tier_rank, stakeholder_type"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (invErr || !inv) {
      return NextResponse.json(
        { ok: true, allowed: false, reason: "no_investor_record", ts: nowIso() },
        { status: 200 }
      );
    }

    if (!inv.nda_signed_at) {
      return NextResponse.json(
        { ok: true, allowed: false, reason: "nda_required", ts: nowIso() },
        { status: 200 }
      );
    }

    if (inv.access_revoked_at) {
      return NextResponse.json(
        { ok: true, allowed: false, reason: "revoked", ts: nowIso() },
        { status: 200 }
      );
    }

    if (!inv.access_granted_at) {
      return NextResponse.json(
        { ok: true, allowed: false, reason: "pending", ts: nowIso() },
        { status: 200 }
      );
    }

    if (inv.access_expires_at) {
      const exp = new Date(inv.access_expires_at).getTime();
      if (!Number.isNaN(exp) && exp <= Date.now()) {
        return NextResponse.json(
          { ok: true, allowed: false, reason: "expired", ts: nowIso() },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        ok: true,
        allowed: true,
        reason: "ok",
        tier_rank: Number(inv.tier_rank || 10),
        stakeholder_type: String(inv.stakeholder_type || "crowd"),
        expires_at: inv.access_expires_at || null,
        ts: nowIso(),
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "server_error", ts: nowIso() },
      { status: 500 }
    );
  }
}
