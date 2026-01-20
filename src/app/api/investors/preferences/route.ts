import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifyInvestorSession } from "@/lib/investorSession";

const Schema = z.object({
  analytics: z.boolean(),
});

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vireoka_investor")?.value;
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const investor = await verifyInvestorSession(token);
  if (!investor) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await supabase
    .from("investor_preferences")
    .upsert({
      email: investor.email,
      analytics_enabled: parsed.data.analytics,
    });

  return NextResponse.json({ ok: true });
}
