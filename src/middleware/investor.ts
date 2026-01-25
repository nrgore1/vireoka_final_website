import { NextRequest, NextResponse } from "next/server";
import { investorCookieName } from "@/lib/investorSession";

export function investorMiddleware(req: NextRequest) {
  const token = req.cookies.get(investorCookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
