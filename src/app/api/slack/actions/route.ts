export const runtime = "nodejs";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = JSON.parse((await req.formData()).get("payload") as string);
  const email = payload.actions[0].value;
  const action = payload.actions[0].action_id;

  const supabase = supabaseAdmin();

  if (action === "approve_investor") {
    await supabase
      .from("investors")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("email", email);
  }

  if (action === "reject_investor") {
    await supabase
      .from("investors")
      .update({ status: "revoked" })
      .eq("email", email);
  }

  return NextResponse.json({ ok: true });
}
