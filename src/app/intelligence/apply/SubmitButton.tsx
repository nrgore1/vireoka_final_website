'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-black text-white py-3 font-medium disabled:opacity-50"
    >
      {pending ? 'Submitting…' : 'Submit application'}
    </button>
  );
}
