import { redirect } from "next/navigation";
import { accessCheck } from "@/agents/investor/investorManagerAgent";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const r = await accessCheck();

  if (!r.ok) {
    if (r.state === "logged_out") redirect("/intelligence/login");
    if (r.state === "pending_approval") redirect("/intelligence/pending");
    if (r.state === "terms_missing") redirect("/intelligence/terms");
    if (r.state === "nda_missing") redirect("/intelligence/nda");
    redirect("/intelligence/access-check");
  }

  return <>{children}</>;
}
