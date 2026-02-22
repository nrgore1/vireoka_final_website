import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Compatibility endpoint.
 * The UI posts to /api/investor-applications, but the existing working backend
 * likely lives at /api/investors/request-access.
 *
 * This route forwards the request and maps field names safely.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Map the newer apply payload to the existing endpoint fields.
    const mapped = {
      fullName: body?.investor_name ?? body?.fullName ?? body?.name ?? "",
      email: body?.email ?? "",
      company: body?.organization ?? body?.company ?? "",
      role: body?.role ?? "",
      investor_type: body?.investor_type ?? body?.investorType ?? "",
      check_size: body?.check_size ?? "",
      horizon: body?.horizon ?? "",
      message: body?.intent ?? body?.message ?? "",
      // keep any other fields in case backend stores metadata
      ...body,
    };

    // Forward to existing endpoint on the same host
    const url = new URL(req.url);
    url.pathname = "/api/investors/request-access";

    const r = await fetch(url.toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mapped),
    });

    const text = await r.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    return NextResponse.json(json, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
