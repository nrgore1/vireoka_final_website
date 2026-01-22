export const runtime = "nodejs";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("investors").select("*");

  const headers = Object.keys(data?.[0] || {}).join(",");
  const rows = data?.map((row) =>
    Object.values(row).map(v => `"${v ?? ""}"`).join(",")
  );

  const csv = [headers, ...(rows || [])].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=investors.csv",
    },
  });
}
