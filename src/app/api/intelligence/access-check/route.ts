import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  try {
    // Lazy import prevents module-eval crash returning HTML
    const { accessCheck } = await import("@/agents/investor/investorManagerAgent");
    const result = await accessCheck();
    return json(200, result);
  } catch (e: any) {
    return json(500, {
      ok: false,
      state: "error",
      message: "access-check crashed",
      detail: String(e?.message ?? e),
    });
  }
}
