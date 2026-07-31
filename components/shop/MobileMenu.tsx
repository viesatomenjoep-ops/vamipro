'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileMenu({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal pas op de client renderen (document bestaat niet tijdens SSR)
  useEffect(() => { setMounted(true); }, []);

  // Sluit bij navigatie
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Geen scroll op de achtergrond wanneer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Hoofditems in volgorde (voor de trapsgewijze animatie)
  const primary: { href: string; label: string; big?: boolean }[] = [
    { href: '/producten', label: 'Alle producten', big: true },
    ...(categories ?? []).map((c: any) => ({ href: `/categorie/${c.slug}`, label: c.name })),
    { href: '/contact', label: 'Contact', big: true },
  ];
  const info = [
    { href: '/verzending', label: 'Verzending' },
    { href: '/retourneren', label: 'Retourneren' },
    { href: '/over-ons', label: 'Over ons' },
    { href: '/voorwaarden', label: 'Voorwaarden' },
  ];

  // Klasse voor het trapsgewijs in-schuiven van een item
  const item = (i: number) =>
    `transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
    }`;

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-full text-fg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Menu openen"
      >
        <Menu size={28} strokeWidth={1.5} />
      </button>

      {/* Overlay-paneel — via portal in <body> zodat het niet in de header-context
          (backdrop-blur maakt een containing block) blijft hangen. Zo vult het
          hele scherm met een volledig zwarte achtergrond. */}
      {mounted && createPortal(
        <div
          className={`fixed inset-0 z-[120] bg-black ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}
          aria-hidden={!isOpen}
        >
          <div className="relative flex h-[100dvh] flex-col px-5 pb-6 pt-4">
          {/* Kop */}
          <div className="flex items-center justify-between">
            <img src="/images/logo.png" alt="VaMiPro" className="h-8 w-auto" />
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white -mr-1"
              aria-label="Menu sluiten"
            >
              <X size={26} strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigatie */}
          <nav className="mt-5 flex flex-1 flex-col overflow-y-auto">
            <p
              className={`mb-2.5 text-[11px] uppercase tracking-[0.28em] text-white/40 ${item(0)}`}
              style={{ transitionDelay: `${isOpen ? 60 : 0}ms` }}
            >
              Menu
            </p>

            <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
              {primary.map((it, i) => (
                <Link
                  key={it.href + i}
                  prefetch
                  href={it.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between py-3 ${item(i)} ${it.big ? 'text-xl font-semibold text-white' : 'text-lg text-white/85'}`}
                  style={{ transitionDelay: `${isOpen ? 110 + i * 40 : 0}ms` }}
                >
                  <span className="transition-colors group-hover:text-accent">{it.label}</span>
                  <ArrowRight size={18} className="text-white/25 transition-all group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              ))}
            </div>

            {/* Info onderaan */}
            <div className="mt-auto pt-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] text-white/50">
                {info.map((it, i) => (
                  <Link
                    key={it.href}
                    prefetch
                    href={it.href}
                    onClick={() => setIsOpen(false)}
                    className={`hover:text-white ${item(i)}`}
                    style={{ transitionDelay: `${isOpen ? 110 + (primary.length + i) * 40 : 0}ms` }}
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
