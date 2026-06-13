'use client';
import { useCart, type CartItem } from '@/lib/cart-store';
import { useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';

export default function AddToCart({ product }: { product: Omit<CartItem, 'quantity'> }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  function handle() {
    add(product, qty);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-full border hairline">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-fg-muted hover:text-accent" aria-label="Minder">
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-display">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center text-fg-muted hover:text-accent" aria-label="Meer">
          <Plus size={16} />
        </button>
      </div>
      <button onClick={handle} className="btn btn-primary flex-1 justify-center sm:flex-none">
        {done ? (<><Check size={18} /> Toegevoegd</>) : 'In winkelmandje'}
      </button>
    </div>
  );
}
