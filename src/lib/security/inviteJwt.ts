import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

function getSecret() {
  const secret =
    process.env.INVESTOR_INVITE_TOKEN_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "";
  if (!secret) {
    throw new Error(
      "Missing token secret. Set INVESTOR_INVITE_TOKEN_SECRET (recommended) or ADMIN_SESSION_SECRET."
    );
  }
  return encoder.encode(secret);
}

export type InfoRequestTokenPayload = {
  purpose: "info_request";
  application_id: string;
  email: string;
};

export async function signInfoRequestToken(
  payload: InfoRequestTokenPayload,
  expiresIn: string = "7d"
) {
  const secret = getSecret();
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyInfoRequestToken(token: string) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

  const purpose = String((payload as any).purpose || "");
  if (purpose !== "info_request") throw new Error("Invalid token purpose");

  const application_id = String((payload as any).application_id || "");
  const email = String((payload as any).email || "").toLowerCase();

  if (!application_id) throw new Error("Missing application_id");
  if (!email || !email.includes("@")) throw new Error("Missing email");

  return { application_id, email };
}
