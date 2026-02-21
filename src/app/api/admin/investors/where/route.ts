import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get("email") || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Missing ?email=" }, { status: 400 });
  }

  // Verify admin session via cookie auth
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

  const { data: auth } = await sessionClient.auth.getUser();
  if (!auth?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Optional allowlist
  const allowlist = process.env.ADMIN_EMAIL_ALLOWLIST?.trim();
  if (allowlist) {
    const allowed = allowlist
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const u = (auth.user.email || "").toLowerCase();
    if (!allowed.includes(u)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
  }

  const sb = supabaseAdmin();

  const [investors, leads, requests, apps] = await Promise.all([
    sb.from("investors").select("*").eq("email", email),
    sb.from("investor_leads").select("*").eq("email", email),
    sb.from("investor_requests").select("*").eq("email", email),
    sb.from("investor_applications").select("*").eq("email", email).order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    ok: true,
    email,
    counts: {
      investors: investors.data?.length ?? 0,
      investor_leads: leads.data?.length ?? 0,
      investor_requests: requests.data?.length ?? 0,
      investor_applications: apps.data?.length ?? 0,
    },
    found: {
      investors: investors.data ?? [],
      investor_leads: leads.data ?? [],
      investor_requests: requests.data ?? [],
      investor_applications: apps.data ?? [],
    },
    errors: {
      investors: investors.error?.message ?? null,
      investor_leads: leads.error?.message ?? null,
      investor_requests: requests.error?.message ?? null,
      investor_applications: apps.error?.message ?? null,
    },
  });
}
