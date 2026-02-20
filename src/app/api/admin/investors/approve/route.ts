import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createInviteToken } from "@/lib/inviteToken";
import { sendInvestorApprovedEmail } from "@/lib/investorNotifications";
import { INVITE_TTL_HOURS } from "@/lib/nda";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { requireAdminOrThrow } from "@/lib/adminGuard";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
try {
await requireAdminOrThrow();
} catch {
return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

try {
rateLimitOrThrow("admin_approve_investor", 60, 60_000);
} catch {
return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
}

const parsed = Schema.safeParse(await req.json().catch(() => null));
if (!parsed.success) {
return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
}

const { email } = parsed.data;

const token = createInviteToken();
const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000).toISOString();

const sb = supabaseAdmin();

// Mark request approved (if exists)
await sb.from("investor_requests").update({ status: "approved" }).eq("email", email);

// Upsert investor record + invite token
await sb.from("investors").upsert({
email,
approved_at: new Date().toISOString(),
rejected_at: null,
revoked_at: null,
expires_at: expiresAt,
});

await sb.from("investor_invites").insert({
email,
token,
expires_at: expiresAt,
});

// Send email invite (existing helper)
await sendInvestorApprovedEmail({ email, token, expiresAt });

return NextResponse.json({ ok: true });
}
