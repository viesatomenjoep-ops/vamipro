'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { setDiscountCode } = useCart();

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const seen = sessionStorage.getItem('vami-promo-seen');
    if (!seen) {
      // Show popup after 1 second
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem('vami-promo-seen', 'true');
  };

  const applyAndClose = () => {
    setDiscountCode('VAMIPRO10');
    close();
  };

  if (!isOpen) return null;

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
            Tijdelijke Actie
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-fg">
            10% Korting op je bestelling
          </h2>
          <p className="mt-3 text-fg-muted">
            Krijg nu direct 10% korting op al onze professionele detailingproducten, zolang de voorraad strekt!
          </p>

          <div className="mt-6 rounded border hairline bg-panel-2 p-4 border-dashed border-line-strong">
            <p className="text-xs uppercase tracking-widest text-fg-faint mb-1">Jouw kortingscode:</p>
            <p className="font-display text-2xl font-bold text-fg tracking-wider">VAMIPRO10</p>
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
