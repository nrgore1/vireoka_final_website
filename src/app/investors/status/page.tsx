import type { Metadata } from "next";
import InvestorStatusClient from "./StatusClient";

export const metadata: Metadata = {
  title: "Investor Status — Vireoka",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InvestorStatusPage() {
  return <InvestorStatusClient />;
}
