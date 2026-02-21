import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateToken, sha256 } from "@/lib/security/tokens";
import { sendInvestorStatusLinkEmail } from "@/lib/email/sendInvestorStatusLinkEmail";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const TTL_HOURS = Number(process.env.INVESTOR_STATUS_LINK_TTL_HOURS || 2);

function normalizeEmail(v: unknown) {
  return String(v || "").trim().toLowerCase();
}

function originFromReq(req: Request) {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  const generic = {
    ok: true,
    message: "If we have an application associated with that email, we sent a secure status link.",
  };

  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    // Always return generic message for privacy
    if (!email || !email.includes("@")) return NextResponse.json(generic);

    // Check existence (do not reveal result to client)
    const [appRes, invRes] = await Promise.all([
      sb.from("investor_applications")
        .select("id,email,investor_name,status,created_at")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1),
      sb.from("investors")
        .select("email")
        .eq("email", email)
        .limit(1),
    ]);

    const app = appRes.data?.[0] ?? null;
    const investor = invRes.data?.[0] ?? null;

    // If nothing exists, do nothing (still return generic)
    if (!app && !investor) return NextResponse.json(generic);

    // Create one-time token record
    const rawToken = generateToken(32);
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000).toISOString();

    const { error: insErr } = await sb.from("investor_status_links").insert({
      email,
      application_id: app?.id ?? null,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    if (insErr) {
      console.error("[status/request] insert error:", insErr);
      return NextResponse.json(generic);
    }

    const origin = process.env.APP_ORIGIN || originFromReq(req);
    const statusUrl = `${origin}/investors/status/view?token=${encodeURIComponent(rawToken)}`;

    try {
      await sendInvestorStatusLinkEmail({
        email,
        statusUrl,
        expiresHours: TTL_HOURS,
        name: app?.investor_name ?? null,
        applicationStatus: app?.status ?? null,
        applicationCreatedAt: app?.created_at ?? null,
      });
    } catch (e) {
      console.error("[status/request] email send error:", e);
    }

    return NextResponse.json(generic);
  } catch (e) {
    console.error("[status/request] error:", e);
    return NextResponse.json(generic);
  }
}
