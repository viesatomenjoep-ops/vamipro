'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { ShoppingBag } from 'lucide-react';

export default function CartButton() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  return (
    <Link href="/winkelmandje" className="relative inline-flex items-center gap-2 text-sm text-fg hover:text-accent transition-colors">
      <ShoppingBag size={18} strokeWidth={1.6} />
      <span className="hidden sm:inline">Mandje</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
