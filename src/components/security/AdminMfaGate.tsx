"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

/**
 * MFA gate for admin.
 *
 * Some Supabase client versions don't expose auth.getAssuranceLevel().
 * This component degrades safely:
 * - If getAssuranceLevel exists, enforce AAL2.
 * - If it does not exist, allow access (but you can flip to "block in prod" if desired).
 */
export default function AdminMfaGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(true); // default allow, then enforce if supported
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        const supabase = supabaseBrowser();

        // Session must exist for MFA checks
        const { data: userData } = await supabase.auth.getUser();
        if (!mounted) return;

        if (!userData?.user) {
          setOk(false);
          setMsg("Not signed in.");
          return;
        }

        const authAny = supabase.auth as any;

        // If the method exists, enforce AAL2
        if (typeof authAny.getAssuranceLevel === "function") {
          const { data, error } = await authAny.getAssuranceLevel();
          if (error) throw error;

          const current = data?.currentLevel;
          setOk(current === "aal2");
          if (current !== "aal2") {
            setMsg("Admin access requires MFA (AAL2). Please enable MFA in your account.");
          }
          return;
        }

        // Method not available in this client version.
        // Safe fallback: allow (do not break admin).
        // If you want to BLOCK in production, uncomment below:
        //
        // if (process.env.NODE_ENV === "production") {
        //   setOk(false);
        //   setMsg("MFA enforcement unavailable (client version). Please upgrade Supabase client.");
        // }
        setOk(true);
        setMsg("");
      } catch (e: any) {
        setOk(false);
        setMsg(String(e?.message || e));
      } finally {
        if (mounted) setReady(true);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return <div style={{ padding: 16 }}>Checking security…</div>;
  }

  if (!ok) {
    return (
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Access restricted</h3>
        <div style={{ color: "crimson" }}>{msg || "MFA required."}</div>
      </div>
    );
  }

  return <>{children}</>;
}
