export default function AdminIntelligence() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Admin · Vireoka Intelligence</h1>
      <p>Manage NDA requests, role assignments, and access to confidential materials.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Next steps</h2>
        <ol>
          <li>Move NDA + Terms acceptance into Supabase tables (auditable, revocable).</li>
          <li>Build an admin queue: pending → approved → revoked.</li>
          <li>Role assignment: advisor / angel / crowdsourcing / partner.</li>
        </ol>
      </section>
    </main>
  );
}
