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
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

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
    <div className="wrap pt-0 pb-8 md:pt-0 md:pb-12 w-full">
      <h1 className="h-section flex items-center gap-3">
        Afrekenen
        <span className="text-sm font-body font-normal text-fg-faint flex items-center gap-1.5 mt-1">
          <Lock size={12} className="text-accent" /> Beveiligde kassa
        </span>
      </h1>

      <div className="mt-6 md:mt-10 grid gap-6 lg:gap-8 lg:grid-cols-[1.5fr_1fr] w-full">
        {/* Form */}
        <div className="space-y-10">
          <section>
            <p className="eyebrow">01 · Contact</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input className="field sm:col-span-2 text-base" placeholder="E-mailadres" type="email" autoComplete="email" onChange={set('email')} />
              <input className="field sm:col-span-2 text-base" placeholder="Telefoonnummer" type="tel" autoComplete="tel" onChange={set('phone')} />
            </div>
          </section>

          <section>
            <p className="eyebrow">02 · Bezorgadres</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input className="field text-base" placeholder="Voornaam" autoComplete="given-name" onChange={set('firstName')} />
              <input className="field text-base" placeholder="Achternaam" autoComplete="family-name" onChange={set('lastName')} />
              <input className="field sm:col-span-2 text-base" placeholder="Straatnaam" autoComplete="address-line1" onChange={set('address')} />
              <input className="field text-base" placeholder="Huisnummer" autoComplete="address-line2" onChange={set('houseNumber')} />
              <input className="field text-base" placeholder="Toevoeging (optioneel)" autoComplete="address-line3" onChange={set('addition')} />
              <input className="field text-base" placeholder="Postcode" autoComplete="postal-code" onChange={set('postalCode')} />
              <input className="field text-base" placeholder="Plaats" autoComplete="address-level2" onChange={set('city')} />
              <select className="field sm:col-span-2 text-base" value={f.country} autoComplete="country" onChange={set('country')}>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
              </select>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
              <input type="checkbox" checked={biz} onChange={(e) => setBiz(e.target.checked)} className="accent-[var(--accent)]" />
              Ik bestel zakelijk (factuur op bedrijfsnaam)
            </label>
            {biz && (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <input className="field text-base" placeholder="Bedrijfsnaam" autoComplete="organization" onChange={set('company')} />
                <input className="field text-base" placeholder="BTW-nummer" onChange={set('vatNumber')} />
              </div>
            )}
          </section>

          <section>
            <p className="eyebrow">03 · Betaalmethode</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {([['ideal', 'iDEAL', 'Nederlandse banken'], ['bancontact', 'Bancontact', 'Belgische banken']] as const).map(([val, label, sub2]) => (
                <button key={val} onClick={() => setMethod(val)}
                  className={`flex items-center justify-between rounded border p-4 text-left transition-colors ${
                    method === val ? 'border-accent bg-panel-2' : 'hairline bg-panel hover:border-line-strong'
                  }`}>
                  <span>
                    <span className="block font-display font-medium">{label}</span>
                    <span className="text-xs text-fg-muted">{sub2}</span>
                  </span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border ${method === val ? 'border-accent' : 'border-line-strong'}`}>
                    {method === val && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {err && <p className="rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{err}</p>}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold">Je bestelling</h2>
            <div className="mt-4 space-y-3">
              {items.map((i) => (
                <div key={i.productId} className="flex items-center gap-3">
                  <div className="card relative h-14 w-14 shrink-0 overflow-hidden">
                    {i.image ? <img src={cldUrl(i.image, { w: 120 })} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-panel-2" />}
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-semibold text-white">{i.quantity}</span>
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm">{i.name}</span>
                  <span className="text-sm font-medium">{euro(i.priceCents * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t hairline pt-4 text-sm">
              <div className="flex justify-between text-fg-muted"><span>Subtotaal</span><span className="text-fg">{euro(sub)}</span></div>
              {disc > 0 && (
                <div className="flex justify-between text-accent font-medium"><span>Korting (10%)</span><span>-{euro(disc)}</span></div>
              )}
              <div className="flex justify-between text-fg-muted"><span>Verzending</span><span className="text-fg">{shipping === 0 ? 'Gratis' : euro(shipping)}</span></div>
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t hairline pt-4">
              <span className="font-display font-semibold">Totaal</span>
              <span className="font-display text-2xl font-semibold">{euro(total)}</span>
            </div>
            <p className="mt-1 text-right text-xs text-fg-faint">incl. btw</p>

            <button onClick={pay} disabled={loading} className="btn btn-primary mt-5 w-full justify-center disabled:opacity-50">
              {loading ? 'Bezig met betalen…' : `Betaal ${euro(total)}`}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-fg-faint text-center break-words">
              <ShieldCheck size={14} className="text-accent shrink-0" /> 
              <span>Veilig afgerekend via Mollie</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
