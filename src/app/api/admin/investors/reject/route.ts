export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdminToken } from "@/lib/supabase/admin";
import { emailRejected } from "@/lib/notify";

export async function POST(req: Request) {
  if (!requireAdminToken(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json();
  const supabase = supabaseAdmin();

  await supabase.from("investors").update({ status: "revoked" }).eq("email", email);
  await emailRejected(email);

  return NextResponse.json({ ok: true });
}
