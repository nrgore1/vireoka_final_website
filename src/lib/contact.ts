export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "info@vireoka.com";

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
