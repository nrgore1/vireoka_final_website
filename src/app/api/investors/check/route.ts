export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data } = await supabase
    .from("investors")
    .select("status")
    .eq("email", user.email)
    .single();

  if (data?.status !== "approved") {
    return NextResponse.json({ error: "Not approved" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
