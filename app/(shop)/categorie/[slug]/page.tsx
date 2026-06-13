import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { CATEGORIES, catBySlug } from '@/lib/categories';
import ProductCard from '@/components/shop/ProductCard';
import { isMock, getMockCategory, getMockProducts } from '@/lib/mock-data';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: catBySlug(slug)?.name ?? 'Categorie' };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = catBySlug(slug);
  const supabase = createServiceClient();
  const { data: cat } = isMock ? getMockCategory(slug) as any : await supabase.from('categories').select('*').eq('slug', slug).single();
  const { data: products } = isMock 
    ? getMockProducts({ category_id: cat?.id }) as any
    : await supabase.from('products')
        .select('*').eq('category_id', cat?.id).eq('is_active', true).order('name');

  return (
    <div className="wrap pt-6 pb-16 lg:pt-10">
      <div className="flex items-center gap-3 text-sm text-fg-faint">
        <Link href="/producten" className="hover:text-accent">Producten</Link>
        <span>/</span><span className="text-fg-muted">{meta?.name ?? slug}</span>
      </div>
      <div className="mt-6 flex items-baseline gap-4">
        {meta && <span className="font-display text-sm text-accent">{meta.step}</span>}
        <h1 className="h-section">{meta?.name ?? cat?.name ?? slug}</h1>
      </div>
      <p className="mt-2 max-w-lg text-fg-muted">{meta?.tagline ?? cat?.description}</p>

      <nav className="mt-8 flex flex-wrap gap-2">
        <Link href="/producten" className="rounded-full border hairline px-4 py-1.5 text-sm text-fg-muted hover:border-accent hover:text-accent">Alles</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/categorie/${c.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              c.slug === slug ? 'bg-accent font-medium text-white' : 'border hairline text-fg-muted hover:border-accent hover:text-accent'
            }`}>
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products?.length
          ? products.map((p) => <ProductCard key={p.id} p={p} />)
          : <p className="col-span-full text-fg-muted">Nog geen producten in deze categorie.</p>}
      </div>
    </div>
  );
}
