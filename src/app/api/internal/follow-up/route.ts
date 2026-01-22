export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailFollowUp } from "@/lib/notify";

export async function POST() {
  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("investors")
    .select("email, invited_at")
    .eq("status", "pending")
    .lt(
      "invited_at",
      new Date(Date.now() - 3 * 86400000).toISOString()
    );

  for (const investor of data || []) {
    await emailFollowUp(investor.email);
  }

  return NextResponse.json({ ok: true });
}
