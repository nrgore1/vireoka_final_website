import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  const expected = process.env.INVESTOR_PORTAL_PASSWORD;
  if (!expected) {
    // Fail closed if misconfigured
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (typeof password !== "string" || password.length < 4) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // Constant-time-ish compare
  const a = Buffer.from(password);
  const b = Buffer.from(expected);

  if (a.length !== b.length) return NextResponse.json({ ok: false }, { status: 401 });

  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];

  if (diff !== 0) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({ ok: true });
}
