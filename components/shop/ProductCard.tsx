import Link from 'next/link';
import { cldUrl } from '@/lib/cloudinary';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

const compareAtPrices: Record<string, number> = {
  'volledig-pakket-xxl': 20720,
  'exterieur-pakket': 6970,
  'combinatiedeal-interieur': 4780,
};

export default function ProductCard({ p }: { p: any }) {
  const img = p.cloudinary_images?.[0];
  const oldPrice = p.compare_at_price_cents || compareAtPrices[p.slug];
  return (
    <Link prefetch={true} href={`/producten/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="img-sheen relative aspect-square overflow-hidden bg-panel-2">
        {img
          ? <img src={cldUrl(img, { w: 700 })} alt={p.name} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
          : <div className="grid h-full w-full place-items-center bg-gradient-to-b from-panel-2 to-panel">
              <span className="mono text-[10px] uppercase tracking-[0.3em] text-fg-faint">Vami Pro</span>
            </div>}
        {p.is_featured && (
          <span className="mono absolute left-3 top-3 rounded-full border border-accent/40 bg-[rgba(17,26,48,.75)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent-bright backdrop-blur-sm">
            Bestseller
          </span>
        )}
        {p.stock <= 0 && (
          <span className="mono absolute right-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-fg-muted">
            Uitverkocht
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="mono text-[9px] uppercase tracking-[0.24em] text-fg-faint">
          {p.categories?.name || p.brand || 'Vami Pro'}
        </p>
        <h3 className="disp mt-1.5 text-sm leading-snug text-fg sm:text-[15px]">{p.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs text-fg-muted sm:text-[13px]">{p.short_description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="disp text-base text-fg sm:text-[17px]">{euro(p.price_cents)}</span>
            {oldPrice && (
              <span className="text-xs text-fg-faint line-through decoration-bad/70 sm:text-sm">
                {euro(oldPrice)}
              </span>
            )}
          </div>
          <span className="hidden -translate-x-1 text-sm text-accent-bright opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">Bekijk →</span>
        </div>
      </div>
    </Link>
  );
}
