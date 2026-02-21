import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Admin investors API
 * - Supports internal token auth via x-admin-token (VIREOKA_ADMIN_TOKEN)
 * - Also supports cookie auth for /admin session
 * - IMPORTANT: investors table has NO `id` column (use email as unique key)
 */

function tokenAuthorized(req: NextRequest) {
  const token = req.headers.get("x-admin-token") || "";
  const expected = process.env.VIREOKA_ADMIN_TOKEN || "";
  return Boolean(expected) && token === expected;
}

async function cookieAuthorized() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = await cookies();

  const sessionClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const { data } = await sessionClient.auth.getUser();
  if (!data?.user) return false;

  // Optional allowlist safety rail
  const allowlist = process.env.ADMIN_EMAIL_ALLOWLIST?.trim();
  if (!allowlist) return true;

  const allowed = allowlist
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const email = (data.user.email || "").toLowerCase();
  return allowed.includes(email);
}

export async function GET(req: NextRequest) {
  try {
    const ok = tokenAuthorized(req) || (await cookieAuthorized());
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const sb = supabaseAdmin();

    // ✅ Never select investors.id (doesn't exist)
    // Selecting "*" is safest across schema variations.
    const { data, error } = await sb.from("investors").select("*");

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Normalize shape for UIs that expect `id`
    const investors = (data || []).map((row: any) => ({
      ...row,
      id: row.id ?? row.email, // email as stable key
    }));

    return NextResponse.json({ ok: true, investors });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
