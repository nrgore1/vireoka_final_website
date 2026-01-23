import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { revokeInvestor } from "@/lib/investorStore";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 60, windowMs: 60_000 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await revokeInvestor(parsed.data.email);
  return NextResponse.json({ ok: true });
}
