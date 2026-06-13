import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { cldUrl } from '@/lib/cloudinary';
import { catBySlug } from '@/lib/categories';
import { notFound } from 'next/navigation';
import AddToCart from '@/components/shop/AddToCart';
import ProductCard from '@/components/shop/ProductCard';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { isMock, getMockProduct, getMockRelated } from '@/lib/mock-data';

export const revalidate = 60;
const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: p } = isMock ? getMockProduct(slug) as any : await supabase.from('products').select('name, short_description').eq('slug', slug).single();
  return { title: p?.name ?? 'Product', description: p?.short_description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: p } = isMock ? getMockProduct(slug) as any : await supabase.from('products').select('*, categories(slug, name)').eq('slug', slug).single();
  if (!p) notFound();

  const { data: related } = isMock
    ? getMockRelated(p.category_id, p.id, 4) as any
    : await supabase.from('products')
        .select('*').eq('category_id', p.category_id).eq('is_active', true).neq('id', p.id).limit(4);

  const catSlug = (p.categories as any)?.slug;
  const meta = catSlug ? catBySlug(catSlug) : null;
  const imgs: string[] = p.cloudinary_images?.length ? p.cloudinary_images : [];

  return (
    <div className="wrap pt-6 pb-12 lg:pt-10">
      <div className="flex items-center gap-2 text-sm text-fg-faint">
        <Link href="/producten" className="hover:text-accent">Producten</Link>
        {meta && (<><span>/</span><Link href={`/categorie/${meta.slug}`} className="hover:text-accent">{meta.name}</Link></>)}
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="card aspect-square overflow-hidden">
            {imgs[0]
              ? <img src={cldUrl(imgs[0], { w: 1100 })} alt={p.name} className="h-full w-full object-cover" />
              : <div className="grid h-full w-full place-items-center bg-panel-2">
                  <span className="font-display text-sm uppercase tracking-[0.25em] text-fg-faint">Vami Pro</span>
                </div>}
          </div>
          {imgs.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {imgs.slice(0, 4).map((id, i) => (
                <div key={i} className="card aspect-square overflow-hidden">
                  <img src={cldUrl(id, { w: 240 })} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {p.brand && <p className="text-xs uppercase tracking-[0.2em] text-fg-faint">{p.brand}</p>}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">{p.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-fg">{euro(p.price_cents)}</span>
            <span className="text-sm text-fg-muted">incl. btw</span>
          </div>
          <p className="mt-1 text-sm">
            {p.stock > 0
              ? <span className="text-accent">● Op voorraad — vandaag verzonden</span>
              : <span className="text-fg-faint">Tijdelijk uitverkocht</span>}
          </p>

          <p className="mt-6 leading-relaxed text-fg-muted">{p.description}</p>

          <div className="mt-7">
            <AddToCart product={{ productId: p.id, name: p.name, slug: p.slug, priceCents: p.price_cents, image: imgs[0] }} />
          </div>

          <ul className="mt-8 space-y-3 border-t hairline pt-6 text-sm text-fg-muted">
            <li className="flex items-center gap-3"><Truck size={16} className="text-accent" strokeWidth={1.6} /> Voor 16:00 besteld, vandaag verzonden (NL &amp; BE)</li>
            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-accent" strokeWidth={1.6} /> Veilig betalen met iDEAL &amp; Bancontact</li>
            <li className="flex items-center gap-3"><RotateCcw size={16} className="text-accent" strokeWidth={1.6} /> 14 dagen bedenktijd</li>
          </ul>

          {p.sku && <p className="mt-6 text-xs text-fg-faint">Artikelnr. {p.sku}</p>}
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="mt-24">
          <h2 className="h-section">Past hier goed bij</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((r: any) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
