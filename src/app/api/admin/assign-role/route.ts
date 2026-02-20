import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { requireAdminFromBearer } from "@/lib/auth/requireAdminFromBearer";

export async function POST(req: Request) {
  const admin = await requireAdminFromBearer(req);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { userId, role } = await req.json();
  if (!userId || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  await supabase.from("user_roles").upsert({
    user_id: userId,
    role,
  });

  return NextResponse.json({ ok: true });
}
