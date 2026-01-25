import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET() {
  try {
    rateLimitOrThrow("admin_list_investors", 120, 60_000);
  } catch {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("investors")
    .select("full_name,email,role,firm,approved_at,nda_accepted_at,created_at")
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
