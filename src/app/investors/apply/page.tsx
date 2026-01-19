import type { Metadata } from "next";
import InvestorApplyClient from "./ApplyClient";

export const metadata: Metadata = {
  title: "Investor Application — Vireoka",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InvestorApplyPage() {
  return <InvestorApplyClient />;
}
