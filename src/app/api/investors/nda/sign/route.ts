import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { sha256 } from "@/lib/security/tokens";

function ipFromReq(req: NextRequest) {
  // Best-effort IP extraction (works behind proxies too)
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "";
}

function normalizeEmail(v: any) {
  return String(v || "").trim().toLowerCase();
}

function coerceVersionToInt(v: any): number | null {
  if (v == null) return null;
  const s = String(v).trim();
  // Accept: 1, "1", "v1", "V2"
  const m = s.match(/(\d+)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();

    const body = await req.json().catch(() => null);

    const token = String(body?.token || "").trim();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const tokenHash = sha256(token);

    // Find link + application to get email/application_id
    const { data: link, error: linkErr } = await supabase
      .from("investor_nda_links")
      .select("id, application_id, expires_at, used_at, investor_applications!inner(email, investor_name)")
      .eq("token_hash", tokenHash)
      .limit(1)
      .maybeSingle();

    if (linkErr) {
      return NextResponse.json({ ok: false, error: linkErr.message }, { status: 500 });
    }
    if (!link) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
    }

    // Expired?
    const expiresAt = new Date(link.expires_at);
    if (Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: "Link expired" }, { status: 410 });
    }

    // Already used?
    if (link.used_at) {
      // Idempotent behavior: allow repeated POST without changing state
      // (still ensure investors table is marked signed)
      const email = normalizeEmail((link as any).investor_applications?.email);
      if (email) {
        await supabase
          .from("investors")
          .update({
            nda_signed: true,
            nda_signed_at: link.used_at,
            nda_accepted_at: link.used_at,
            last_access: new Date().toISOString(),
          })
          .eq("email", email);
      }
      return NextResponse.json({ ok: true, note: "Already signed" });
    }

    const app = (link as any).investor_applications;
    const email = normalizeEmail(app?.email);
    const nameFromApp = app?.investor_name ? String(app.investor_name) : null;

    const signer_email = normalizeEmail(body?.signer_email || email);
    const signer_name = body?.signer_name ? String(body.signer_name) : nameFromApp;

    const signedAt = new Date().toISOString();

    // Record signature
    const ip = body?.ip ? String(body.ip) : ipFromReq(req);
    const user_agent = body?.user_agent ? String(body.user_agent) : (req.headers.get("user-agent") || "");
    const nda_version = body?.nda_version ? String(body.nda_version) : "v1";

    const { error: sigErr } = await supabase.from("investor_nda_signatures").insert({
      application_id: link.application_id,
      signed_at: signedAt,
      signer_email,
      signer_name,
      ip,
      user_agent,
      nda_version,
      metadata: body?.metadata ?? {},
    });

    if (sigErr) {
      return NextResponse.json({ ok: false, error: sigErr.message }, { status: 500 });
    }

    // Mark link used
    const { error: usedErr } = await supabase
      .from("investor_nda_links")
      .update({ used_at: signedAt })
      .eq("id", link.id);

    if (usedErr) {
      return NextResponse.json({ ok: false, error: usedErr.message }, { status: 500 });
    }

    // ✅ PERMANENT FIX: mark investor as signed (canonical access flag)
    if (email) {
      const ndaVersionAccepted = coerceVersionToInt(nda_version);

      const updatePayload: any = {
        nda_signed: true,
        nda_signed_at: signedAt,
        nda_accepted_at: signedAt,
        last_access: signedAt,
      };

      // Only set version if we can parse it as an integer
      if (ndaVersionAccepted != null) updatePayload.nda_version_accepted = ndaVersionAccepted;

      const { error: invErr } = await supabase
        .from("investors")
        .update(updatePayload)
        .eq("email", email);

      if (invErr) {
        // Signature is recorded; return error so you notice the mismatch
        return NextResponse.json(
          { ok: false, error: `Signed but failed to update investors: ${invErr.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
