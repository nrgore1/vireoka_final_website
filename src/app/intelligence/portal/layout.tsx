import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { accessCheck } from "@/agents/investor/investorManagerAgent";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const r = await accessCheck();

  if (!r.ok) {
    if (r.state === "logged_out") redirect("/intelligence/login");
    if (r.state === "nda_missing") redirect("/intelligence/nda");
    if (r.state === "terms_missing") redirect("/intelligence/terms");
    if (r.state === "role_denied") redirect("/intelligence/access-denied");
    redirect("/intelligence");
  }

  // ok + allowed
  return <>{children}</>;
}
