import { NextResponse } from "next/server";
import { readAll } from "../_store";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();

  const all = await readAll();
  const found = all.find((r) => r.email === email);

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px;max-width:720px;margin:0 auto;">
  <h1 style="margin:0 0 12px 0;">Investor request status</h1>
  ${
    !found
      ? `<p>No request found for <strong>${email}</strong>.</p>
         <p><a href="/investors/apply">Request access</a></p>`
      : `<p><strong>${found.email}</strong></p>
         <p>Status: <strong>${found.status}</strong></p>
         <p>Next step: ${
           found.status === "submitted"
             ? `Review NDA: <a href="/investors/nda">NDA page</a>`
             : `Login: <a href="/investors/login">Investor login</a>`
         }</p>`
  }
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
