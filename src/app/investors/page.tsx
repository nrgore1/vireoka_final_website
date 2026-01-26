import Link from 'next/link';

export default function InvestorAccessPage() {
  return (
    <div style={{ background: '#fafafa', padding: '80px 16px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600 }}>
          Investor access <span style={{ fontWeight: 400 }}>(NDA required)</span>
        </h1>

        <p style={{ marginTop: 16, fontSize: 16, color: '#444' }}>
          We share detailed technical and financial materials with verified
          investors under NDA.
        </p>

        <p style={{ fontSize: 16, color: '#444' }}>
          Access is time-bound and reviewed manually to protect confidential IP.
        </p>

        {/* Access steps */}
        <div
          style={{
            marginTop: 40,
            padding: 32,
            borderRadius: 12,
            background: '#fff',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>
            Access steps
          </h3>

          <ol style={{ paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Apply with your investor details</li>
            <li>Review and accept the NDA</li>
            <li>Await approval (manual review)</li>
            <li>Access granted (time-bound)</li>
          </ol>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <Link href="/investors/apply">
              <button
                style={{
                  padding: '10px 18px',
                  background: '#111827',
                  color: '#fff',
                  borderRadius: 6,
                  border: 'none',
                }}
              >
                Apply
              </button>
            </Link>

            <Link href="/investors/status">
              <button
                style={{
                  padding: '10px 18px',
                  background: '#fff',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                }}
              >
                Check status
              </button>
            </Link>

            <Link href="/investors/portal">
              <button
                style={{
                  padding: '10px 18px',
                  background: '#fff',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                }}
              >
                Investor portal
              </button>
            </Link>
          </div>
        </div>

        {/* NDA explanation */}
        <div
          style={{
            marginTop: 24,
            padding: 24,
            borderRadius: 12,
            background: '#fff',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Why NDA gating exists</h3>
          <p style={{ marginBottom: 0, color: '#444' }}>
            Our public material is intentionally high-level. The NDA portal
            contains demo access and deeper documentation intended only for
            qualified investors.
          </p>
        </div>
      </div>
    </div>
  );
}
