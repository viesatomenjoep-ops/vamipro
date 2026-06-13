'use client';
import { useCart } from '@/lib/cart-store';
import { cldUrl } from '@/lib/cloudinary';
import Link from 'next/link';
import { Minus, Plus, X, ArrowLeft } from 'lucide-react';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default function CartPage() {
  const { items, setQty, remove, subtotalCents } = useCart();
  const sub = subtotalCents();
  const freeShip = sub >= 7500;

  if (!items.length) return (
    <div className="wrap py-28 text-center">
      <h1 className="h-section">Je winkelmandje is leeg</h1>
      <p className="mt-3 text-fg-muted">Tijd om je auto te laten stralen.</p>
      <Link href="/producten" className="btn btn-primary mt-7">Bekijk producten</Link>
    </div>
  );

  return (
    <div className="wrap py-16">
      <h1 className="h-section">Winkelmandje</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-[var(--line)] overflow-hidden rounded border hairline">
          {items.map((i) => (
            <div key={i.productId} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-panel p-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="card h-20 w-20 shrink-0 overflow-hidden">
                  {i.image
                    ? <img src={cldUrl(i.image, { w: 160 })} alt={i.name} className="h-full w-full object-cover" />
                    : <div className="h-full w-full bg-panel-2" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/producten/${i.slug}`} className="font-display font-medium hover:text-accent line-clamp-2">{i.name}</Link>
                  <p className="text-sm text-fg-muted mt-1">{euro(i.priceCents)}</p>
                  
                  {/* Mobile only: quantity & total under price */}
                  <div className="mt-3 flex sm:hidden items-center justify-between">
                    <div className="inline-flex items-center rounded-full border hairline bg-bg">
                      <button onClick={() => setQty(i.productId, i.quantity - 1)} className="grid h-8 w-8 place-items-center text-fg-muted hover:text-accent"><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm font-display">{i.quantity}</span>
                      <button onClick={() => setQty(i.productId, i.quantity + 1)} className="grid h-8 w-8 place-items-center text-fg-muted hover:text-accent"><Plus size={14} /></button>
                    </div>
                    <span className="font-display font-medium">{euro(i.priceCents * i.quantity)}</span>
                  </div>
                </div>
                <button onClick={() => remove(i.productId)} className="sm:hidden text-fg-faint hover:text-red-400 p-1" aria-label="Verwijder"><X size={18} /></button>
              </div>

              {/* Desktop only: quantity, total, remove */}
              <div className="hidden sm:flex items-center gap-6 shrink-0">
                <div className="inline-flex items-center rounded-full border hairline bg-bg">
                  <button onClick={() => setQty(i.productId, i.quantity - 1)} className="grid h-9 w-9 place-items-center text-fg-muted hover:text-accent"><Minus size={14} /></button>
                  <span className="w-7 text-center text-sm font-display">{i.quantity}</span>
                  <button onClick={() => setQty(i.productId, i.quantity + 1)} className="grid h-9 w-9 place-items-center text-fg-muted hover:text-accent"><Plus size={14} /></button>
                </div>
                <span className="w-24 text-right font-display font-medium">{euro(i.priceCents * i.quantity)}</span>
                <button onClick={() => remove(i.productId)} className="text-fg-faint hover:text-red-400 ml-2" aria-label="Verwijder"><X size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        <aside className="card h-fit p-6">
          <h2 className="font-display text-lg font-semibold">Overzicht</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-fg-muted"><span>Subtotaal</span><span className="text-fg">{euro(sub)}</span></div>
            {useCart().discountCode === 'VAMIPRO10' && (
              <div className="flex justify-between text-accent font-medium"><span>Korting (10%)</span><span>-{euro(Math.round(sub * 0.1))}</span></div>
            )}
            <div className="flex justify-between text-fg-muted"><span>Verzending</span><span className="text-fg">{freeShip ? 'Gratis' : 'Berekend bij kassa'}</span></div>
          </div>
          {!freeShip && (
            <div className="mt-4 rounded-sm border hairline bg-panel-2 p-3 text-xs text-fg-muted">
              Nog {euro(7500 - sub)} tot gratis verzending.
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-strong">
                <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (sub / 7500) * 100)}%` }} />
              </div>
            </div>
          )}

          <div className="mt-5 border-t hairline pt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const code = (e.currentTarget.elements.namedItem('code') as HTMLInputElement).value;
              if (code.toUpperCase() === 'START10' || code.toUpperCase() === 'VAMIPRO10') {
                useCart.getState().setDiscountCode('VAMIPRO10');
              } else {
                alert('Ongeldige of verlopen kortingscode');
              }
            }} className="flex gap-2 mb-4">
              <input name="code" type="text" placeholder="Kortingscode" className="input flex-1 text-sm uppercase text-center placeholder:normal-case placeholder:text-center" />
              <button type="submit" className="btn bg-panel-2 hover:bg-raise text-sm">Toepassen</button>
            </form>
            <div className="flex justify-between">
              <span className="font-display font-semibold">Totaal</span>
              <span className="font-display text-lg font-semibold">{euro(sub - (useCart().discountCode === 'VAMIPRO10' ? Math.round(sub * 0.1) : 0))}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn btn-primary mt-5 w-full justify-center">Naar de kassa</Link>
          <Link href="/producten" className="mt-4 flex items-center justify-center gap-2 text-sm text-fg-muted hover:text-accent">
            <ArrowLeft size={14} /> Verder winkelen
          </Link>
        </aside>
      </div>
    </div>
  );
}
