import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { rateLimit } from "@/lib/rateLimit";

const Schema = z.object({
  event: z.enum(EVENT_TYPES),
  path: z.string().max(512),
});

export async function POST(req: Request) {
  // -----------------------
  // Rate limit (by IP)
  // -----------------------
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";

  const key = `investor:event:${ip}`;
  if (!rateLimit(key, 300, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429 }
    );
  }

  // -----------------------
  // Parse body
  // -----------------------
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  // -----------------------
  // Supabase (safe pattern)
  // -----------------------
  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    // Allow local dev without analytics infra
    return NextResponse.json({ ok: true, skipped: "no_supabase" });
  }

  // -----------------------
  // Privacy check
  // -----------------------
  const cookie = req.headers.get("cookie") ?? "";
  const emailMatch = cookie.match(/investor_email=([^;]+)/);
  const email = emailMatch?.[1];

  if (!email) {
    return NextResponse.json({ ok: true, skipped: "no_email" });
  }

  const { data: prefs } = await supabase
    .from("investor_preferences")
    .select("analytics_enabled")
    .eq("email", email)
    .single();

  if (prefs?.analytics_enabled === false) {
    return NextResponse.json({
      ok: true,
      skipped: "analytics_disabled",
    });
  }

  // -----------------------
  // Persist event
  // -----------------------
  await supabase.from("investor_events").insert({
    email,
    event: parsed.data.event,
    path: parsed.data.path,
  });

  return NextResponse.json({ ok: true });
}
