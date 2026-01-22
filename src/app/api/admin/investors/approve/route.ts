export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdminToken } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  if (!requireAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, admin } = await req.json();
  const supabase = supabaseAdmin();

  await supabase
    .from("investors")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: admin,
    })
    .eq("email", email);

  await supabase.from("audit_logs").insert({
    actor_email: admin,
    action: "approve_investor",
    target: email,
  });

  return NextResponse.json({ ok: true });
}
