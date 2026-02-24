import { redirect } from "next/navigation";
import { accessCheck } from "@/agents/investor/investorManagerAgent";

export default async function AdvisorWorkspace() {
  const r = await accessCheck();
  if (!r.ok) return null;
  if (r.role !== "advisor" && r.role !== "admin") redirect("/intelligence/access-check");

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Advisor Workspace</h1>
      <p className="mt-3 text-sm text-neutral-700">
        Confidential: advisor-only materials, collaboration threads, and strategic review items.
      </p>
    </main>
  );
}
