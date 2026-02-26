import { redirect } from "next/navigation";
import Link from "next/link";
import { getInvestorEmail } from "@/lib/investorSession";
import { PortalNav } from "@/components/PortalNav";

export default async function IntelligencePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getInvestorEmail();
  if (!email) redirect("/intelligence/request-access");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Vireoka Intelligence Portal</h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {email}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link className="text-sm font-semibold text-vireoka-indigo hover:underline" href="/intelligence">
            Public Intelligence
          </Link>
          <form action="/api/investors/logout" method="post">
            <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <PortalNav />
      {children}
    </div>
  );
}
