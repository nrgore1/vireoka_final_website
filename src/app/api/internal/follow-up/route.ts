export const runtime = "nodejs";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendFollowUpEmail } from "@/lib/notify/mail";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("investors")
    .select("email, invited_at")
    .eq("status", "pending")
    .lt("invited_at", new Date(Date.now() - 3 * 86400000).toISOString());

  for (const i of data || []) {
    await sendFollowUpEmail(i.email);
  }

  return NextResponse.json({ ok: true });
}
