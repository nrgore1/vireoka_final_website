import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    FROM_EMAIL: process.env.FROM_EMAIL ?? null,
    INVESTOR_NOTIFY_EMAIL: process.env.INVESTOR_NOTIFY_EMAIL ?? null,
  });
}
