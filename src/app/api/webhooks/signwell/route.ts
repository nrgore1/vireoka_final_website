import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getDocument } from "@/lib/nda/signwell";

export const runtime = "nodejs";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function timingSafeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function verifyWebhook(rawBody: string, headers: Headers) {
  const secret = process.env.SIGNWELL_WEBHOOK_SECRET || "";
  // Dev-friendly bypass if not configured
  if (!secret || secret === "replace_me") return { ok: true as const, skipped: true as const };

  // We don't have authoritative SignWell header name from the API reference pages shown,
  // so we support common patterns:
  // - x-signature
  // - x-signature-256 (sha256=...)
  // - x-hub-signature-256 (sha256=...)
  // - x-signwell-signature (raw hex)
  const sig =
    headers.get("x-signwell-signature") ||
    headers.get("x-signature") ||
    headers.get("x-signature-256") ||
    headers.get("x-hub-signature-256") ||
    "";

  if (!sig) return { ok: false as const, error: "Missing signature header" };

  const hmac = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const normalized = sig.startsWith("sha256=") ? sig.slice("sha256=".length) : sig;

  if (!timingSafeEqual(hmac, normalized)) {
    return { ok: false as const, error: "Invalid signature" };
  }

  return { ok: true as const, skipped: false as const };
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const v = verifyWebhook(rawBody, req.headers);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 401 });
  }

  let event: any = null;
  try {
    event = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Payload shapes vary; handle defensively.
  const documentId =
    event?.document?.id ||
    event?.document_id ||
    event?.data?.document?.id ||
    event?.data?.document_id ||
    null;

  const eventType =
    event?.event ||
    event?.type ||
    event?.name ||
    event?.data?.event ||
    event?.data?.type ||
    "";

  if (!documentId) {
    return NextResponse.json({ ok: true, ignored: true, reason: "No document_id" });
  }

  // Fetch authoritative document state
  let doc: any = null;
  try {
    doc = await getDocument(String(documentId));
  } catch (e) {
    console.error("[signwell webhook] getDocument error:", e);
    // still ack to prevent retries storm
    return NextResponse.json({ ok: true, note: "Could not fetch document" });
  }

  const status = String(doc?.status || "").toLowerCase();
  const recipients = Array.isArray(doc?.recipients) ? doc.recipients : [];

  // Attempt to derive signer email
  const signerEmail =
    (recipients.find((r: any) => String(r?.status || "").toLowerCase() === "completed")?.email) ||
    recipients[0]?.email ||
    null;

  // Decide completion: either webhook says completed OR doc status indicates completed
  const completed =
    /complete|completed|signed/.test(String(eventType).toLowerCase()) || status === "completed";

  // Update tracking table
  try {
    await sb.from("investor_nda_signwell").update({
      status: status || String(eventType || "event"),
      completed_at: completed ? new Date().toISOString() : null,
    }).eq("document_id", String(documentId));
  } catch (e) {
    console.error("[signwell webhook] update investor_nda_signwell failed:", e);
  }

  if (completed && signerEmail) {
    const email = String(signerEmail).toLowerCase();

    // Mark investor NDA accepted (unlocks portal gate)
    await sb.from("investors").update({
      nda_accepted_at: new Date().toISOString(),
    }).eq("email", email);

    // Audit (best-effort)
    try {
      await sb.from("investor_application_audit_logs").insert({
        application_id: null,
        action: "nda_signed_signwell",
        performed_by: null,
        metadata: { email, document_id: String(documentId), status },
      });
    } catch {}
  }

  return NextResponse.json({ ok: true });
}
