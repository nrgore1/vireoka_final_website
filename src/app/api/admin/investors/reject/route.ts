import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
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
rateLimitOrThrow("admin_reject_investor", 60, 60_000);
} catch {
return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
}

const parsed = Schema.safeParse(await req.json().catch(() => null));
if (!parsed.success) {
return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
}

const { email } = parsed.data;
const sb = supabaseAdmin();

await sb.from("investor_requests").update({ status: "rejected" }).eq("email", email);
await sb.from("investors").upsert({
email,
rejected_at: new Date().toISOString(),
approved_at: null,
});

return NextResponse.json({ ok: true });
}
