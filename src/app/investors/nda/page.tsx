import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Investor NDA — Vireoka",
  robots: { index: false, follow: false },
};

export default async function InvestorNdaPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/login");

  const { data: nda } = await supabase
    .from("nda_versions")
    .select("version, file_path")
    .eq("active", true)
    .single();

  let signedUrl: string | null = null;
  if (nda?.file_path) {
    const { data } = await supabase.storage
      .from("nda")
      .createSignedUrl(nda.file_path, 600);
    signedUrl = data?.signedUrl || null;
  }

  async function acceptNda() {
    "use server";
    const supabase = await supabaseServer();

    await supabase
      .from("investors")
      .update({
        nda_signed: true,
        nda_signed_at: new Date().toISOString(),
        nda_version_accepted: nda?.version ?? null,
      })
      .eq("email", user!.email);

    redirect("/investors");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Investor NDA</h1>

      {signedUrl && (
        <a href={signedUrl} target="_blank" className="underline">
          View NDA (version {nda?.version})
        </a>
      )}

      <form action={acceptNda}>
        <button className="rounded bg-black px-4 py-2 text-white">
          I agree and accept
        </button>
      </form>
    </div>
  );
}
