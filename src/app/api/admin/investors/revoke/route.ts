export const runtime = "nodejs";

import { NextResponse } from "next/server";
<<<<<<< HEAD
import { revokeInvestor } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { z } from "zod";
=======
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { revokeInvestor } from "@/lib/investorStore";
>>>>>>> rebuild-forward

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
<<<<<<< HEAD
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 30, windowMs: 60_000 });

  const body = Schema.parse(await req.json());
  await revokeInvestor(body.email);

=======
  // Auth
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  rateLimitOrThrow(req, {
    max: 60,
    windowMs: 60_000,
  });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await revokeInvestor(parsed.data.email);
>>>>>>> rebuild-forward
  return NextResponse.json({ ok: true });
}
