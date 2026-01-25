import { NextResponse } from "next/server";
import { z } from "zod";
import { recomputeEngagementScore } from "@/lib/engagementScore";
import { supabaseAdmin } from "@/lib/supabase/admin";

const Schema = z.object({
  email: z.string().email(),
  path: z.string().min(1),
});

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { email, path } = parsed.data;

  const supabase = supabaseAdmin();
  await supabase.from("investor_events").insert({
    email: email.toLowerCase(),
    path,
  });

  await recomputeEngagementScore(email.toLowerCase());

  return NextResponse.json({ ok: true });
}
