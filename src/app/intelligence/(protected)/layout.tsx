import { redirect } from "next/navigation";
import { getInvestorSession } from "@/lib/auth/serverSession";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInvestorSession();

  // Not logged in / invalid session -> route to access-check (safe branching)
  if (!session.ok) {
    redirect("/intelligence/access-check");
  }

  return <>{children}</>;
}
