"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function InvestorGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const supabase = supabaseClient();
      const { data } = await supabase.auth.getUser();

      if (!data.user?.email) {
        setAllowed(false);
        return;
      }

      // Ask server if this investor is approved
      const res = await fetch("/api/investors/check");
      setAllowed(res.ok);
    };

    check();
  }, []);

  if (allowed === null) return null;

  if (!allowed) {
    return (
      <div style={{ maxWidth: 520, margin: "120px auto", textAlign: "center" }}>
        <h1>Investor Access</h1>
        <p>This section is available to approved investors only.</p>
      </div>
    );
  }

  return <>{children}</>;
}
