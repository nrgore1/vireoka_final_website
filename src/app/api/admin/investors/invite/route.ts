export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const { email } = await req.json();
  const supabase = supabaseAdmin();

  await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: "https://vireoka.com/intelligence",
    },
  });

  await supabase
    .from("investors")
    .update({ invited_at: new Date().toISOString() })
    .eq("email", email);

  return NextResponse.json({ ok: true });
}
