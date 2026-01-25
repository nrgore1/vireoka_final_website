import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getIp } from "@/lib/net";
import { recomputeEngagementScore } from "@/lib/engagementScore";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const path = url.searchParams.get("path");

  if (!email || !path) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  await supabase.from("investor_events").insert({
    email: email.toLowerCase(),
    path,
    ip: getIp(req),
  });

  // 🔥 Recompute engagement score (handles alerts internally)
  await recomputeEngagementScore(email.toLowerCase());

  return NextResponse.redirect(url);
}
