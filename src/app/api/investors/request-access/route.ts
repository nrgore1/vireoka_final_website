export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RoleUI = "advisor" | "angel" | "crowd" | "partner" | "vc";
type KindDB = "ADVISOR" | "ANGEL" | "CROWD" | "PARTNER" | "VC";

function normalizeRole(v: any): RoleUI {
  const s = String(v || "").trim().toLowerCase();
  if (s === "advisor") return "advisor";
  if (s === "angel") return "angel";
  if (s === "crowd" || s === "contributor") return "crowd";
  if (s === "partner") return "partner";
  if (s === "vc" || s === "venture" || s === "venturecapitalist" || s === "venture capitalist") return "vc";
  return "advisor";
}

function roleToKind(role: RoleUI): KindDB {
  switch (role) {
    case "advisor":
      return "ADVISOR";
    case "angel":
      return "ANGEL";
    case "crowd":
      return "CROWD";
    case "partner":
      return "PARTNER";
    case "vc":
      return "VC";
  }
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const company = String(body.company || "").trim();
    const message = String(body.message || "").trim();
    const role = normalizeRole(body.role ?? body.investorType ?? body.kind);

    if (!fullName) {
      return NextResponse.json({ ok: false, code: "VALIDATION", message: "Please enter your full name." }, { status: 400 });
    }
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, code: "VALIDATION", message: "Please enter a valid email address." }, { status: 400 });
    }
    if (!company) {
      return NextResponse.json({ ok: false, code: "VALIDATION", message: "Please enter your company (or write “Individual”)." }, { status: 400 });
    }

    const kind = roleToKind(role);

    const supabase = supabaseAdmin();

    // If there's already a lead for this email, return that (friendly).
    const existing = await supabase
      .from("investor_leads")
      .select("id, reference_code, status, kind, investor_type")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing.data?.id) {
      return NextResponse.json(
        {
          ok: true,
          id: existing.data.id,
          referenceCode: existing.data.reference_code,
          status: existing.data.status,
          role,
          message:
            "We already have a request on file for this email. If you need to update details, reply to the confirmation email or submit again with a different email.",
        },
        { status: 200 }
      );
    }

    const referenceCode = cryptoRandomUUID();

    const insert = await supabase
      .from("investor_leads")
      .insert({
        full_name: fullName,
        email,
        company,
        message: message || null,
        // IMPORTANT: satisfy DB constraints
        kind,                 // e.g., "ADVISOR"
        investor_type: role,  // keep legacy column if present
        reference_code: referenceCode,
        status: "NEW",
      })
      .select("id, reference_code, status")
      .single();

    if (insert.error) {
      return NextResponse.json(
        {
          ok: false,
          code: "LEAD_INSERT_FAILED",
          message: "We couldn’t save your request. Please try again, or contact us if this persists.",
          detail: insert.error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id: insert.data.id,
        referenceCode: insert.data.reference_code,
        status: insert.data.status,
        role,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", message: "Something went wrong. Please try again.", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}

// Node 18+ has crypto.randomUUID(), but keep it safe:
function cryptoRandomUUID() {
  try {
    // @ts-ignore
    return crypto.randomUUID();
  } catch {
    // fallback
    return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
  }
}
