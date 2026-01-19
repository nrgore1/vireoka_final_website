import { teaserVideos } from "@/lib/content";

export default function VideosPage() {
  return (
    <div className="grid gap-6">
      <div>
        <div className="vk-pill">30-second Teasers</div>
        <h1 className="mt-3 text-3xl font-semibold">Videos</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          Short, confidence-building teasers. Place MP4 files in <code>/public/videos</code>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {teaserVideos.map((v) => (
          <div key={v.mp4} className="vk-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">{v.title}</div>
              <span className="vk-pill">{v.seconds ?? 30}s</span>
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>{v.summary}</p>

            <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--vk-border)" }}>
              <video
                controls
                preload="metadata"
                poster={v.poster}
                style={{ width: "100%", height: "auto", display: "block", background: "black" }}
              >
                <source src={v.mp4} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="mt-4 flex gap-3">
              <a className="vk-btn" href={v.mp4} target="_blank" rel="noreferrer">Open</a>
              <a className="vk-btn" href={v.mp4} download>Download</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
