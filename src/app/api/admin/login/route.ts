import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Optional hard safety rail:
 * ADMIN_EMAIL_ALLOWLIST="admin@vireoka.com,founder@vireoka.com"
 *
 * If set, only these emails can log into /admin.
 */
function isAllowedAdminEmail(email: string) {
  const allowlist = process.env.ADMIN_EMAIL_ALLOWLIST?.trim();
  if (!allowlist) return true; // if not set, do not block
  const allowed = allowlist
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Not authorized for admin access." },
        { status: 403 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { ok: false, error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    // We must create the response first so we can attach cookies to it.
    const res = NextResponse.json({ ok: true });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data?.user) {
      return NextResponse.json(
        { ok: false, error: error?.message ?? "Invalid credentials." },
        { status: 401 }
      );
    }

    // Extra safety: if allowlist is set but user email differs (shouldn't),
    // block and sign out.
    if (!isAllowedAdminEmail(data.user.email ?? "")) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { ok: false, error: "Not authorized for admin access." },
        { status: 403 }
      );
    }

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Login failed." },
      { status: 500 }
    );
  }
}
