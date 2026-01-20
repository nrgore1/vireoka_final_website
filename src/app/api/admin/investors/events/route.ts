import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimit } from "@/lib/rateLimit";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // Auth
  requireAdmin(req);

  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "local";

  const key = `admin:events:${ip}`;
  if (!rateLimit(key, { max: 120, windowMs: 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429 }
    );
  }

  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Missing email" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { data } = await supabase
    .from("investor_events")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(500);

  return NextResponse.json({ ok: true, events: data ?? [] });
}
