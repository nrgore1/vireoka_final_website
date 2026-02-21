import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { verifyInfoRequestToken } from "@/lib/security/inviteJwt";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token = String(body?.token || "").trim();

  if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

  try {
    const { application_id, email } = await verifyInfoRequestToken(token);
    const svc = getServiceSupabase();

    const { data: app, error } = await svc
      .from("investor_applications")
      .select("id,email,investor_name,organization,status,created_at,metadata")
      .eq("id", application_id)
      .maybeSingle();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    if (!app) return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });

    if (String(app.email).toLowerCase() !== email) {
      return NextResponse.json({ ok: false, error: "Token does not match application" }, { status: 403 });
    }

    const md: any = app.metadata || {};
    const requests = Array.isArray(md.info_requests) ? md.info_requests : [];
    const latestReq = requests.length ? requests[requests.length - 1] : null;

    return NextResponse.json({
      ok: true,
      email,
      application_id,
      investor_name: app.investor_name ?? null,
      organization: app.organization ?? null,
      request_message: latestReq?.message ?? null,
      requested_at: latestReq?.requested_at ?? null,
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    return NextResponse.json(
      { ok: false, error: msg.includes("exp") ? "This link has expired" : "Invalid link" },
      { status: 401 }
    );
  }
}
