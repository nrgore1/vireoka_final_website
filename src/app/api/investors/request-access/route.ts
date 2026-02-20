import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

function getIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

function isMissingColumnError(errMsg: string) {
  const msg = (errMsg || "").toLowerCase();
  return (
    msg.includes("could not find the") ||
    msg.includes("schema cache") ||
    msg.includes("column") && msg.includes("not") && msg.includes("schema")
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim() || null;
    const message = String(body.message || "").trim() || null;

    if (!fullName || !email) {
      return NextResponse.json({ ok: false, error: "Missing name or email" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const id = randomUUID();
    const referenceCode = randomUUID();
    const ip = getIp(req);
    const userAgent = req.headers.get("user-agent") || null;

    const baseRow: any = {
      id,
      kind: "REQUEST_ACCESS",
      status: "NEW",
      full_name: fullName,
      email,
      company,
      message,
      ip,
      user_agent: userAgent,
    };

    const extendedRow: any = {
      ...baseRow,
      reference_code: referenceCode,
      environment: process.env.NODE_ENV === "production" ? "production" : "development",
    };

    let { error } = await supabase.from("investor_leads").insert(extendedRow);

    if (error && isMissingColumnError(error.message)) {
      ({ error } = await supabase.from("investor_leads").insert(baseRow));
    }

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id, referenceCode });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "Server error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
