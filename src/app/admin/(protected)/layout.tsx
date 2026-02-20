import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,email")
    .eq("id", auth.user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/not-authorized");

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Admin</h1>
        <form action="/admin/logout" method="post">
          <button style={{ padding: "8px 12px", cursor: "pointer" }}>
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
