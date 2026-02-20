export default function NdaSignedPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-semibold mb-4">NDA Signed</h1>
      <p className="text-gray-700">
        Thank you. Your NDA has been successfully recorded.
      </p>
      <p className="mt-4 text-gray-700">
        If your account is approved, you can now proceed to the Investor Portal.
      </p>
      <a className="inline-block mt-8 underline" href="/investors/portal">
        Go to Investor Portal
      </a>
    </main>
  );
}
