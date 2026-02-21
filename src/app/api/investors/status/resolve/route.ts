import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { sha256 } from "@/lib/security/tokens";

function normalizeEmail(v: any) {
  return String(v || "").trim().toLowerCase();
}

function within24Hours(iso?: string | null) {
  if (!iso) return true;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return true;
  return (Date.now() - t) < 24 * 60 * 60 * 1000;
}

function statusMessage(app: any, investor: any) {
  const appStatus = String(app?.status || "").toLowerCase();
  const invApproved = Boolean(investor?.approved_at) || String(investor?.status || "").toLowerCase() === "approved";
  const ndaAccepted = Boolean(investor?.nda_accepted_at);

  if (appStatus === "rejected") {
    return {
      title: "Application not approved",
      message:
        "Your investor access request was not approved. If you believe this is an error or you’d like to provide additional context, please reply to our email or contact support.",
      ctas: {
        primary: { label: "Contact support", href: "mailto:info@vireoka.com" },
        secondary: { label: "Back to site", href: "/" },
      },
    };
  }

  if (appStatus === "info_requested") {
    return {
      title: "Additional information requested",
      message:
        "We’ve requested additional information to complete your review. Please check your inbox for our questions and reply directly to that email.",
      ctas: {
        primary: { label: "Check status page", href: "/investors/status" },
        secondary: { label: "Contact support", href: "mailto:info@vireoka.com" },
      },
    };
  }

  if (invApproved) {
    if (!ndaAccepted) {
      return {
        title: "Approved — NDA required",
        message:
          "Your request has been approved. We’ve sent you an email with your NDA link. Please review and accept the NDA to unlock investor portal access.",
        ctas: {
          primary: { label: "Request a fresh NDA email", href: "/investors/status" },
          secondary: { label: "Contact support", href: "mailto:info@vireoka.com" },
        },
      };
    }

    return {
      title: "Access active ✅",
      message: "Your NDA is complete and your investor access is active. You can proceed to the investor portal.",
      ctas: {
        primary: { label: "Open Investor Portal", href: "/investors/access" },
        secondary: { label: "Back to site", href: "/" },
      },
    };
  }

  // Default: submitted / pending
  if (appStatus === "submitted" || !appStatus) {
    const review = within24Hours(app?.created_at)
      ? "Your request is being reviewed. You’ll receive an update within 24 hours."
      : "Your request is being reviewed. You’ll receive an update as soon as possible.";
    return {
      title: "Under review",
      message:
        review +
        " If you have additional context (firm, role, accreditation, intended use), you can reply to the confirmation email or contact support.",
      ctas: {
        primary: { label: "Contact support", href: "mailto:info@vireoka.com" },
        secondary: { label: "Back to site", href: "/" },
      },
    };
  }

  // Catch-all
  return {
    title: "In progress",
    message: "Your request is being processed. Please check back shortly.",
    ctas: {
      primary: { label: "Back to site", href: "/" },
      secondary: { label: "Contact support", href: "mailto:info@vireoka.com" },
    },
  };
}

async function resolveToken(req: NextRequest) {
  const supabase = getServiceSupabase();

  const token = String(req.nextUrl.searchParams.get("token") || "").trim();
  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        invalid: true,
        title: "Missing link token",
        message: "This link is missing required information. Please request a new status link.",
        ctas: {
          primary: { label: "Request a new status link", href: "/investors/status" },
          secondary: { label: "Back to site", href: "/" },
        },
      },
      { status: 400 }
    );
  }

  const tokenHash = sha256(token);

  const { data: link, error } = await supabase
    .from("investor_status_links")
    .select("id,email,application_id,expires_at,used_at")
    .eq("token_hash", tokenHash)
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  if (!link) {
    return NextResponse.json(
      {
        ok: false,
        invalid: true,
        title: "This link doesn’t look valid",
        message: "It may be incomplete or already replaced. Request a new status link to continue.",
        ctas: {
          primary: { label: "Request a new status link", href: "/investors/status" },
          secondary: { label: "Back to site", href: "/" },
        },
      },
      { status: 404 }
    );
  }

  const expiresAt = new Date(link.expires_at);
  if (Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      {
        ok: false,
        expired: true,
        email: normalizeEmail(link.email),
        title: "This status link has expired",
        message: "For security, status links expire after a limited time. Request a new link and we’ll email it to you.",
        ctas: {
          primary: { label: "Request a new status link", href: "/investors/status" },
          secondary: { label: "Back to site", href: "/" },
        },
      },
      { status: 410 }
    );
  }

  // Mark used_at once (best-effort, non-blocking)
  if (!link.used_at) {
    try {
      await supabase.from("investor_status_links").update({ used_at: new Date().toISOString() }).eq("id", link.id);
    } catch {}
  }

  // Load application + investor info (best-effort)
  const email = normalizeEmail(link.email);
  const [appRes, invRes] = await Promise.all([
    link.application_id
      ? supabase
          .from("investor_applications")
          .select("id,email,investor_name,organization,status,reference_code,created_at,updated_at")
          .eq("id", link.application_id)
          .maybeSingle()
      : supabase
          .from("investor_applications")
          .select("id,email,investor_name,organization,status,reference_code,created_at,updated_at")
          .eq("email", email)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
    supabase.from("investors").select("*").eq("email", email).limit(1).maybeSingle(),
  ]);

  const app = appRes?.data ?? null;
  const investor = invRes?.data ?? null;

  const msg = statusMessage(app, investor);

  return NextResponse.json({
    ok: true,
    used: Boolean(link.used_at),
    email,
    expires_at: link.expires_at,
    title: msg.title,
    message: msg.message,
    ctas: msg.ctas,
  });
}

export async function GET(req: NextRequest) {
  return resolveToken(req);
}
