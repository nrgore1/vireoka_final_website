export type SiteInfo = {
  name: string;
  url: string;
};

export const site: SiteInfo = {
  name: "Vireoka",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000",
};

export function siteUrl(): URL {
  try {
    return new URL(site.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}
