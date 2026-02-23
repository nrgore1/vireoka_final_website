import { supabaseServer } from "@/lib/supabase/server";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const head = user.slice(0, 2);
  const tail = user.length > 2 ? "…" : "";
  return `${head}${tail}@${domain}`;
}

export default async function Watermark() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const email = user?.email ? maskEmail(user.email) : "unknown";
  const ts = new Date().toISOString();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center opacity-[0.05]"
    >
      <div
        className="select-none text-center text-4xl font-semibold tracking-widest"
        style={{ transform: "rotate(-30deg)" }}
      >
        <div>CONFIDENTIAL · VIREOKA</div>
        <div className="mt-2 text-base font-medium tracking-normal">
          {email} · {ts}
        </div>
      </div>
    </div>
  );
}
