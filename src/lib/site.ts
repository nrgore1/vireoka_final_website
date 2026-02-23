export type NavItem = {
  label: string;
  href: string;
};

export type SiteInfo = {
  name: string;
  url: string;
  nav: NavItem[];
  footer: {
    legal: string;
    copyright: string;
  };
};

const year = new Date().getFullYear();

export const site: SiteInfo = {
  name: "Vireoka",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000",

  nav: [
    { label: "Leadership", href: "/leadership" },
    { label: "Resources", href: "/resources" },
    { label: "Trust", href: "/trust" },
    { label: "Investors", href: "/intelligence" },
  ],

  footer: {
    legal:
      "Vireoka is committed to safety, responsible AI use, and ethical governance.",
    copyright: `© ${year} Vireoka. All rights reserved.`,
  },
};

export function siteUrl(): URL {
  try {
    return new URL(site.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}
