"use client";

export default function NdaPage() {
  async function accept() {
    await fetch("/api/investors/nda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ndaVersion: 1 }),
    });
    window.location.href = "/investors";
  }

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      <h1>Non-Disclosure Agreement</h1>
      <p>
        Access to Vireoka’s confidential investor materials requires acceptance
        of the NDA below.
      </p>

      <div style={{ margin: "24px 0" }}>
        <p><em>[ NDA content goes here ]</em></p>
      </div>

      <button onClick={accept}>I Accept the NDA</button>
    </main>
  );
}
