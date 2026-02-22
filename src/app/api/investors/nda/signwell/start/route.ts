import { NextResponse } from "next/server";
import { signwellCreateDocumentFromTemplate } from "@/lib/signwell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(req: Request) {
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`.replace(/\/$/, "");
}

function friendly(msg: string) {
  const m = msg || "";

  if (m.includes("Missing env var")) {
    return {
      error: "NDA signing isn’t configured on the server yet.",
      fix: "Fix: set SIGNWELL_API_KEY and SIGNWELL_TEMPLATE_ID in the environment and restart/redeploy.",
    };
  }

  if (m.includes("placeholder") || m.includes("Template placeholders")) {
    return {
      error: "NDA template recipients aren’t configured correctly.",
      fix:
        "Fix: ensure the SignWell template has both placeholders ‘Document Sender’ and ‘Receiving Party’, and set SIGNWELL_SENDER_NAME + SIGNWELL_SENDER_EMAIL.",
    };
  }

  return {
    error: "We couldn’t start the NDA signing session.",
    fix:
      "Fix: try again in a moment. If it continues, contact support. Admins can check the technical details in the page to diagnose.",
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const token = String(body?.token || "").trim();
    const signerName = String(body?.signer_name || "").trim();
    const signerEmail = String(body?.signer_email || "").trim().toLowerCase();

    if (!token) return NextResponse.json({ ok: false, error: "Missing token." }, { status: 400 });
    if (!signerName) return NextResponse.json({ ok: false, error: "Please enter your full legal name." }, { status: 400 });
    if (!signerEmail || !signerEmail.includes("@")) {
      return NextResponse.json({ ok: false, error: "Missing signer email." }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || getBaseUrl(req);
    const redirectUrl = `${base}/investors/nda-signed?token=${encodeURIComponent(token)}`;

    const { iframeUrl, documentId, raw } = await signwellCreateDocumentFromTemplate({
      signerName,
      signerEmail,
      redirectUrl,
      metadata: { token, signerEmail },
    });

    if (!iframeUrl) {
      // This is the exact case you're hitting: document created, but no embedded URL exposed
      return NextResponse.json(
        {
          ok: false,
          error:
            "We created the NDA document, but SignWell did not return an embedded signing link to display here.",
          fix:
            "Fix: verify your SignWell account/API key supports Embedded Signing, and that the template allows embedded signing. " +
            "If embedded signing isn’t enabled on your plan, you can switch to email-based signing instead.",
          // Include raw response for admins (dev is fine; you can remove later)
          debug: raw,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, iframe_url: iframeUrl, document_id: documentId });
  } catch (e: any) {
    const raw = String(e?.message || "Server error");
    const fm = friendly(raw);
    return NextResponse.json(
      {
        ok: false,
        error: fm.error,
        fix: fm.fix,
        debug: raw,
      },
      { status: 500 }
    );
  }
}
