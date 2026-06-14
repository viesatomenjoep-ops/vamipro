'use client';
import { useCart, type CartItem } from '@/lib/cart-store';
import { useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';

export default function AddToCart({ product, outOfStock = false }: { product: Omit<CartItem, 'quantity'>, outOfStock?: boolean }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  function handle() {
    if (outOfStock) return;
    add(product, qty);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className={`inline-flex items-center rounded-full border hairline ${outOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={outOfStock} className="grid h-11 w-11 place-items-center text-fg-muted hover:text-accent" aria-label="Minder">
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-display">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} disabled={outOfStock} className="grid h-11 w-11 place-items-center text-fg-muted hover:text-accent" aria-label="Meer">
          <Plus size={16} />
        </button>
      </div>
      <button onClick={handle} disabled={outOfStock} className={`btn flex-1 justify-center sm:flex-none ${outOfStock ? 'bg-panel-2 text-fg-faint cursor-not-allowed' : 'btn-primary'}`}>
        {outOfStock ? 'Uitverkocht' : (done ? (<><Check size={18} /> Toegevoegd</>) : 'In winkelmandje')}
      </button>
    </div>
  );
}
