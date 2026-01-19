import { NextResponse } from "next/server";
import { z } from "zod";
import { listInvestors, approveInvestor, rejectInvestor } from "@/lib/investorStore";
import { requireAdminToken } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");
  requireAdminToken(token);
  const rows = listInvestors();
  return NextResponse.json({ ok: true, investors: rows });
}

const ApproveSchema = z.object({ email: z.string().email(), ttlDays: z.number().int().min(1).max(60) });
export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  requireAdminToken(token);

  const body = await req.json().catch(() => null);
  const action = (body?.action as string | undefined) || "";

  if (action === "approve") {
    const parsed = ApproveSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    const rec = approveInvestor(parsed.data.email, parsed.data.ttlDays);
    return NextResponse.json({ ok: true, investor: rec });
  }

  if (action === "reject") {
    const parsed = z.object({ email: z.string().email() }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const rec = rejectInvestor(parsed.data.email);
    return NextResponse.json({ ok: true, investor: rec });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
