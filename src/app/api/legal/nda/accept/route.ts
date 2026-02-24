import { NextResponse } from "next/server";
import { acceptNda } from "@/agents/nda/ndaAgent";

export async function POST() {
  acceptNda();
  return NextResponse.json({ ok: true });
}
