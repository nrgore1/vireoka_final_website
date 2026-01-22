export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getIp } from "@/lib/net";
import { recomputeEngagementScore } from "@/lib/engagementScore";
import { notifyHotInvestor } from "@/lib/notify/hotInvestor";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commId = searchParams.get("commId") || "";
  const email = searchParams.get("email") || "";
  const url = searchParams.get("url") || "/";

  const supabase = supabaseAdmin();

  await supabase.from("email_tracking_events").insert({
    comm_id: commId,
    email,
    event: "click",
    url,
    user_agent: req.headers.get("user-agent") || "unknown",
    ip: getIp(req),
  });

  const score = await recomputeEngagementScore(email);
  await notifyHotInvestor(email, score);

  return NextResponse.redirect(url);
}
