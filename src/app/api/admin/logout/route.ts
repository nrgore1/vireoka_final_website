export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/adminSession";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  clearAdminSessionCookie(res);
  return res;
}
