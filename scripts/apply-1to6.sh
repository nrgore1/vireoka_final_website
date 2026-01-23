#!/usr/bin/env bash
set -euo pipefail

echo "== Applying 1–6 hardening updates =="

# --- 1) Monorepo / Turbopack root pin (silences lockfile-root confusion) ---
# Creates/overwrites next.config.js with turbopack.root pinned to this app directory.
cat > next.config.js <<'JS'
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Pin Turbopack root to this app directory to avoid lockfile-root ambiguity.
    root: __dirname,
  },
};

module.exports = nextConfig;
JS

# --- 5) SEO metadataBase default helper ---
mkdir -p src/lib
cat > src/lib/site.ts <<'TS'
export function siteUrl(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000";

  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}
TS

# This file is safe to import from layout.tsx
cat > src/lib/metadata.ts <<'TS'
import type { Metadata } from "next";
import { siteUrl } from "./site";

export function baseMetadata(partial?: Metadata): Metadata {
  return {
    metadataBase: siteUrl(),
    ...partial,
  };
}
TS

# --- 2) Supabase admin client (real implementation, replaces stub) ---
mkdir -p src/lib/supabase
cat > src/lib/supabase/admin.ts <<'TS'
import "server-only";
import { createClient } from "@supabase/supabase-js";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function supabaseAdmin() {
  const url = mustGet("SUPABASE_URL");
  const serviceRole = mustGet("SUPABASE_SERVICE_ROLE_KEY");

  // Service-role key MUST remain server-only.
  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
TS

# --- 4) Harden admin & cron guards (minimal, production-safe) ---
# Admin token via signed cookie (HMAC). No extra deps.
cat > src/lib/adminSession.ts <<'TS'
import "server-only";
import crypto from "crypto";

export const adminCookieName = "vireoka_admin";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function b64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(payload: string, secret: string) {
  const mac = crypto.createHmac("sha256", secret).update(payload).digest();
  return b64url(mac);
}

export async function signAdminSession(email: string): Promise<string> {
  const secret = mustGet("ADMIN_SESSION_SECRET");
  const now = Date.now();
  const expMs = Number(process.env.ADMIN_SESSION_TTL_MS || 7 * 24 * 60 * 60 * 1000);

  const payloadObj = { email, iat: now, exp: now + expMs };
  const payload = b64url(Buffer.from(JSON.stringify(payloadObj)));
  const sig = sign(payload, secret);

  return `${payload}.${sig}`;
}

export async function verifyAdminSession(token: string | null): Promise<{ email: string } | null> {
  if (!token) return null;
  const secret = mustGet("ADMIN_SESSION_SECRET");

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, sig] = parts;
  const expected = sign(payload, secret);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  let obj: any = null;
  try {
    obj = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  } catch {
    return null;
  }

  if (!obj?.email || !obj?.exp) return null;
  if (Date.now() > Number(obj.exp)) return null;

  return { email: String(obj.email) };
}
TS

cat > src/lib/cronGuard.ts <<'TS'
import "server-only";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function requireCron(req: Request) {
  // Use a header token so you can call cron endpoints safely.
  const secret = mustGet("CRON_SECRET");
  const got = req.headers.get("x-cron-secret");
  if (!got || got !== secret) {
    throw new Error("Unauthorized cron");
  }
}
TS

# --- 6) Deploy-safe notify scaffold (you can later wire an SMTP provider) ---
mkdir -p src/lib
cat > src/lib/notify.ts <<'TS'
import "server-only";

/**
 * Minimal notification layer.
 * Production: wire to SMTP (Resend, Postmark, SES, etc).
 * For now: logs so builds/deploys work deterministically.
 */

function log(kind: string, to: string) {
  // eslint-disable-next-line no-console
  console.log(`[notify] ${kind} -> ${to}`);
}

export async function emailRequestReceived(email: string) {
  log("request_received", email);
}

export async function emailApproved(email: string) {
  log("approved", email);
}

export async function emailRejected(email: string) {
  log("rejected", email);
}

export async function emailFollowUp(email: string) {
  log("follow_up", email);
}
TS

echo "== 1–6 apply script completed =="
