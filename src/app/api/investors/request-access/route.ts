import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimitOrThrow } from "@/lib/rateLimit";
// IMPORTANT: explicit import (no barrel)
import { emailRequestReceived } from "@/lib/notify/index";

const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional(),
  firm: z.string().optional(),
});

export async function POST(req: Request) {
  rateLimitOrThrow("investor_request_access", 60, 60_000);

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, role, firm } = parsed.data;

  const sb = supabaseAdmin();
  await sb.from("investors").upsert(
    {
      full_name: name,
      email,
      role,
      firm,
    },
    { onConflict: "email" }
  );

  // NOW matches signature
  await emailRequestReceived({ email, name, role, firm });

  return NextResponse.json({ ok: true });
}
