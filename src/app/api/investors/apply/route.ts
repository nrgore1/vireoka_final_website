export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrGetInvestor, audit } from "@/lib/investorStore";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

const Schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  role: z.string().min(2),
  firm: z.string().min(2),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const inv = await createOrGetInvestor(parsed.data);

  const sb = supabaseAdmin();
  await sb.from("investor_events").insert({
    email: inv.email,
    event: "APPLY",
    path: "/investors",
    meta: { firm: inv.firm, role: inv.role },
  });

  await audit(inv.email, "APPLIED", { firm: inv.firm, role: inv.role });

  // Notify admin (optional)
  const adminTo = process.env.INVESTOR_FROM_EMAIL;
  if (adminTo) {
    await sendEmail({
      to: adminTo,
      subject: `Investor request: ${inv.full_name} (${inv.email})`,
      html: `<p>New investor access request.</p>
             <ul>
               <li><b>Name:</b> ${inv.full_name ?? ""}</li>
               <li><b>Email:</b> ${inv.email}</li>
               <li><b>Role:</b> ${inv.role ?? ""}</li>
               <li><b>Firm:</b> ${inv.firm ?? ""}</li>
             </ul>
             <p>Review in admin dashboard.</p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
