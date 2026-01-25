import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CURRENT_NDA_VERSION } from "@/lib/nda";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const Schema = z.object({
  token: z.string().min(10),
  signatureName: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    rateLimitOrThrow("nda_accept", 60, 60_000);
  } catch {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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

  const ua = req.headers.get("user-agent") || null;

  await supabase
    .from("investors")
    .update({
      nda_accepted_at: new Date().toISOString(),
      nda_version_accepted: CURRENT_NDA_VERSION,
      nda_signature_name: parsed.data.signatureName,
      nda_signature_user_agent: ua,
    })
    .eq("email", inv.email);

  await supabase.from("investor_audit").insert({
    email: inv.email,
    action: "NDA_ACCEPTED",
    meta: { version: CURRENT_NDA_VERSION, signatureName: parsed.data.signatureName },
  });

  return NextResponse.json({ ok: true });
}
