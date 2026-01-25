import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { rejectInvestor } from "@/lib/investorStore";

const Schema = z.object({
  email: z.string().email(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  await requireAdmin();

  const body = await req.json();
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Reject is a command; reason can be logged later if needed
  await rejectInvestor(parsed.data.email.toLowerCase());

  return NextResponse.json({ ok: true });
}
