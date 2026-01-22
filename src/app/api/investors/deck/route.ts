export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { watermarkPdf } from "@/lib/pdf/watermark";
import fs from "fs/promises";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commId = searchParams.get("commId");

  if (!commId) {
    return NextResponse.json(
      { error: "Missing commId" },
      { status: 400 }
    );
  }

  // 🔐 Authenticated user only
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 🔍 Verify approved investor
  const { data: investor } = await supabase
    .from("investors")
    .select("status")
    .eq("email", user.email)
    .single();

  if (investor?.status !== "approved") {
    return NextResponse.json(
      { error: "Investor access not approved" },
      { status: 403 }
    );
  }

  // 📄 Load base investor deck
  const pdfBytes = await fs.readFile("private/investor_deck.pdf");

  // 🏷️ Watermark ties identity + time + communication
  const label = `${user.email} • ${new Date().toISOString()} • ${commId}`;

  const watermarked = await watermarkPdf(pdfBytes, label);

  return new NextResponse(watermarked, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=Vireoka-Investor-Deck.pdf",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
    },
  });
}
