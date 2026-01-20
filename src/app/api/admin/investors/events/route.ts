import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: Request) {
  await requireAdmin(req);

  const key =
    "admin:events:" + (req.headers.get("x-forwarded-for") || "local");

  if (!rateLimit(key, { max: 120, windowMs: 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429 }
    );
  }

  const email = new URL(req.url).searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Missing email" },
      { status: 400 }
    );
  }

  const { data } = await supabase
    .from("investor_events")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(500);

  return NextResponse.json({ ok: true, events: data ?? [] });
}
