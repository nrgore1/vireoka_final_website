import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = supabaseAdmin();

  const { data: all } = await supabase
    .from("investors")
    .select("approved_at, nda_accepted_at");

  const total = all?.length ?? 0;
  const approved = (all ?? []).filter((i: any) => !!i.approved_at).length;
  const nda = (all ?? []).filter((i: any) => !!i.nda_accepted_at).length;

  return NextResponse.json({ total, approved, ndaAccepted: nda });
}
