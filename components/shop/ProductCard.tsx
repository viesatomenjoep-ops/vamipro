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
    <Link prefetch={true} href={`/producten/${p.slug}`} className="card card-hover group block overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-panel-2">
        {img
          ? <img src={cldUrl(img, { w: 500 })} alt={p.name}
              className="h-full w-full object-contain px-4 pt-2 pb-8 transition-transform duration-500 group-hover:scale-105" />
          : <div className="grid h-full w-full place-items-center">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-fg-faint">Vami Pro</span>
            </div>}
        {p.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/30">
            Aanrader
          </span>
        )}
        {p.stock <= 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-[11px] text-fg-muted">
            Uitverkocht
          </span>
        )}
      </div>
      <div className="p-4">
        {p.brand && <p className="text-[10px] sm:text-xs uppercase tracking-wider text-fg-faint mb-1">{p.brand}</p>}
        <h3 className="text-sm sm:text-base font-medium leading-tight text-fg">{p.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-fg-muted">{p.short_description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-base sm:text-[17px] font-semibold text-fg">{euro(p.price_cents)}</span>
            {oldPrice && (
              <span className="text-xs sm:text-sm text-fg-faint line-through decoration-bad/70">
                {euro(oldPrice)}
              </span>
            )}
          </div>
          <span className="hidden text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100 sm:block">Bekijk →</span>
        </div>
      </div>
    </Link>
  );
}
