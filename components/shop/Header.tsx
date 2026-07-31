import Link from 'next/link';
import CartButton from './CartButton';
import MobileMenu from './MobileMenu';
import { ThemeToggle } from '../ThemeToggle';
import { createServiceClient } from '@/lib/supabase/server';

export default async function Header() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-black/75 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="wrap flex h-24 md:h-28 items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/images/logo.png"
            alt="VamiPro — professionele detailingproducten"
            className="h-[56px] md:h-[72px] w-auto object-contain drop-shadow-sm"
          />
        </Link>
        <nav className="hidden items-center gap-x-6 xl:gap-x-8 text-[13px] tracking-wide lg:flex">
          {[
            { href: '/producten', label: 'Alle producten' },
            ...(categories || []).map((c: any) => ({ href: `/categorie/${c.slug}`, label: c.name })),
            { href: '/contact', label: 'Contact' },
          ].map((l) => (
            <Link
              key={l.href}
              prefetch
              href={l.href}
              className="relative py-1 text-black/65 transition-colors duration-200 hover:text-black dark:text-white/70 dark:hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-accent-bright after:transition-transform after:duration-300 hover:after:scale-x-100 whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
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
