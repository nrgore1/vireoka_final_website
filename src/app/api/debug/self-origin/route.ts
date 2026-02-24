import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const h = await headers();

  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const xfProto = h.get("x-forwarded-proto") || "";

  const proto =
    xfProto || (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  const originOverride =
    process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || process.env.SITE_ORIGIN?.trim() || "";

  const computedOrigin = originOverride
    ? originOverride.replace(/\/$/, "")
    : host
    ? `${proto}://${host}`
    : "";

  return NextResponse.json({
    ok: true,
    host,
    xfProto: xfProto || null,
    protoChosen: proto,
    originOverride: originOverride || null,
    computedOrigin,
  });
}
