import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import {
  sendInvestorRequestConfirmation,
  sendInternalNewLeadNotification,
} from "@/lib/email/investorEmailService";

export const runtime = "nodejs";

const ALLOWED_ROLES = new Set(["advisor", "angel", "crowd", "partner"]);

function getIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

function isMissingColumnError(errMsg: string) {
  const msg = (errMsg || "").toLowerCase();
  return msg.includes("schema cache") || msg.includes("could not find the") || msg.includes("column");
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function roleLabel(v: string) {
  switch (v) {
    case "advisor":
      return "Advisor";
    case "angel":
      return "Angel Investor";
    case "crowd":
      return "Crowd Contributor";
    case "partner":
      return "Partner";
    default:
      return v;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim();
    const role = String(body.role || "").trim();
    const messageRaw = String(body.message || "").trim();

    // Friendly validation
    if (!fullName) {
      return NextResponse.json(
        { ok: false, code: "MISSING_NAME", message: "Please enter your full name." },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { ok: false, code: "MISSING_EMAIL", message: "Please enter your email address." },
        { status: 400 }
      );
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, code: "INVALID_EMAIL", message: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!company) {
      return NextResponse.json(
        {
          ok: false,
          code: "MISSING_COMPANY",
          message: 'Please enter your company / affiliation (you can write "Individual" if applicable).',
        },
        { status: 400 }
      );
    }
    if (!role || !ALLOWED_ROLES.has(role)) {
      return NextResponse.json(
        {
          ok: false,
          code: "MISSING_ROLE",
          message: "Please choose the role you’re requesting access for.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        {
          ok: false,
          code: "SERVER_MISCONFIGURED",
          message: "Server is missing required configuration. Please contact support.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const id = randomUUID();
    const referenceCode = randomUUID(); // MUST be present in every insert attempt
    const ip = getIp(req);
    const userAgent = req.headers.get("user-agent") || null;

    const message = (messageRaw ? messageRaw : null) as string | null;

    // Always include reference_code because DB requires it
    const baseRow: any = {
      id,
      kind: "REQUEST_ACCESS",
      status: "NEW",
      reference_code: referenceCode,
      full_name: fullName,
      email,
      company,
      message,
      ip,
      user_agent: userAgent,
    };

    // Try storing role_interest if the column exists; otherwise fall back safely.
    const extendedRow: any = {
      ...baseRow,
      role_interest: role,
      environment: process.env.NODE_ENV === "production" ? "production" : "development",
    };

    let { error } = await supabase.from("investor_leads").insert(extendedRow);

    if (error && isMissingColumnError(error.message)) {
      // Fallback: store role inside message while STILL including reference_code
      const roleLine = `[Requested role: ${roleLabel(role)}]`;
      const patchedMessage = baseRow.message ? `${roleLine}\n${baseRow.message}` : roleLine;

      ({ error } = await supabase
        .from("investor_leads")
        .insert({ ...baseRow, message: patchedMessage }));
    }

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          code: "LEAD_INSERT_FAILED",
          message: "We couldn’t save your request. Please try again, or contact us if this persists.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    // Email fanout (best-effort; don't fail lead capture)
    const roleLine = `Requested role: ${roleLabel(role)}`;
    const msgForInternal = message ? `${roleLine}\n\n${message}` : roleLine;

    const [investorRes, internalRes] = await Promise.all([
      sendInvestorRequestConfirmation({
        to: email,
        fullName,
        kind: "REQUEST_ACCESS",
        referenceCode,
      }),
      sendInternalNewLeadNotification({
        fullName,
        email,
        company,
        message: msgForInternal,
        kind: "REQUEST_ACCESS",
        referenceCode,
      }),
    ]);

    // Best-effort audit updates
    const updatePatch: any = {};
    if (investorRes.ok) updatePatch.investor_confirm_email_sent_at = new Date().toISOString();
    else updatePatch.investor_confirm_email_error = investorRes.error;

    if (internalRes.ok) updatePatch.internal_notify_email_sent_at = new Date().toISOString();
    else updatePatch.internal_notify_email_error = internalRes.error;

    if (Object.keys(updatePatch).length) {
      await supabase.from("investor_leads").update(updatePatch).eq("id", id);
    }

    return NextResponse.json({
      ok: true,
      id,
      referenceCode,
      role,
      fanout: {
        investorEmail: investorRes,
        internalEmail: internalRes,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Something went wrong on the server. Please try again.",
        detail: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
