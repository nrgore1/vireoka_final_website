import { NextResponse } from "next/server";
import { acceptTerms } from "@/agents/terms/termsAgent";

export async function POST() {
  acceptTerms();
  return NextResponse.json({ ok: true });
}
