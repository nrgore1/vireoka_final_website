import { NextResponse } from "next/server";
import { z } from "zod";
import {
  listInvestors,
  approveInvestor,
  rejectInvestor,
  revokeInvestor,
  restoreInvestor,
  softDeleteInvestor,
} from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const ApproveSchema = z.object({
  email: z.string().email(),
  ttlDays: z.number().int().positive().optional(),
});

const EmailSchema = z.object({
  email: z.string().email(),
});

const RevokeSchema = z.object({
  email: z.string().email(),
  reason: z.string().optional(),
});

export async function GET(req: Request) {
  const ok = await requireAdmin(req);
  if (!ok) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limited = rateLimitOrThrow(req, { keyPrefix: "admin:investors:get", max: 120, windowMs: 60_000 });
  if (limited) return limited;

  const rows = await listInvestors({ includeDeleted: true });
  return NextResponse.json({ ok: true, investors: rows });
}

export async function POST(req: Request) {
  const ok = await requireAdmin(req);
  if (!ok) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limited = rateLimitOrThrow(req, { keyPrefix: "admin:investors:post", max: 60, windowMs: 60_000 });
  if (limited) return limited;

  const body = await req.json();
  const parsed = ApproveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const rec = await approveInvestor(parsed.data.email, parsed.data.ttlDays);
  return NextResponse.json({ ok: true, investor: rec });
}

export async function PATCH(req: Request) {
  const ok = await requireAdmin(req);
  if (!ok) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limited = rateLimitOrThrow(req, { keyPrefix: "admin:investors:patch", max: 60, windowMs: 60_000 });
  if (limited) return limited;

  const body = await req.json();
  const parsed = RevokeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const rec = await revokeInvestor(parsed.data.email, parsed.data.reason);
  return NextResponse.json({ ok: true, investor: rec });
}

export async function PUT(req: Request) {
  const ok = await requireAdmin(req);
  if (!ok) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limited = rateLimitOrThrow(req, { keyPrefix: "admin:investors:put", max: 60, windowMs: 60_000 });
  if (limited) return limited;

  const body = await req.json();
  const parsed = EmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const rec = await restoreInvestor(parsed.data.email);
  return NextResponse.json({ ok: true, investor: rec });
}

// DELETE = soft delete
export async function DELETE(req: Request) {
  const ok = await requireAdmin(req);
  if (!ok) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limited = rateLimitOrThrow(req, { keyPrefix: "admin:investors:delete", max: 30, windowMs: 60_000 });
  if (limited) return limited;

  const body = await req.json();
  const parsed = EmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  // If you still want "reject", call rejectInvestor here instead — but you asked for soft-delete.
  const rec = await softDeleteInvestor(parsed.data.email);
  return NextResponse.json({ ok: true, investor: rec });
}
import { rateLimit } from "@/lib/rateLimit";

const key = "admin:" + (req.headers.get("x-forwarded-for") || "local");
if (!rateLimit(key)) {
  return NextResponse.json({ ok: false, error: "Rate limited" }, { status: 429 });
}
