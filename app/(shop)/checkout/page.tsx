'use client';
import { useCart } from '@/lib/cart-store';
import { cldUrl } from '@/lib/cloudinary';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck } from 'lucide-react';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

type ShopCfg = { shippingCents: number; shippingCentsBe: number; freeShipCents: number; discountCode: string; discountPercent: number; oneCentCode: string; discountRemaining: number | null };
const DEFAULT_CFG: ShopCfg = { shippingCents: 795, shippingCentsBe: 1195, freeShipCents: 7000, discountCode: 'VAMIPRO50', discountPercent: 50, oneCentCode: '', discountRemaining: null };

export default function CheckoutPage() {
  const { items, subtotalCents, discountCode } = useCart();
  const [cfg, setCfg] = useState<ShopCfg>(DEFAULT_CFG);

  useEffect(() => {
    fetch('/api/shop-config')
      .then((r) => r.json())
      .then((d) => setCfg({
        shippingCents: d.shippingCents ?? DEFAULT_CFG.shippingCents,
        shippingCentsBe: d.shippingCentsBe ?? DEFAULT_CFG.shippingCentsBe,
        freeShipCents: d.freeShipCents ?? DEFAULT_CFG.freeShipCents,
        discountCode: (d.discountCode ?? DEFAULT_CFG.discountCode).toUpperCase(),
        discountPercent: d.discountPercent ?? DEFAULT_CFG.discountPercent,
        oneCentCode: (d.oneCentCode ?? DEFAULT_CFG.oneCentCode).toUpperCase(),
        discountRemaining: d.discountRemaining ?? null,
      }))
      .catch(() => {});
  }, []);
  const [f, setF] = useState({
    firstName: '', lastName: '', address: '', houseNumber: '', addition: '',
    postalCode: '', city: '', country: 'NL', email: '', phone: '', company: '', vatNumber: '',
  });
  const [biz, setBiz] = useState(false);
  const [method, setMethod] = useState<'ideal' | 'bancontact'>('ideal');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [addrStatus, setAddrStatus] = useState<'' | 'searching' | 'found' | 'notfound'>('');
  const set = (k: string) => (e: any) => {
    const value = e.target.value;
    setF((prev) => ({ ...prev, [k]: value }));
  };

  // ── Adres onthouden ─────────────────────────────────────────────────────
  // Bij terugkeer op de checkout (bv. je ging even terug naar je winkelwagen)
  // wordt het eerder ingevulde adres hersteld uit de browser-opslag.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vami-checkout');
      if (raw) {
        const p = JSON.parse(raw);
        if (p && typeof p === 'object') setF((prev) => ({ ...prev, ...p }));
      }
    } catch { /* geen opgeslagen adres */ }
  }, []);
  // De allereerste keer NIET opslaan (dan staat f nog leeg en zou het geladen
  // adres overschreven worden); daarna elke wijziging bewaren.
  const firstSave = useRef(true);
  useEffect(() => {
    if (firstSave.current) { firstSave.current = false; return; }
    try { localStorage.setItem('vami-checkout', JSON.stringify(f)); } catch { /* opslag vol/geblokkeerd */ }
  }, [f]);

  // Land automatisch herkennen aan de postcode: NL = 1234 AB, BE = 4 cijfers.
  useEffect(() => {
    const pc = f.postalCode.replace(/\s/g, '').toUpperCase();
    if (/^\d{4}[A-Z]{2}$/.test(pc)) {
      setF((p) => (p.country === 'NL' ? p : { ...p, country: 'NL' }));
    } else if (/^\d{4}$/.test(pc)) {
      setF((p) => (p.country === 'BE' ? p : { ...p, country: 'BE' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.postalCode]);

  // Adres automatisch aanvullen op basis van postcode (+ straat/huisnummer):
  //  - NL (1234 AB): straat + plaats invullen op postcode + huisnummer.
  //  - BE (4 cijfers): plaats invullen op postcode; straat verfijnt de zoekopdracht.
  useEffect(() => {
    const pc = f.postalCode.replace(/\s/g, '').toUpperCase();
    const hn = f.houseNumber.trim();
    const isNL = /^\d{4}[A-Z]{2}$/.test(pc);
    const isBE = /^\d{4}$/.test(pc);
    if (isNL && !hn) { setAddrStatus(''); return; }
    if (!isNL && !isBE) { setAddrStatus(''); return; }
    const ctrl = new AbortController();
    setAddrStatus('searching');
    const timer = setTimeout(async () => {
      try {
        const qs = new URLSearchParams({ country: isNL ? 'NL' : 'BE', pc, hn, street: f.address.trim() });
        const res = await fetch(`/api/postcode?${qs.toString()}`, { signal: ctrl.signal });
        const d = await res.json();
        if (d.found) {
          // NL: straat + plaats overschrijven. BE: alleen plaats (straat typ je zelf).
          setF((p) => isNL
            ? { ...p, address: d.street || p.address, city: d.city || p.city }
            : { ...p, city: d.city || p.city });
          setAddrStatus('found');
        } else {
          setAddrStatus('notfound');
        }
      } catch { /* geannuleerd of fout: negeer */ }
    }, 600);
    return () => { clearTimeout(timer); ctrl.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.postalCode, f.houseNumber]);

  const sub = subtotalCents();
  const appliedCode = (discountCode ?? '').toUpperCase();
  const isOneCent = !!cfg.oneCentCode && appliedCode === cfg.oneCentCode;
  // Gelimiteerde actie vol → geen korting (net als de server). Voorkomt dat de UI
  // een korting toont die bij het afrekenen niet wordt verrekend.
  const promoFull = cfg.discountRemaining !== null && cfg.discountRemaining <= 0;
  const discountActive = !!discountCode && !isOneCent && !promoFull;
  const shipping = isOneCent ? 0 : (sub >= cfg.freeShipCents ? 0 : (f.country === 'BE' ? cfg.shippingCentsBe : cfg.shippingCents));
  const disc = isOneCent ? Math.max(0, sub - 1) : (discountActive ? Math.round(sub * cfg.discountPercent / 100) : 0);
  const total = isOneCent ? 1 : (sub - disc + shipping);

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
          discountCode: discountCode,
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
      <h1 className="h-section flex flex-wrap items-center gap-x-3 gap-y-1">
        Afrekenen
        <span className="text-sm font-body font-normal text-fg-faint flex items-center gap-1.5">
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
              <input value={f.firstName} className="field text-base w-full min-w-0" placeholder="Voornaam" autoComplete="given-name" onChange={set('firstName')} />
              <input value={f.lastName} className="field text-base w-full min-w-0" placeholder="Achternaam" autoComplete="family-name" onChange={set('lastName')} />
              <input value={f.postalCode} className="field text-base w-full min-w-0" placeholder="Postcode" autoComplete="postal-code" onChange={set('postalCode')} />
              {/* Huisnummer + toevoeging altijd naast elkaar */}
              <div className="grid grid-cols-2 gap-3 min-w-0">
                <input value={f.houseNumber} className="field text-base w-full min-w-0" placeholder="Huisnr." autoComplete="address-line2" onChange={set('houseNumber')} />
                <input value={f.addition} className="field text-base w-full min-w-0" placeholder="Toev." autoComplete="address-line3" onChange={set('addition')} />
              </div>
              <input value={f.address} className="field sm:col-span-2 text-base w-full min-w-0" placeholder="Straatnaam" autoComplete="address-line1" onChange={set('address')} />
              <input value={f.city} className="field sm:col-span-2 text-base w-full min-w-0" placeholder="Plaats" autoComplete="address-level2" onChange={set('city')} />
              <select className="field sm:col-span-2 text-base w-full min-w-0" value={f.country} autoComplete="country" onChange={set('country')}>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
              </select>
            </div>
            {addrStatus === 'searching' && <p className="mt-2 text-xs text-fg-faint">Adres opzoeken…</p>}
            {addrStatus === 'found' && f.country === 'NL' && <p className="mt-2 text-xs text-accent">✓ Straat en plaats automatisch ingevuld op basis van je postcode.</p>}
            {addrStatus === 'found' && f.country === 'BE' && <p className="mt-2 text-xs text-accent">✓ Belgisch adres herkend — plaats ingevuld op basis van je postcode.</p>}
            {addrStatus === 'notfound' && f.country === 'NL' && <p className="mt-2 text-xs text-fg-faint">Geen adres gevonden — vul straat en plaats handmatig in.</p>}
            {addrStatus === 'notfound' && f.country === 'BE' && <p className="mt-2 text-xs text-fg-faint">Vul je straat, huisnummer en plaats zelf in.</p>}
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
                <div className="flex justify-between items-center text-accent font-medium w-full"><span className="truncate pr-2">Korting ({cfg.discountPercent}%)</span><span className="shrink-0">-{euro(disc)}</span></div>
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
