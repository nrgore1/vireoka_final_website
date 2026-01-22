export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function requireAdmin(req: Request) {
  const token = req.headers.get("x-admin-token");
  return token && token === process.env.INVESTOR_ADMIN_TOKEN;
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const version = Number(form.get("version"));
  const file = form.get("file") as File | null;

  if (!version || !file) {
    return NextResponse.json({ error: "Missing version or file" }, { status: 400 });
  }

  const supabase = adminSupabase();
  const path = `nda_v${version}.pdf`;

  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from("nda")
    .upload(path, buf, { contentType: "application/pdf", upsert: true });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  // Deactivate current active
  await supabase.from("nda_versions").update({ active: false }).eq("active", true);

  // Upsert new version as active
  const { error: dbErr } = await supabase.from("nda_versions").upsert({
    version,
    file_path: path,
    active: true,
  }, { onConflict: "version" });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, version, file_path: path });
}
