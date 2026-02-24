import { NextResponse } from "next/server";
import { accessCheck } from "@/agents/investor/investorManagerAgent";

export async function GET() {
  try {
    const result = await accessCheck();
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        state: "denied",
        message: "access-check crashed",
        error: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}
