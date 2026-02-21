import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { sha256 } from "@/lib/security/tokens";

function normalizeEmail(v: any) {
  return String(v || "").trim().toLowerCase();
}

async function resolveToken(req: NextRequest) {
  const supabase = getServiceSupabase();

  // Accept token from querystring OR JSON body (robust for both client patterns)
  const tokenFromQuery = req.nextUrl.searchParams.get("token");
  const body = await req.json().catch(() => null);
  const tokenFromBody = body?.token;

  const token = String(tokenFromQuery || tokenFromBody || "").trim();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  }

  const tokenHash = sha256(token);

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
    return NextResponse.json(
      {
        ok: false,
        invalid: true,
        title: "This link doesn’t look valid",
        message:
          "The link may be incomplete or already replaced. Request a new NDA link to continue.",
        ctas: {
          primary: { label: "Request a new NDA link", href: "/investors/status" },
          secondary: { label: "Back to Investor Access", href: "/investors/access" },
        },
      },
      { status: 404 }
    );
  }

  const email = normalizeEmail((link as any).investor_applications?.email);

  const expiresAt = new Date(link.expires_at);
  if (Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      {
        ok: false,
        expired: true,
        email,
        title: "This NDA link has expired",
        message:
          "For security, NDA links expire after a limited time. Request a new link and we’ll email it to you.",
        ctas: {
          primary: { label: "Request a new NDA link", href: "/investors/status" },
          secondary: { label: "Back to Investor Access", href: "/investors/access" },
        },
      },
      { status: 410 }
    );
  }

  // Used link: return friendly state (NOT a scary error)
  if (link.used_at) {
    return NextResponse.json({
      ok: true,
      used: true,
      email,
      used_at: link.used_at,
      title: "NDA already completed ✅",
      message:
        "This NDA link has already been used. If you’ve already signed, you can continue to Investor Access. If you still need a fresh link, request a new NDA email.",
      ctas: {
        primary: { label: "Continue to Investor Access", href: "/investors/access" },
        secondary: { label: "Request a new NDA link", href: "/investors/status" },
      },
    });
  }

  // Valid and unused
  return NextResponse.json({
    ok: true,
    used: false,
    email,
    expires_at: link.expires_at,
    title: "NDA link verified",
    message: "Your NDA link is valid. Please proceed to review and sign the NDA.",
    ctas: {
      primary: { label: "Continue to NDA", href: `/investors/nda?token=${encodeURIComponent(token)}` },
      secondary: { label: "Back", href: "/investors" },
    },
  });
}

// Support both GET and POST
export async function GET(req: NextRequest) {
  return resolveToken(req);
}

export async function POST(req: NextRequest) {
  return resolveToken(req);
}
