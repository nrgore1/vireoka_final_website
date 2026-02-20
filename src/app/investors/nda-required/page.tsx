export default function NdaRequiredPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-2xl font-semibold mb-3">NDA Required</h1>
      <p className="text-gray-700">
        Your investor account is approved, but access to confidential materials requires a signed NDA.
      </p>
      <p className="mt-4 text-gray-700">
        Please use the NDA link that was emailed to you. If you no longer have it, contact{' '}
        <a className="underline" href="mailto:investors@vireoka.com">investors@vireoka.com</a>.
      </p>
    </main>
  );
}
