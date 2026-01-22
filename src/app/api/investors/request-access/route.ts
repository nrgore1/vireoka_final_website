export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailRequestReceived } from "@/lib/notify";

export async function POST(req: Request) {
  const { email, firm, message } = await req.json();
  const supabase = supabaseAdmin();

  // upsert pending (avoid duplicates)
  await supabase.from("investors").upsert(
    { email, status: "pending" },
    { onConflict: "email" }
  );

  // optional: store firm/message in audit logs if you want
  // (keeping it minimal here)

  await emailRequestReceived(email);

  return NextResponse.json({ ok: true });
}
