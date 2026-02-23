import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { normalizeTier } from "@/lib/portal/tier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(sb: any, userId: string) {
  try {
    const { data } = await sb.from("profiles").select("role").eq("id", userId).maybeSingle();
    return String(data?.role || "").toLowerCase() === "admin";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const sb = await supabaseServerClient();
  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;

  if (!user) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  if (!(await isAdmin(sb as any, user.id))) {
    return NextResponse.json({ ok: false, error: "Not allowed" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const rawTier = String(body?.tier || "").trim();

  const jar = await cookies();

  if (!rawTier) {
    jar.set("vireoka_portal_preview_tier", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return NextResponse.json({ ok: true, cleared: true });
  }

  const tier = normalizeTier(rawTier);

  jar.set("vireoka_portal_preview_tier", tier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return NextResponse.json({ ok: true, tier });
}
