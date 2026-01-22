export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { revokeInvestor } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 30, windowMs: 60_000 });

  const body = Schema.parse(await req.json());
  await revokeInvestor(body.email);

  return NextResponse.json({ ok: true });
}
