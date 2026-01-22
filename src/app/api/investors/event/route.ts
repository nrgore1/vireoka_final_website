export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { logInvestorEvent } from "@/lib/investorEvents";

export async function POST(req: Request) {
  // 🔒 Rate limit per IP automatically
  rateLimitOrThrow(req, {
    max: 300,
    windowMs: 60_000,
  });

  const body = await req.json();

  await logInvestorEvent({
    email: body.email,
    type: body.type,
    path: body.path,
    meta: body.meta ?? null,
  });

  return NextResponse.json({ ok: true });
}
