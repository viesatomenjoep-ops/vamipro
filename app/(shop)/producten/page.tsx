import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import ProductCard from '@/components/shop/ProductCard';
import { isMock, getMockProducts } from '@/lib/mock-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alle producten',
  description: 'Het complete assortiment professionele autopoetsproducten: shampoo, coating, droogdoeken en detailing-tools. Veilig wassen tot showroomglans in NL & BE.',
  alternates: { canonical: '/producten' },
  openGraph: {
    title: 'Alle producten',
    description: 'Het complete assortiment professionele autopoetsproducten: shampoo, coating, droogdoeken en detailing-tools. Veilig wassen tot showroomglans in NL & BE.',
    url: '/producten',
    type: 'website',
  },
};
export const revalidate = 60;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = createServiceClient();
  const params = await searchParams;
  const q = params?.q?.toLowerCase();

  let { data: products } = isMock
    ? getMockProducts() as any
    : await supabase
        .from('products').select('*').eq('is_active', true).order('is_featured', { ascending: false }).order('name');

  if (q && products) {
    products = products.filter((p: any) => 
      p.name.toLowerCase().includes(q) || 
      (p.short_description && p.short_description.toLowerCase().includes(q))
    );
  }
        
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <div className="wrap pt-0 pb-16 lg:pt-0">
      <p className="eyebrow">Catalogus</p>
      <h1 className="h-section mt-1">Alle producten</h1>
      <p className="mt-1 max-w-lg text-fg-muted">{products?.length ?? 0} producten over ons volledige assortiment — van veilig wassen tot keramische bescherming.</p>

      <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white">Alles</span>
        {categories?.map((c) => (
          <Link key={c.slug} href={`/categorie/${c.slug}`}
            className="shrink-0 whitespace-nowrap rounded-full border hairline px-4 py-1.5 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent">
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="mt-5">
        {categories?.map(c => {
          const categoryProducts = products?.filter((p: any) => p.category_id === c.id) || [];
          if (categoryProducts.length === 0) return null;
          return (
            <div key={c.id} className="mt-12 first:mt-4">
              <h2 className="font-display text-xl font-semibold border-b hairline pb-2 mb-5">{c.name}</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {categoryProducts.map((p: any) => <ProductCard key={p.id} p={p} />)}
              </div>
            </div>
          );
        })}
        
        {/* Uncategorized fallback */}
        {products?.filter((p: any) => !categories?.find(c => c.id === p.category_id))?.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold border-b hairline pb-2 mb-5">Overige producten</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {products?.filter((p: any) => !categories?.find(c => c.id === p.category_id)).map((p: any) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
