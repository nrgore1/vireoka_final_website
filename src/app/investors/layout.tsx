import type { Metadata } from "next";
import InvestorNav from "./components/InvestorNav";
import Watermark from "./components/Watermark";

export const metadata: Metadata = {
  title: "Vireoka — Investor Materials",
  robots: { index: false, follow: false },
};

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InvestorNav />
      <Watermark />
      <main>{children}</main>
    </>
  );
}
