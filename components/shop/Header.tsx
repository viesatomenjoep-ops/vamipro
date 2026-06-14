import Link from 'next/link';
import CartButton from './CartButton';
import MobileMenu from './MobileMenu';
import { createServiceClient } from '@/lib/supabase/server';

export default async function Header() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-bg/80 backdrop-blur-md">
      <div className="wrap flex h-24 items-center justify-between">
        <Link href="/" className="flex items-center">
          <img 
            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,h_160/vamipro/dqulcjn15ujhdbeiyvxv`} 
            alt="Vami Pro Logo" 
            className="h-[72px] md:h-[84px] w-auto object-contain" 
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-fg-muted md:flex">
          <Link prefetch={true} href="/producten" className="hover:text-fg transition-colors">Shop</Link>
          {categories?.map(c => (
            <Link prefetch={true} key={c.id} href={`/categorie/${c.slug}`} className="hover:text-fg transition-colors">
              {c.name}
            </Link>
          ))}
          <Link prefetch={true} href="/contact" className="hover:text-fg transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <CartButton />
          <MobileMenu categories={categories || []} />
        </div>
      </div>
    </header>
  );
}
