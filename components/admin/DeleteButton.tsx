'use client';

import { useTransition } from 'react';

export default function DeleteButton({
  action,
  confirmText,
  label = 'Verwijder',
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmText)) startTransition(() => action());
      }}
      className="text-red-400 hover:underline disabled:opacity-50"
    >
      {pending ? 'Bezig…' : label}
    </button>
  );
}
