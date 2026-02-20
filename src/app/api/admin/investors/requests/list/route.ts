import { NextResponse } from "next/server";
import { requireAdminOrThrow } from "@/lib/adminGuard";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
try {
await requireAdminOrThrow();

const sb = supabaseAdmin();
const { data, error } = await sb
  .from("investor_requests")
  .select("*")
  .order("created_at", { ascending: false });

if (error) {
  return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}

return NextResponse.json({ ok: true, requests: data ?? [] });


} catch (e: any) {
const msg = String(e?.message || e);
const code = msg === "UNAUTHORIZED" ? 401 : 500;
return NextResponse.json({ ok: false, error: code === 401 ? "Unauthorized" : "Server error" }, { status: code });
}
}
