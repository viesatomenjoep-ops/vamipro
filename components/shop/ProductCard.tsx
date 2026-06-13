import Link from 'next/link';
import { cldUrl } from '@/lib/cloudinary';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default function ProductCard({ p }: { p: any }) {
  const img = p.cloudinary_images?.[0];
  return (
    <Link href={`/producten/${p.slug}`} className="card card-hover group block overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-panel-2">
        {img
          ? <img src={cldUrl(img, { w: 600 })} alt={p.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
      <div className="p-3 sm:p-4">
        {p.brand && <p className="text-[10px] uppercase tracking-[0.18em] text-fg-faint sm:text-[11px]">{p.brand}</p>}
        <h3 className="mt-1 font-display text-sm font-medium leading-snug text-fg sm:text-base">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-fg-muted sm:text-sm">{p.short_description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-base font-semibold text-fg sm:text-lg">{euro(p.price_cents)}</span>
          <span className="hidden text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100 sm:block">Bekijk →</span>
        </div>
      </div>
    </Link>
  );
}
