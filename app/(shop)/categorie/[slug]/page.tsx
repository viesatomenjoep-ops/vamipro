import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import ProductCard from '@/components/shop/ProductCard';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: cat } = await supabase.from('categories').select('name').eq('slug', slug).single();
  return { title: cat?.name ?? 'Categorie' };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();
  
  // Haal de huidige categorie op
  const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (!cat) return notFound();

  // Bepaal of we parent-niveau zijn of child-niveau
  let parentId = cat.parent_id || cat.id;

  // Haal alle subcategorieën op van de parent
  const { data: subcats } = await supabase.from('categories').select('*').eq('parent_id', parentId).order('sort_order');

  // We moeten producten ophalen voor deze specifieke categorie OF voor al zijn children als het een parent is
  let categoryIds = [cat.id];
  if (!cat.parent_id && subcats) {
    categoryIds = [cat.id, ...subcats.map(c => c.id)];
  }

  const { data: products } = await supabase.from('products')
    .select('*').in('category_id', categoryIds).eq('is_active', true).order('name');

  return (
    <div className="wrap pt-6 pb-16 lg:pt-10">
      <div className="flex items-center gap-3 text-sm text-fg-faint">
        <Link href="/producten" className="hover:text-accent">Producten</Link>
        <span>/</span><span className="text-fg-muted">{cat.name}</span>
      </div>
      <div className="mt-6 flex items-baseline gap-4">
        <h1 className="h-section">{cat.name}</h1>
      </div>
      {cat.description && <p className="mt-2 max-w-lg text-fg-muted">{cat.description}</p>}

      {subcats && subcats.length > 0 && (
        <nav className="mt-8 flex flex-wrap gap-2">
          <Link prefetch={true} href={`/categorie/${slug}`} 
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  !cat.parent_id ? 'bg-accent font-medium text-white' : 'border hairline text-fg-muted hover:border-accent hover:text-accent'
                }`}>Alles in {cat.name}</Link>
          
          {subcats.map((c) => (
            <Link prefetch={true} key={c.slug} href={`/categorie/${c.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                c.slug === slug ? 'bg-accent font-medium text-white' : 'border hairline text-fg-muted hover:border-accent hover:text-accent'
              }`}>
              {c.name}
            </Link>
          ))}
        </nav>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products?.length
          ? products.map((p: any) => <ProductCard key={p.id} p={p} />)
          : <p className="col-span-full text-fg-muted">Nog geen producten in deze categorie.</p>}
      </div>
    </div>
  );
}
