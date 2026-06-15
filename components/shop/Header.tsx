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
        <Link href="/" className="relative z-[100] flex items-center h-full">
          <img 
            src="/images/logo.svg" 
            alt="Fami Pro Logo" 
            className="absolute top-2 left-0 w-[110px] md:w-[140px] h-auto drop-shadow-md" 
          />
          <div className="w-[110px] md:w-[140px]" aria-hidden="true"></div>
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
