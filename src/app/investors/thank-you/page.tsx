export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ref?: string }>;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { ref } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-semibold mb-4">
        Thank you for your interest in Vireoka
      </h1>

      <p className="text-gray-700 mb-6">
        Your investor access request has been successfully submitted.
        Our team appreciates your interest and will review your application shortly.
      </p>

      {ref && (
        <div className="mb-6 rounded-md bg-gray-100 p-4 text-sm">
          <strong>Reference code:</strong> {ref}
        </div>
      )}

      <h2 className="text-xl font-medium mb-2">What happens next?</h2>

      <ol className="list-decimal list-inside space-y-3 text-gray-700">
        <li>
          <strong>Internal review:</strong> Our team evaluates your application.
        </li>
        <li>
          <strong>NDA review:</strong> If approved, you will receive an email with a secure
          Non-Disclosure Agreement (NDA).
        </li>
        <li>
          <strong>Investor access:</strong> Once the NDA is completed, your
          investor login will be activated and credentials sent by email.
        </li>
      </ol>

      <p className="mt-8 text-gray-600">
        Questions? Contact us at{' '}
        <a href="mailto:info@vireoka.com" className="underline">
          info@vireoka.com
        </a>
      </p>
    </main>
  );
}
