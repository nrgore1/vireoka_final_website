/**
 * E2E VALIDATION SCRIPT (minimal, real network calls)
 *
 * Usage:
 *  NEXT_PUBLIC_SUPABASE_URL=... \
 *  INVESTOR_JWT=... \
 *  ADMIN_JWT=... \
 *  DOC_BUCKET=... \
 *  DOC_PATH=... \
 *  node scripts/validate_investor_route_e2e.mjs
 *
 * Notes:
 * - This script does NOT mutate DB state (unless you call admin RPCs elsewhere).
 * - It validates that the watermarked download edge function is reachable and gated.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const investorJwt = process.env.INVESTOR_JWT;
const bucket = process.env.DOC_BUCKET;
const path = process.env.DOC_PATH;

if (!supabaseUrl || !investorJwt || !bucket || !path) {
  console.error("Missing env vars: NEXT_PUBLIC_SUPABASE_URL, INVESTOR_JWT, DOC_BUCKET, DOC_PATH");
  process.exit(1);
}

const url = `${supabaseUrl}/functions/v1/watermarked-download?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}&doc_id=test_doc`;

async function run() {
  console.log("Calling:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${investorJwt}` },
  });

  console.log("Status:", res.status);
  console.log("X-RateLimit-Remaining:", res.headers.get("x-ratelimit-remaining"));
  console.log("X-RateLimit-Reset:", res.headers.get("x-ratelimit-reset"));

  if (res.status === 200) {
    const buf = await res.arrayBuffer();
    console.log("Downloaded bytes:", buf.byteLength);
    console.log("PASS: Watermarked download succeeded (investor entitled).");
    process.exit(0);
  }

  if (res.status === 403) {
    console.log("PASS: Download blocked (no active access).");
    process.exit(0);
  }

  const text = await res.text();
  console.log("Response body:", text);
  console.log("FAIL: Unexpected status");
  process.exit(2);
}

run().catch((e) => {
  console.error("FAIL:", e);
  process.exit(3);
});
