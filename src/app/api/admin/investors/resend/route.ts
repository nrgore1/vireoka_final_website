export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/supabase/admin";
import {
  emailRequestReceived,
  emailApproved,
  emailRejected,
  emailFollowUp,
} from "@/lib/notify";

export async function POST(req: Request) {
  if (!requireAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const email = String(form.get("email"));
  const type = String(form.get("type"));

  if (type === "request_received") await emailRequestReceived(email);
  else if (type === "approved") await emailApproved(email);
  else if (type === "rejected") await emailRejected(email);
  else if (type === "follow_up") await emailFollowUp(email);

  return NextResponse.redirect(
    new URL(`/admin/intelligence/${encodeURIComponent(email)}/timeline`, req.url)
  );
}
