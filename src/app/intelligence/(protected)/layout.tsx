import { redirect } from "next/navigation";
import { getInvestorSession } from "@/lib/auth/serverSession";

async function getAccessState() {
  // Use the existing centralized access-check API to avoid duplicating logic
  const res = await fetch("http://localhost:3000/api/intelligence/access-check", {
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, state: "error" as const };
  }

  const data: any = await res.json().catch(() => null);
  return data || { ok: false, state: "error" as const };
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInvestorSession();

  // If not logged in -> go to access-check (it will route correctly)
  if (!session.ok) {
    redirect("/intelligence/access-check");
  }

  // If logged in, enforce NDA/Terms/Role via access-check state
  const r: any = await getAccessState();

  if (!r?.ok) {
    const state = r?.state;

    if (state === "logged_out") redirect("/intelligence/login");
    if (state === "terms_missing" || state === "terms_required") redirect("/intelligence/terms");
    if (state === "nda_missing" || state === "nda_required") redirect("/intelligence/nda");
    if (state === "role_denied") redirect("/intelligence/not-authorized");

    // Fallback
    redirect("/intelligence/access-check");
  }

  return <>{children}</>;
}
