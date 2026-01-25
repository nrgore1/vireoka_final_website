import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createInviteToken } from "@/lib/inviteToken";
import { sendInvestorApprovedEmail } from "@/lib/investorNotifications";
import { INVITE_TTL_HOURS } from "@/lib/nda";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    rateLimitOrThrow("admin_approve_investor", 60, 60_000);
  } catch {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = createInviteToken();
  const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const supabase = supabaseAdmin();
  await supabase
    .from("investors")
    .update({
      approved_at: new Date().toISOString(),
      invite_token: token,
      invite_token_expires_at: expiresAt,
    })
    .eq("email", parsed.data.email);

  await sendInvestorApprovedEmail(parsed.data.email, token);

  return NextResponse.json({ ok: true });
}
