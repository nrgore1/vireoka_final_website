import { NextResponse } from "next/server";
import { requireAdminFromBearer } from "@/lib/auth/requireAdminFromBearer";
import { sendNdaEmail } from "@/lib/email/sendNdaEmail";

export async function POST(req: Request) {
  const admin = await requireAdminFromBearer(req);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { email, ndaUrl } = await req.json();
  if (!email || !ndaUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await sendNdaEmail(email, ndaUrl, true);

  return NextResponse.json({ ok: true });
}
