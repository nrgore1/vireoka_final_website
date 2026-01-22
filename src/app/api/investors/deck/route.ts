export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { watermarkPdf } from "@/lib/pdf/watermark";
import fs from "fs/promises";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")!;
  const commId = searchParams.get("commId")!;

  const supabase = supabaseAdmin();

  const { data: investor } = await supabase
    .from("investors")
    .select("status")
    .eq("email", email)
    .single();

  if (investor?.status !== "approved") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pdfBytes = await fs.readFile("private/investor_deck.pdf");
  const label = `${email} • ${new Date().toISOString()} • ${commId}`;

  const watermarked = await watermarkPdf(pdfBytes, label);

  // ✅ Normalize to Node Buffer (kills SharedArrayBuffer issue)
  const buffer = Buffer.from(watermarked);

  const blob = new Blob([buffer], {
    type: "application/pdf",
  });

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=Vireoka-Investor-Deck.pdf",
    },
  });
}
