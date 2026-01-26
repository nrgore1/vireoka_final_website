/// <reference deno-types="https://deno.land/x/types/index.d.ts" />
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

/**
 * Watermarked Download Edge Function (CANONICAL)
 *
 * GET /functions/v1/watermarked-download?bucket=<bucket>&path=<path>&doc_id=<doc_id>
 *
 * - Requires Authorization Bearer <user JWT>
 * - Enforces active investor access via RPC has_active_investor_access()
 * - RATE LIMIT: DB-backed via RPC check_rate_limit()
 * - Downloads original PDF using service role
 * - Adds watermark (email + timestamp + doc_id)
 * - Logs audit DOC_DOWNLOAD
 *
 * Env vars required (Supabase Dashboard → Functions → Secrets):
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY
 *
 * Recommended limits (tune as needed):
 * - 30 downloads per minute per user+ip
 */

function getClientIp(req: Request): string {
  // Common headers from CDNs / reverse proxies
  const h =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "";
  if (!h) return "unknown";
  return h.split(",")[0]?.trim() || "unknown";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const bucket = url.searchParams.get("bucket") ?? "";
    const path = url.searchParams.get("path") ?? "";
    const docId = url.searchParams.get("doc_id") ?? "";

    if (!bucket || !path) {
      return new Response(JSON.stringify({ error: "Missing bucket/path" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing Authorization Bearer token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // Identify user
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;
    const userEmail = userData.user.email ?? "unknown";

    // Enforce entitlement
    const { data: entitled, error: entErr } = await userClient.rpc("has_active_investor_access");
    if (entErr || !entitled) {
      return new Response(JSON.stringify({ error: "No active investor access" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // RATE LIMIT (per user+ip)
    const ip = getClientIp(req);
    const rlKey = `watermarked_download:${userId}:${ip}`;
    const { data: rlData, error: rlErr } = await userClient.rpc("check_rate_limit", {
      p_key: rlKey,
      p_limit: 30,
      p_window_seconds: 60,
    });
    if (rlErr) {
      return new Response(JSON.stringify({ error: "Rate limit check failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allowed = Boolean(rlData?.allowed);
    const remaining = Number(rlData?.remaining ?? 0);
    const resetAt = String(rlData?.reset_at ?? "");

    if (!allowed) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": resetAt,
        },
      });
    }

    // Download original from Storage (admin client)
    const { data: fileData, error: dlErr } = await adminClient.storage.from(bucket).download(path);
    if (dlErr || !fileData) {
      return new Response(JSON.stringify({ error: "File download failed", details: dlErr?.message }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": resetAt,
        },
      });
    }

    const originalBytes = new Uint8Array(await fileData.arrayBuffer());

    // Watermark
    const pdfDoc = await PDFDocument.load(originalBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const stamp = `CONFIDENTIAL • ${userEmail} • ${new Date().toISOString()}${docId ? " • " + docId : ""}`;

    const pages = pdfDoc.getPages();
    for (const p of pages) {
      const { width, height } = p.getSize();

      p.drawText(stamp, {
        x: 24,
        y: 24,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });

      p.drawText(userEmail, {
        x: width * 0.15,
        y: height * 0.55,
        size: 28,
        font,
        color: rgb(0.85, 0.85, 0.85),
        rotate: { type: "degrees", angle: 35 },
      });
    }

    const outBytes = await pdfDoc.save();

    // Audit
    await adminClient.from("portal_audit_events").insert({
      user_id: userId,
      event_type: "DOC_DOWNLOAD",
      entity_type: "DOCUMENT",
      entity_id: docId || `${bucket}/${path}`,
      metadata: {
        bucket,
        path,
        doc_id: docId || null,
        watermarked: true,
        ip,
        rate_limit_remaining: remaining,
      },
    });

    return new Response(outBytes, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="watermarked.pdf"`,
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": resetAt,
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unexpected error", message: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
