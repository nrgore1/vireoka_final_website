import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { createInvestorSession } from "@/lib/investorSession";

const Schema = z.object({ token: z.string().min(10) });

export async function POST(req: Request) {
  try {
    rateLimitOrThrow("investor_invite_exchange", 30, 60_000);
  } catch {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: inv } = await supabase
    .from("investors")
    .select("email, approved_at, invite_token_expires_at")
    .eq("invite_token", parsed.data.token)
    .single();

  if (!inv?.email) return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  if (!inv.approved_at) return NextResponse.json({ error: "Not approved" }, { status: 403 });

  if (inv.invite_token_expires_at) {
    const exp = new Date(inv.invite_token_expires_at);
    if (Date.now() > exp.getTime()) {
      return NextResponse.json({ error: "Invite expired" }, { status: 403 });
    }
  }

  await createInvestorSession(inv.email, parsed.data.token);

  return NextResponse.json({ ok: true, email: inv.email });
}
