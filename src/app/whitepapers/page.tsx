import { whitepapers } from "@/lib/content";

export default function WhitepapersPage() {
  return (
    <div className="grid gap-6">
      <div>
        <div className="vk-pill">Confidence Materials</div>
        <h1 className="mt-3 text-3xl font-semibold">Whitepapers</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Technical and governance documentation designed for executives, compliance teams, engineers, and investors.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {whitepapers.map((w) => (
          <div key={w.slug} className="vk-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">{w.title}</div>
              <span className="vk-pill">Updated {w.updated}</span>
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>{w.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {w.audience.map((a) => (
                <span key={a} className="vk-pill">{a}</span>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <a className="vk-btn vk-btn-primary" href={w.file} target="_blank" rel="noreferrer">Open PDF</a>
              <a className="vk-btn" href={w.file} download>Download</a>
            </div>
          </div>
        ))}
      </div>

      <div className="vk-card p-6">
        <div className="text-sm font-semibold">Note</div>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Keep PDFs in <code>/public/docs</code>. When you move to WordPress, these same assets can be served via Media Library
          while preserving URLs (or you can set redirects).
        </p>
      </div>
    </div>
  );
}
