import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CURRENT_NDA_VERSION } from "@/lib/nda";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const supabase = supabaseAdmin();
  const { data: inv } = await supabase
    .from("investors")
    .select("email, approved_at")
    .eq("invite_token", token)
    .single();

  if (!inv?.email || !inv.approved_at) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const content = `
VIREOKA NDA (Version ${CURRENT_NDA_VERSION})

This document is provided for review and acceptance as part of the investor access process.
By accepting, you agree to keep all confidential materials private and use them solely for evaluation.

(Replace with your full NDA text.)
`.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="vireoka-nda.pdf"',
    },
  });
}
