import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { rateLimit } from "@/lib/rateLimit";

const Schema = z.object({
  event: z.enum(EVENT_TYPES),
  path: z.string().optional(),
});

export async function POST(req: Request) {
  const key =
    "investor:event:" +
    (req.headers.get("x-forwarded-for") || "local");

  if (!rateLimit(key, { max: 120, windowMs: 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await supabase.from("investor_events").insert({
    event: parsed.data.event,
    path: parsed.data.path ?? null,
  });

  return NextResponse.json({ ok: true });
}

  // -----------------------
  // Suspicious behavior detection
  // -----------------------
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();

  const { count } = await supabase
    .from("investor_events")
    .select("*", { count: "exact", head: true })
    .eq("email", investor?.email)
    .gt("created_at", oneMinuteAgo);

  if ((count ?? 0) > 30 && investor?.email) {
    await supabase.from("investor_audit").insert({
      email: investor.email,
      action: "SUSPICIOUS_ACTIVITY",
      meta: {
        count,
        window: "60s",
        threshold: 30,
      },
    });
  }


  // -----------------------
  // Privacy: analytics opt-out
  // -----------------------
  const { data: prefs } = await supabase
    .from("investor_preferences")
    .select("analytics_enabled")
    .eq("email", investor?.email)
    .single();

  if (prefs?.analytics_enabled === false) {
    return NextResponse.json({ ok: true, skipped: "analytics_disabled" });
  }

