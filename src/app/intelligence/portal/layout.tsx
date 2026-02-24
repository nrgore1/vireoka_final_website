import { redirect } from "next/navigation";
import { getInvestorSession } from "@/lib/auth/serverSession";

export default async function IntelligencePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInvestorSession();

  if (!session.ok) {
    redirect("/intelligence/access-check");
  }

  return <>{children}</>;
}
