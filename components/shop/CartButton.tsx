'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { ShoppingBag } from 'lucide-react';

export default function CartButton() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  return (
    <Link href="/winkelmandje" className="group flex items-center gap-2 text-sm text-white hover:text-accent transition-colors">
      <div className="relative flex items-center justify-center p-1">
        <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow ring-2 ring-panel-1">
            {count}
          </span>
        )}
      </div>
      <span className="hidden sm:inline font-medium">Mandje</span>
    </Link>
  );
}
