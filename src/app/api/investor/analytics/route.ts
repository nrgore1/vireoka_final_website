import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";

export async function GET() {
  const supabase = getServiceSupabase();

  const { data } = await supabase.rpc("investor_analytics_summary");

  return NextResponse.json({ data });
}
