import type { Metadata } from "next";
import { baseMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = baseMetadata({
  title: {
    default: "Vireoka",
    template: "%s | Vireoka",
  },
  description: "Vireoka",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
