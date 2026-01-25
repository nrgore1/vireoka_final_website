"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type Props = {
  children: React.ReactNode;
};

export default function InvestorGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        const sb = supabaseClient();
        const { data } = await sb.auth.getSession();
        if (!mounted) return;
        setAuthed(Boolean(data.session));
      } catch {
        if (!mounted) return;
        setAuthed(false);
      } finally {
        if (!mounted) return;
        setReady(true);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="text-sm text-slate-600">Loading…</div>
        </div>
      </div>
    );
  }

  if (authed) return <>{children}</>;

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24">
        <div className="rounded-xl border border-slate-200 bg-white p-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
            Investor Access
          </h1>

          <p className="mt-3 max-w-2xl text-base text-slate-700">
            This section is available to approved investors. If you’d like access to the NDA-gated materials,
            request access below.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/request-access"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Request access
            </Link>

            <Link
              href="/investors/status"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Already approved? Check status
            </Link>
          </div>

          <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">What you’ll get</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Product demos and implementation details</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Evidence and governance workflows</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Downloadable materials and investor updates</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
