import { NextResponse } from "next/server";
import { signwellCreateDocumentFromTemplate } from "@/lib/signwell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const token = String(body?.token || "").trim();
    const signerName = String(body?.signer_name || "").trim();
    const signerEmail = String(body?.signer_email || "").trim().toLowerCase();

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }
    if (!signerName) {
      return NextResponse.json({ ok: false, error: "Missing signer_name" }, { status: 400 });
    }
    if (!signerEmail || !signerEmail.includes("@")) {
      return NextResponse.json({ ok: false, error: "Missing signer_email" }, { status: 400 });
    }

    // Redirect after signing back to your app; no webhooks required.
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      "http://localhost:3000";

    const redirectUrl = `${base.replace(/\/$/, "")}/investors/nda-signed?token=${encodeURIComponent(token)}`;

    const { iframeUrl, documentId } = await signwellCreateDocumentFromTemplate({
      signerName,
      signerEmail,
      redirectUrl,
      metadata: { token, signerEmail },
    });

    if (!iframeUrl) {
      return NextResponse.json(
        { ok: false, error: "SignWell did not return an embedded signing URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      iframe_url: iframeUrl,
      document_id: documentId,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
