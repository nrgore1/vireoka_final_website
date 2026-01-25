import { redirect } from "next/navigation";
import { verifyInvestorSession } from "@/lib/investorSession";
import { assertInvestorAccess } from "@/lib/investorAccess";

export default async function InvestorsProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sess = await verifyInvestorSession();
  if (!sess) redirect("/investors/request");

  try {
    await assertInvestorAccess(sess.email);
  } catch (e: any) {
    if (e.message === "PENDING_REVIEW") redirect("/investors/pending");
    if (e.message === "NDA_REQUIRED") {
      redirect(`/investors/accept?token=${encodeURIComponent(sess.token)}`);
    }
    redirect("/investors/request");
  }

  return <>{children}</>;
}
