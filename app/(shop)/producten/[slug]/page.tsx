import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { cldUrl } from '@/lib/cloudinary';
import { catBySlug } from '@/lib/categories';
import { notFound } from 'next/navigation';
import AddToCart from '@/components/shop/AddToCart';
import ProductCard from '@/components/shop/ProductCard';
import ProductDescription from '@/components/shop/ProductDescription';
import ImageGallery from '@/components/shop/ImageGallery';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { isMock, getMockProduct, getMockRelated } from '@/lib/mock-data';

export const revalidate = 60;
const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

const compareAtPrices: Record<string, number> = {
  'volledig-pakket-xxl': 20720,
  'exterieur-pakket': 6970,
  'combinatiedeal-interieur': 4780,
};

export async function generateStaticParams() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('products').select('slug').eq('is_active', true);
  return data?.map((p) => ({ slug: p.slug })) || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: p } = isMock ? getMockProduct(slug) as any : await supabase.from('products').select('*').ilike('slug', slug).single();
  
  if (!p) return { title: 'Product niet gevonden' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vamipro.nl';
  const url = `${siteUrl}/producten/${p.slug}`;
  const imageUrl = p.cloudinary_images?.[0] ? cldUrl(p.cloudinary_images[0], { w: 1200, h: 630 }) : `${siteUrl}/images/hero-audi.jpg`;

  return { 
    title: p.name, 
    description: p.short_description || p.description?.substring(0, 160),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: p.name,
      description: p.short_description || p.description?.substring(0, 160),
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: p.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: p.name,
      description: p.short_description || p.description?.substring(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: p } = isMock ? getMockProduct(slug) as any : await supabase.from('products').select('*, categories(slug, name)').ilike('slug', slug).single();
  if (!p) notFound();

  const { data: related } = isMock
    ? getMockRelated(p.category_id, p.id, 4) as any
    : await supabase.from('products')
        .select('*').eq('category_id', p.category_id).eq('is_active', true).neq('id', p.id).limit(4);

  const catSlug = (p.categories as any)?.slug;
  const meta = catSlug ? catBySlug(catSlug) : null;
  const imgs: string[] = p.cloudinary_images?.length ? p.cloudinary_images : [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vamipro.nl';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Producten', item: `${siteUrl}/producten` },
      ...(meta
        ? [{ '@type': 'ListItem', position: 3, name: meta.name, item: `${siteUrl}/categorie/${meta.slug}` }]
        : []),
      {
        '@type': 'ListItem',
        position: meta ? 4 : 3,
        name: p.name,
        item: `${siteUrl}/producten/${p.slug}`,
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: imgs.length > 0 ? imgs.map(img => cldUrl(img, { w: 800 })) : [`${siteUrl}/images/hero-audi.jpg`],
    description: p.description || p.short_description || '',
    sku: p.sku || p.slug,
    brand: {
      '@type': 'Brand',
      name: p.brand || 'VaMiPro',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/producten/${p.slug}`,
      priceCurrency: 'EUR',
      price: (p.price_cents / 100).toFixed(2),
      itemCondition: 'https://schema.org/NewCondition',
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="wrap pt-0 pb-12 lg:pt-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="flex items-center gap-2 text-sm text-fg-faint">
        <Link href="/producten" className="hover:text-accent">Producten</Link>
        {meta && (<><span>/</span><Link href={`/categorie/${meta.slug}`} className="hover:text-accent">{meta.name}</Link></>)}
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        <div className="w-full lg:w-[58%]">
          <ImageGallery images={imgs} productName={p.name} />
        </div>

        {/* Buy panel */}
        <div className="w-full lg:w-[42%] lg:sticky lg:top-24 lg:self-start">
          {p.brand && <p className="text-xs uppercase tracking-[0.2em] text-fg-faint">{p.brand}</p>}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">{p.name}</h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-fg">{euro(p.price_cents)}</span>
            {(p.compare_at_price_cents || compareAtPrices[p.slug]) && (
              <span className="font-display text-xl text-fg-muted line-through decoration-red-500">
                {euro(p.compare_at_price_cents || compareAtPrices[p.slug])}
              </span>
            )}
            <span className="text-sm text-fg-muted ml-1">incl. btw</span>
          </div>
          <p className="mt-1 text-sm">
            {p.stock > 0
              ? <span className="text-accent">● Op voorraad — vandaag verzonden</span>
              : <span className="text-fg-faint">Tijdelijk uitverkocht</span>}
          </p>

          <ProductDescription text={p.description || ''} />

          <div className="mt-7">
            <AddToCart product={{ productId: p.id, name: p.name, slug: p.slug, priceCents: p.price_cents, image: imgs[0] }} outOfStock={p.stock <= 0} />
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
