import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { verifyInvestorSession } from "@/lib/investorSession";
import { getSupabase } from "@/lib/supabase";

const Schema = z.object({
  analytics_enabled: z.boolean(),
});

export async function POST(req: Request) {
  const sess = await verifyInvestorSession();
  if (!sess) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = getSupabase();

  await supabase
    .from("investors")
    .update({
      analytics_enabled: parsed.data.analytics_enabled,
    })
    .eq("email", sess.email);

  return NextResponse.json({ ok: true });
}
