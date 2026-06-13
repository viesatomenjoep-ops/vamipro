import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import ProductCard from '@/components/shop/ProductCard';
import { isMock, getMockProducts } from '@/lib/mock-data';

export const metadata = { title: 'Alle producten' };
export const revalidate = 60;

export default async function ProductsPage() {
  const supabase = createServiceClient();
  const { data: products } = isMock
    ? getMockProducts() as any
    : await supabase
        .from('products').select('*').eq('is_active', true).order('is_featured', { ascending: false }).order('name');
        
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <div className="wrap pt-6 pb-16 lg:pt-10">
      <p className="eyebrow">Catalogus</p>
      <h1 className="h-section mt-3">Alle producten</h1>
      <p className="mt-2 max-w-lg text-fg-muted">{products?.length ?? 0} producten over ons volledige assortiment — van veilig wassen tot keramische bescherming.</p>

      <nav className="mt-8 flex flex-wrap gap-2">
        <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white">Alles</span>
        {categories?.map((c) => (
          <Link key={c.slug} href={`/categorie/${c.slug}`}
            className="rounded-full border hairline px-4 py-1.5 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent">
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products?.map((p: any) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
