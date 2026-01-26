"use client";

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { getActiveNdaTemplate } from '@/lib/investor/rpc';

/**
 * NDA Viewer
 *
 * - Client component (uses hooks)
 * - Renders active NDA template from DB
 * - No hardcoded NDA content
 */
export function NdaViewer() {
  const [html, setHtml] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      try {
        const tpl = await getActiveNdaTemplate(supabase);
        if (!tpl) {
          setHtml('<p>No active NDA available.</p>');
        } else {
          setHtml(tpl.content_html);
        }
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load NDA');
      }
    })();
  }, []);

  if (err) {
    return (
      <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        Error: {err}
      </div>
    );
  }

  if (!html) return null;

  return (
    <div
      style={{ padding: 12 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
