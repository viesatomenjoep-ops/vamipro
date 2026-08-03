'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-store';

type PromoCfg = { discountCode: string; discountPercent: number; discountRemaining: number | null; promoActive: boolean };
const DEFAULT_PROMO: PromoCfg = { discountCode: 'VAMIPRO50', discountPercent: 50, discountRemaining: null, promoActive: true };

// Grote welkomst-pop-up met de actie, één keer per sessie bij het openen van de
// site. Naast de permanente actiebalk bovenaan (PromoBar). Sluiten via het kruisje
// of door naast de pop-up te klikken.
export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState<PromoCfg>(DEFAULT_PROMO);
  const { setDiscountCode } = useCart();
  const pathname = usePathname();

  // Niet tonen in de afrekenflow (winkelmandje/checkout): daar zou de pop-up het
  // invullen van adres/betaling blokkeren.
  const suppressed = !!pathname && (pathname.startsWith('/checkout') || pathname.startsWith('/winkelmandje'));

  useEffect(() => {
    fetch('/api/shop-config')
      .then((r) => r.json())
      .then((d) => setPromo({
        discountCode: (d.discountCode ?? DEFAULT_PROMO.discountCode).toUpperCase(),
        discountPercent: d.discountPercent ?? DEFAULT_PROMO.discountPercent,
        discountRemaining: d.discountRemaining ?? null,
        promoActive: d.promoActive ?? true,
      }))
      .catch(() => {});
  }, []);

  // Actie uit (schuifje) of vol (limiet bereikt) → geen pop-up.
  const promoFull = promo.discountRemaining !== null && promo.discountRemaining <= 0;
  const hidden = suppressed || !promo.promoActive || promoFull;

  useEffect(() => {
    if (hidden) { setIsOpen(false); return; }
    const seen = sessionStorage.getItem('vami-promo-seen');
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 900);
      return () => clearTimeout(timer);
    }
  }, [hidden]);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem('vami-promo-seen', 'true');
  };

  const applyAndClose = () => {
    setDiscountCode(promo.discountCode);
    close();
  };

  if (!isOpen || hidden) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={close}
      />

      {/* Pop-up */}
      <div className="relative w-full max-w-md overflow-hidden rounded-md border hairline bg-panel shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={close}
          aria-label="Sluiten"
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="relative flex h-32 items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, var(--accent-deep), var(--panel) 90%)' }} />
          <p className="relative z-10 font-display text-3xl font-bold tracking-tight text-white">
            VAMI<span className="text-accent-bright">.</span>PRO
          </p>
        </div>

        {/* Inhoud */}
        <div className="p-6 text-center sm:p-8">
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Tijdelijke actie
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-fg">
            {promo.discountPercent}% korting op je bestelling
          </h2>
          <p className="mt-3 text-fg-muted">
            Krijg nu direct {promo.discountPercent}% korting op al onze professionele detailingproducten.
          </p>

          <div className="mt-6 rounded border border-dashed border-line-strong bg-panel-2 p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-fg-faint">Jouw kortingscode:</p>
            <p className="font-display text-2xl font-bold tracking-wider text-fg">{promo.discountCode}</p>
          </div>

          <button onClick={applyAndClose} className="btn btn-primary mt-8 w-full justify-center text-sm">
            Korting toepassen en verder winkelen
          </button>
        </div>
      </div>
    </div>
  );
}
