import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  await requireAdmin();

  const sb = supabaseAdmin();
  const { data } = await sb
    .from("investor_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ requests: data ?? [] });
}
