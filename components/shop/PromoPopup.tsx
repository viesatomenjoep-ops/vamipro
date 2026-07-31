'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-store';

type PromoCfg = { discountCode: string; discountPercent: number; discountMaxUses: number; discountRemaining: number | null };
const DEFAULT_PROMO: PromoCfg = { discountCode: 'VAMIPRO50', discountPercent: 50, discountMaxUses: 100, discountRemaining: null };

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState<PromoCfg>(DEFAULT_PROMO);
  const { setDiscountCode } = useCart();
  const pathname = usePathname();

  // Niet tonen in de afrekenflow (winkelmandje/checkout): daar dekt de popup het
  // hele scherm af en zou hij het invullen van adres/betaling blokkeren.
  const suppressed = !!pathname && (pathname.startsWith('/checkout') || pathname.startsWith('/winkelmandje'));

  // Actuele actie ophalen (percentage, code, resterende plekken).
  useEffect(() => {
    fetch('/api/shop-config')
      .then((r) => r.json())
      .then((d) => setPromo({
        discountCode: (d.discountCode ?? DEFAULT_PROMO.discountCode).toUpperCase(),
        discountPercent: d.discountPercent ?? DEFAULT_PROMO.discountPercent,
        discountMaxUses: d.discountMaxUses ?? DEFAULT_PROMO.discountMaxUses,
        discountRemaining: d.discountRemaining ?? null,
      }))
      .catch(() => {});
  }, []);

  // Actie is vol (gelimiteerd én geen plekken meer) → geen pop-up tonen.
  const promoFull = promo.discountRemaining !== null && promo.discountRemaining <= 0;

  useEffect(() => {
    if (suppressed || promoFull) { setIsOpen(false); return; }
    // Check if the user has already seen the popup in this session
    const seen = sessionStorage.getItem('vami-promo-seen');
    if (!seen) {
      // Show popup after 1 second
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [suppressed, promoFull]);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem('vami-promo-seen', 'true');
  };

  const applyAndClose = () => {
    setDiscountCode(promo.discountCode);
    close();
  };

  if (!isOpen || suppressed || promoFull) return null;

  const limited = promo.discountMaxUses > 0;
  const spotsLeft = promo.discountRemaining;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={close}
      />

      {/* Popup Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-md border hairline bg-panel shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={close}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header Image / Pattern */}
        <div className="h-32 bg-black relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, var(--accent-deep), var(--panel) 90%)' }} />
          <p className="font-display text-3xl font-bold tracking-tight text-white relative z-10">
            VAMI<span className="text-accent-bright">.</span>PRO
          </p>
        </div>

        {/* Content */}
        <div className="p-6 text-center sm:p-8">
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            {limited ? `Alleen de eerste ${promo.discountMaxUses} klanten` : 'Tijdelijke Actie'}
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-fg">
            {promo.discountPercent}% Korting op je bestelling
          </h2>
          <p className="mt-3 text-fg-muted">
            {limited
              ? `Wees er snel bij! De eerste ${promo.discountMaxUses} klanten krijgen ${promo.discountPercent}% korting op al onze professionele detailingproducten.`
              : `Krijg nu direct ${promo.discountPercent}% korting op al onze professionele detailingproducten, zolang de voorraad strekt!`}
          </p>

          {limited && typeof spotsLeft === 'number' && (
            <p className="mt-3 text-sm font-semibold text-accent">
              Nog maar {spotsLeft} {spotsLeft === 1 ? 'plek' : 'plekken'} beschikbaar!
            </p>
          )}

          <div className="mt-6 rounded border hairline bg-panel-2 p-4 border-dashed border-line-strong">
            <p className="text-xs uppercase tracking-widest text-fg-faint mb-1">Jouw kortingscode:</p>
            <p className="font-display text-2xl font-bold text-fg tracking-wider">{promo.discountCode}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button onClick={applyAndClose} className="btn btn-primary w-full justify-center text-sm">
              Korting toepassen & verder winkelen
            </button>
            <button onClick={close} className="text-sm font-medium text-fg-muted hover:text-fg transition-colors">
              Nee bedankt, ik betaal liever de volle prijs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
