'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';

type PromoCfg = { discountCode: string; discountPercent: number; discountRemaining: number | null; promoActive: boolean };
const DEFAULT_PROMO: PromoCfg = { discountCode: 'VAMIPRO50', discountPercent: 50, discountRemaining: null, promoActive: true };

// Permanente, slanke actiebalk bovenin de site — altijd zichtbaar op elk
// apparaat en in elke browser. Klik = code toepassen en naar de producten.
export default function PromoBar() {
  const [promo, setPromo] = useState<PromoCfg>(DEFAULT_PROMO);
  const { setDiscountCode } = useCart();
  const router = useRouter();

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

  // Actie uit (schuifje) of vol (limiet bereikt) → balk verbergen.
  const promoFull = promo.discountRemaining !== null && promo.discountRemaining <= 0;
  if (!promo.promoActive || promoFull) return null;

  const apply = () => {
    setDiscountCode(promo.discountCode);
    router.push('/producten');
  };

  return (
    <button
      onClick={apply}
      aria-label={`${promo.discountPercent}% korting toepassen met code ${promo.discountCode}`}
      className="group block w-full text-white"
      style={{ background: 'linear-gradient(90deg, var(--accent-deep), var(--accent) 55%, var(--accent-deep))' }}
    >
      <div className="wrap flex items-center justify-center gap-x-2.5 gap-y-0 py-2 text-[11px] leading-tight sm:text-[13px]">
        <span className="font-bold uppercase tracking-wide">{promo.discountPercent}% korting op alles</span>
        <span className="hidden opacity-80 sm:inline">met code</span>
        <span className="rounded bg-white/20 px-2 py-0.5 font-bold tracking-[0.15em]">{promo.discountCode}</span>
        <span className="font-medium underline decoration-white/60 underline-offset-2 group-hover:decoration-white">Toepassen</span>
      </div>
    </button>
  );
}
