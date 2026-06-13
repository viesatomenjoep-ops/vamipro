import Link from 'next/link';
import CartButton from './CartButton';
import { createServiceClient } from '@/lib/supabase/server';
import { CldImage } from 'next-cloudinary';

export default async function Header() {
  const supabase = createServiceClient();
  const { data: settings } = await supabase.from('store_settings').select('logo_url').eq('id', 1).single();
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-bg/80 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight flex items-center">
          {settings?.logo_url ? (
            <CldImage src={settings.logo_url} width={120} height={40} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <>VAMI<span className="text-accent">.</span>PRO</>
          )}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-fg-muted md:flex">
          <Link href="/producten" className="hover:text-fg transition-colors">Shop</Link>
          {categories?.map(c => (
            <Link key={c.id} href={`/categorie/${c.slug}`} className="hover:text-fg transition-colors">
              {c.name}
            </Link>
          ))}
          <Link href="/contact" className="hover:text-fg transition-colors">Contact</Link>
        </nav>
        <CartButton />
      </div>
    </header>
  );
}
