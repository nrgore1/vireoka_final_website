export function NdaViewer() {
  const embedUrl = process.env.NEXT_PUBLIC_SIGNWELL_NDA_EMBED_URL || "";
  const pdfUrl = process.env.NEXT_PUBLIC_SIGNWELL_NDA_PDF_URL || "";

  const src = embedUrl || pdfUrl;

  if (!src) {
    return (
      <div className="text-sm text-neutral-700">
        No NDA source configured. Please set{" "}
        <code className="rounded bg-neutral-100 px-1">NEXT_PUBLIC_SIGNWELL_NDA_EMBED_URL</code>{" "}
        (preferred) or{" "}
        <code className="rounded bg-neutral-100 px-1">NEXT_PUBLIC_SIGNWELL_NDA_PDF_URL</code>.
      </div>
    );
  }

  const isPdf = (!embedUrl && !!pdfUrl) || src.toLowerCase().includes(".pdf");

  return (
    <div className="w-full">
      <div className="text-xs text-neutral-500 mb-2">
        {isPdf ? "NDA (PDF)" : "NDA"}
      </div>

      <div className="w-full overflow-hidden rounded-lg border bg-white">
        {/* Responsive iframe */}
        <div className="relative w-full" style={{ paddingTop: "129%" }}>
          <iframe
            title="Investor NDA"
            src={src}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>

      <div className="mt-2 text-xs">
        <a className="underline" href={src} target="_blank" rel="noreferrer">
          Open NDA in a new tab
        </a>
      </div>
    </div>
  );
}
