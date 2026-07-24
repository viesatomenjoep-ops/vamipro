'use client';

import { useTransition } from 'react';
import { deleteProduct } from '@/app/admin/actions';

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (confirm(`Weet je zeker dat je "${name}" wilt verwijderen?\n\nDit kan niet ongedaan worden gemaakt.`)) {
      startTransition(() => deleteProduct(id));
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-red-400 hover:underline disabled:opacity-50"
    >
      {pending ? 'Bezig…' : 'Verwijder'}
    </button>
  );
}
