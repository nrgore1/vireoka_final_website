import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET() {
  const report: any = { ok: true, checks: {} };

  function checkEnv(name: string) {
    report.checks[name] = Boolean(process.env[name]);
    if (!process.env[name]) report.ok = false;
  }

  // Supabase
  checkEnv("NEXT_PUBLIC_SUPABASE_URL");
  checkEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  checkEnv("SUPABASE_SERVICE_ROLE_KEY");

  // Resend
  checkEnv("RESEND_API_KEY");
  checkEnv("RESEND_FROM");

  // Airtable / HubSpot (adapt names to your project)
  checkEnv("AIRTABLE_API_KEY");
  checkEnv("AIRTABLE_BASE_ID");
  checkEnv("HUBSPOT_ACCESS_TOKEN");

  // Minimal Supabase connectivity test
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      );
      const { error } = await sb.from("investor_applications").select("id").limit(1);
      report.checks.supabase_query = !error;
      if (error) {
        report.ok = false;
        report.checks.supabase_error = error.message;
      }
    }
  } catch (e: any) {
    report.ok = false;
    report.checks.supabase_query = false;
    report.checks.supabase_error = e?.message ?? String(e);
  }

  return NextResponse.json(report, { status: report.ok ? 200 : 500 });
}
