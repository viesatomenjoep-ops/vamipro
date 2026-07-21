'use client';
import { useCart } from '@/lib/cart-store';
import { cldUrl } from '@/lib/cloudinary';
import { useState } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck } from 'lucide-react';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const [f, setF] = useState({
    firstName: '', lastName: '', address: '', houseNumber: '', addition: '',
    postalCode: '', city: '', country: 'NL', email: '', phone: '', company: '', vatNumber: '',
  });
  const [biz, setBiz] = useState(false);
  const [method, setMethod] = useState<'ideal' | 'bancontact'>('ideal');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string) => (e: any) => {
    const value = e.target.value;
    setF((prev) => ({ ...prev, [k]: value }));
  };

  const sub = subtotalCents();
  const disc = useCart().discountCode === 'VAMIPRO10' ? Math.round(sub * 0.1) : 0;
  const shipping = (sub - disc) >= 7500 ? 0 : f.country === 'NL' ? 495 : 695;
  const total = sub - disc + shipping;

  async function pay() {
    setErr(''); setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shipping: {
            firstName: f.firstName, lastName: f.lastName, address: f.address,
            houseNumber: f.houseNumber, addition: f.addition, postalCode: f.postalCode,
            city: f.city, country: f.country, email: f.email, phone: f.phone,
          },
          billing: biz ? { company: f.company, vatNumber: f.vatNumber } : undefined,
          paymentMethod: method, shippingMethodId: 'standaard',
          discountCode: useCart.getState().discountCode,
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else { setErr(data.error ?? 'Er ging iets mis. Controleer je gegevens.'); setLoading(false); }
    } catch { setErr('Verbinding mislukt. Probeer opnieuw.'); setLoading(false); }
  }

  if (!items.length) return (
    <div className="wrap py-28 text-center">
      <h1 className="h-section">Je winkelmandje is leeg</h1>
      <Link href="/producten" className="btn btn-primary mt-7">Bekijk producten</Link>
    </div>
  );

  return (
    <div className="wrap pt-0 pb-8 md:pt-0 md:pb-12">
      <h1 className="h-section flex items-center gap-3">
        Afrekenen
        <span className="text-sm font-body font-normal text-fg-faint flex items-center gap-1.5 mt-1">
          <Lock size={12} className="text-accent" /> Beveiligde kassa
        </span>
      </h1>

      <div className="mt-6 md:mt-10 flex flex-col lg:grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Form */}
        <div className="space-y-10 w-full overflow-hidden">
          <section>
            <p className="eyebrow">01 · Contact</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input className="field sm:col-span-2 text-base w-full" placeholder="E-mailadres" type="email" autoComplete="email" onChange={set('email')} />
              <input className="field sm:col-span-2 text-base w-full" placeholder="Telefoonnummer" type="tel" autoComplete="tel" onChange={set('phone')} />
            </div>
          </section>

          <section>
            <p className="eyebrow">02 · Bezorgadres</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input className="field text-base w-full" placeholder="Voornaam" autoComplete="given-name" onChange={set('firstName')} />
              <input className="field text-base w-full" placeholder="Achternaam" autoComplete="family-name" onChange={set('lastName')} />
              <input className="field sm:col-span-2 text-base w-full" placeholder="Straatnaam" autoComplete="address-line1" onChange={set('address')} />
              <input className="field text-base w-full" placeholder="Huisnummer" autoComplete="address-line2" onChange={set('houseNumber')} />
              <input className="field text-base w-full" placeholder="Toevoeging (optioneel)" autoComplete="address-line3" onChange={set('addition')} />
              <input className="field text-base w-full" placeholder="Postcode" autoComplete="postal-code" onChange={set('postalCode')} />
              <input className="field text-base w-full" placeholder="Plaats" autoComplete="address-level2" onChange={set('city')} />
              <select className="field sm:col-span-2 text-base w-full" value={f.country} autoComplete="country" onChange={set('country')}>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
              </select>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
              <input type="checkbox" checked={biz} onChange={(e) => setBiz(e.target.checked)} className="accent-[var(--accent)] shrink-0" />
              <span>Ik bestel zakelijk (factuur op bedrijfsnaam)</span>
            </label>
            {biz && (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <input className="field text-base w-full" placeholder="Bedrijfsnaam" autoComplete="organization" onChange={set('company')} />
                <input className="field text-base w-full" placeholder="BTW-nummer" onChange={set('vatNumber')} />
              </div>
            )}
          </section>

          <section>
            <p className="eyebrow">03 · Betaalmethode</p>
            <div className="mt-4 flex flex-col gap-3">
              {([['ideal', 'iDEAL', 'Nederlandse banken'], ['bancontact', 'Bancontact', 'Belgische banken']] as const).map(([val, label, sub2]) => (
                <button key={val} onClick={() => setMethod(val)}
                  className={`flex items-center justify-between rounded border p-4 text-left transition-colors w-full ${
                    method === val ? 'border-accent bg-panel-2' : 'hairline bg-panel hover:border-line-strong'
                  }`}>
                  <span className="min-w-0 pr-4">
                    <span className="block font-display font-medium truncate">{label}</span>
                    <span className="block text-xs text-fg-muted truncate">{sub2}</span>
                  </span>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${method === val ? 'border-accent' : 'border-line-strong'}`}>
                    {method === val && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {err && <p className="rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300 break-words">{err}</p>}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start w-full">
          <div className="card p-5 sm:p-6 w-full overflow-hidden">
            <h2 className="font-display text-lg font-semibold">Je bestelling</h2>
            <div className="mt-4 space-y-4">
              {items.map((i) => (
                <div key={i.productId} className="flex items-center gap-3 w-full">
                  <div className="card relative h-14 w-14 shrink-0 overflow-visible">
                    {i.image ? <img src={cldUrl(i.image, { w: 120 })} alt="" className="h-full w-full object-cover rounded-md" /> : <div className="h-full w-full bg-panel-2 rounded-md" />}
                    <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-semibold text-white shadow-sm">{i.quantity}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                  </div>
                  <span className="text-sm font-medium shrink-0 ml-2">{euro(i.priceCents * i.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 border-t hairline pt-4 text-sm w-full">
              <div className="flex justify-between items-center text-fg-muted w-full"><span className="truncate pr-2">Subtotaal</span><span className="text-fg shrink-0">{euro(sub)}</span></div>
              {disc > 0 && (
                <div className="flex justify-between items-center text-accent font-medium w-full"><span className="truncate pr-2">Korting (10%)</span><span className="shrink-0">-{euro(disc)}</span></div>
              )}
              <div className="flex justify-between items-center text-fg-muted w-full"><span className="truncate pr-2">Verzending</span><span className="text-fg shrink-0">{shipping === 0 ? 'Gratis' : euro(shipping)}</span></div>
            </div>
            
            <div className="mt-4 flex items-baseline justify-between border-t hairline pt-4 w-full">
              <span className="font-display font-semibold shrink-0">Totaal</span>
              <span className="font-display text-2xl font-semibold shrink-0">{euro(total)}</span>
            </div>
            <p className="mt-1 text-right text-xs text-fg-faint">incl. btw</p>

            <button onClick={pay} disabled={loading} className="btn btn-primary mt-6 w-full justify-center disabled:opacity-50">
              {loading ? 'Bezig met betalen…' : `Betaal ${euro(total)}`}
            </button>
            
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-fg-faint text-center break-words w-full">
              <ShieldCheck size={14} className="text-accent shrink-0" /> 
              <span>Veilig afgerekend via Mollie</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
