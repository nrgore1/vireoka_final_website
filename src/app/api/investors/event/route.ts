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
  const ip = req.headers.get("x-forwarded-for") || "local";
  const key = `investor:event:${ip}`;

  // ✅ Correct signature
  if (
    !rateLimit(key, {
      max: 300,
      windowMs: 60_000,
    })
  ) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429 }
    );
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    // Dev-safe: allow without analytics infra
    return NextResponse.json({ ok: true, skipped: "no_supabase" });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  const { event, path } = parsed.data;

  await supabase.from("investor_events").insert({
    event,
    path,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
