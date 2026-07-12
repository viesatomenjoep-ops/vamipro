import Link from 'next/link';
import CartButton from './CartButton';
import MobileMenu from './MobileMenu';
import { ThemeToggle } from '../ThemeToggle';
import { createServiceClient } from '@/lib/supabase/server';

export default async function Header() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
      <div className="wrap flex h-24 md:h-28 items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo-clean.png"
            alt="VamiPro — professionele detailingproducten"
            className="h-[56px] md:h-[72px] w-auto object-contain drop-shadow-sm"
          />
        </Link>
        <nav className="hidden items-center gap-7 text-[15px] text-white/70 lg:flex">
          <Link prefetch={true} href="/producten" className="nav-link hover:text-white">Shop</Link>
          {categories?.slice(0, 4).map(c => (
            <Link key={c.id} prefetch={true} href={`/categorie/${c.slug}`} className="nav-link hover:text-white">{c.name}</Link>
          ))}
          <Link prefetch={true} href="/contact" className="nav-link hover:text-white">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <CartButton />
          <MobileMenu categories={categories || []} />
        </div>
      </div>
    </header>
  );
}
