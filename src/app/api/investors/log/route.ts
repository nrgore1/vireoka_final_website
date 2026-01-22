import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: Request) {
  const { email, path, event } = await req.json();
  if (!email || !path || !event) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = adminSupabase();
  await supabase.from("investor_access_logs").insert({
    investor_email: email,
    path,
    event,
  });

  return NextResponse.json({ ok: true });
}
