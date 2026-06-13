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

      {/* Backdrop (niet meer echt nodig als het full-screen is, maar we houden de animatie) */}
      <div 
        className={`fixed inset-0 z-[100] bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-in / Fade-in full screen panel */}
      <div 
        className={`fixed inset-0 z-[101] w-full h-full bg-black p-6 transition-all duration-300 flex flex-col ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <p className="font-display text-lg font-semibold tracking-tight text-white">VAMI<span className="text-accent">.</span>PRO</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white -mr-2"
            aria-label="Menu sluiten"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-col gap-8 text-2xl font-medium overflow-y-auto pb-8 pt-4 px-2">
          <Link prefetch={true} href="/producten" className="text-white hover:text-accent transition-colors">Shop Alle Producten</Link>
          
          <div className="h-px w-full bg-white/10" />
          
          <div className="flex flex-col gap-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Categorieën</p>
            {categories?.map(c => (
              <Link prefetch={true} key={c.id} href={`/categorie/${c.slug}`} className="text-white hover:text-accent transition-colors">
                {c.name}
              </Link>
            ))}
          </div>
          
          <div className="h-px w-full bg-white/10 mt-2" />
          
          <Link prefetch={true} href="/contact" className="text-white hover:text-accent transition-colors">Contact</Link>
        </nav>
      </div>
    </div>
  );
}
