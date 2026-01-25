import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailRequestReceived } from "@/lib/notify";

const Schema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string().optional(),
  firm: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, role, firm, notes } = parsed.data;
  const supabase = supabaseAdmin();

  await supabase.from("investors").upsert({
    email,
    full_name: name,
    role,
    firm,
    notes,
    approved_at: null,
    nda_accepted_at: null,
  });

  await emailRequestReceived({ email, name, role, firm });

  return NextResponse.json({ ok: true });
}
