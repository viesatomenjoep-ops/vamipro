'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileMenu({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-panel-2 hover:text-fg"
        aria-label="Menu openen"
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-in panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-[101] w-4/5 max-w-sm bg-panel border-l hairline p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <p className="font-display text-lg font-semibold tracking-tight">VAMI<span className="text-accent">.</span>PRO</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-panel-2 hover:text-fg -mr-2"
            aria-label="Menu sluiten"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 text-lg font-medium overflow-y-auto pb-8">
          <Link prefetch={true} href="/producten" className="hover:text-accent transition-colors">Shop Alle Producten</Link>
          
          <div className="h-px w-full bg-line" />
          
          <p className="text-xs uppercase tracking-[0.2em] text-fg-faint -mb-2">Categorieën</p>
          {categories?.map(c => (
            <Link prefetch={true} key={c.id} href={`/categorie/${c.slug}`} className="text-fg-muted hover:text-accent transition-colors">
              {c.name}
            </Link>
          ))}
          
          <div className="h-px w-full bg-line mt-2" />
          
          <Link prefetch={true} href="/contact" className="hover:text-accent transition-colors">Contact</Link>
        </nav>
      </div>
    </div>
  );
}
