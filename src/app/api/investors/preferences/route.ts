import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { verifyInvestorSession } from "@/lib/investorSession";
import { getSupabase } from "@/lib/supabase";

const Schema = z.object({
  analytics_enabled: z.boolean(),
});

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vireoka_investor_token")?.value;

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const email = await verifyInvestorSession(token);
  if (typeof email !== "string") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    // Dev-safe: allow UI to function without infra
    return NextResponse.json({ ok: true, skipped: "no_supabase" });
  }

  await supabase
    .from("investor_preferences")
    .upsert({
      email,
      analytics_enabled: parsed.data.analytics_enabled,
    });

  return NextResponse.json({ ok: true });
}
