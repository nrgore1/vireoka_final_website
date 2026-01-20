import crypto from "crypto";

export const adminCookieName = "vireoka_admin";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;

type AdminPayload = {
  iat: number;
};

export async function signAdminSession(
  password: string
): Promise<string | null> {
  if (!ADMIN_PASSWORD || !SESSION_SECRET) {
    throw new Error("Admin auth is not configured");
  }

  if (password !== ADMIN_PASSWORD) {
    return null;
  }

  const payload: AdminPayload = {
    iat: Date.now(),
  };

  const payloadJson = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadJson)
    .digest("hex");

  return (
    Buffer.from(payloadJson).toString("base64") + "." + signature
  );
}

export async function verifyAdminSession(
  token: string | undefined | null
): Promise<boolean> {
  if (!token || !SESSION_SECRET) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let payloadJson: string;
  try {
    payloadJson = Buffer.from(payloadB64, "base64").toString("utf8");
  } catch {
    return false;
  }

  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadJson)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}
