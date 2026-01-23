export const runtime = "nodejs";

import { NextResponse } from "next/server";
<<<<<<< HEAD
import {
  listInvestors,
  approveInvestor,
  revokeInvestor,
} from "@/lib/investorStore";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
=======
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
>>>>>>> rebuild-forward
import { rateLimitOrThrow } from "@/lib/rateLimit";
import {
  listInvestors,
  approveInvestor,
  revokeInvestor,
} from "@/lib/investorStore";

const ApproveSchema = z.object({
  email: z.string().email(),
});

export async function GET(req: Request) {
<<<<<<< HEAD
=======
  // Auth
>>>>>>> rebuild-forward
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

<<<<<<< HEAD
  rateLimitOrThrow(req, { max: 120, windowMs: 60_000 });

  const rows = await listInvestors();
  return NextResponse.json({ ok: true, rows });
}

export async function POST(req: Request) {
=======
  // Rate limit
  rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });

  const data = await listInvestors();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  // Auth
>>>>>>> rebuild-forward
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

<<<<<<< HEAD
  rateLimitOrThrow(req, { max: 30, windowMs: 60_000 });

  const { action, email } = await req.json();

  if (action === "approve") {
    await approveInvestor(email);
  } else if (action === "revoke") {
    await revokeInvestor(email);
  }

=======
  // Rate limit
  rateLimitOrThrow(req, {
    max: 60,
    windowMs: 60_000,
  });

  const body = await req.json();
  const parsed = ApproveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await approveInvestor(parsed.data.email);
>>>>>>> rebuild-forward
  return NextResponse.json({ ok: true });
}
