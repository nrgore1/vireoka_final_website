import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--vk-border)" }}>
      <div className="vk-container py-10 grid gap-6">
        <div className="vk-card p-5">
          <div className="text-sm font-semibold">Safety & Responsible Use</div>
          <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
            {site.footer.legal}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-sm" style={{ color: "var(--vk-muted)" }}>
            {site.footer.copyright}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a className="vk-link" href="/whitepapers">Whitepapers</a>
            <a className="vk-link" href="/trust">Trust Center</a>
            <a className="vk-link" href="/investors">Investors</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
