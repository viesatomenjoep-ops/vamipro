import Link from 'next/link';
import CartButton from './CartButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-bg/80 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          VAMI<span className="text-accent">.</span>PRO
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-fg-muted md:flex">
          <Link href="/producten" className="hover:text-fg transition-colors">Shop</Link>
          <Link href="/categorie/exterieur-wassen" className="hover:text-fg transition-colors">Exterieur & Wassen</Link>
          <Link href="/categorie/accessoires-washulpmiddelen" className="hover:text-fg transition-colors">Accessoires</Link>
          <Link href="/faq" className="hover:text-fg transition-colors">FAQ</Link>
          <Link href="/contact" className="hover:text-fg transition-colors">Contact</Link>
        </nav>
        <CartButton />
      </div>
    </header>
  );
}
