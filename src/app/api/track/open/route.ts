export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getIp } from "@/lib/net";

const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  "base64"
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commId = searchParams.get("commId") || "";
  const email = searchParams.get("email") || "";

  const supabase = supabaseAdmin();

  await supabase.from("email_tracking_events").insert({
    comm_id: commId,
    email,
    event: "open",
    user_agent: req.headers.get("user-agent") || "unknown",
    ip: getIp(req),
  });

  return new NextResponse(PIXEL, {
    headers: {
      "content-type": "image/gif",
      "cache-control": "no-store, max-age=0",
    },
  });
}
