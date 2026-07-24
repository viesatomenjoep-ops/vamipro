'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileMenu({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
        className="flex h-14 w-14 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        aria-label="Menu openen"
      >
        <Menu size={34} strokeWidth={1.5} />
      </button>

      {/* Overlay-paneel */}
      <div
        className={`fixed inset-0 z-[120] ${isOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!isOpen}
      >
        {/* Achtergrond die invaagt */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        {/* Subtiele accent-gloed bovenaan */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'radial-gradient(120% 80% at 100% 0%, var(--accent-glow, rgba(59,107,255,.18)), transparent 60%)' }}
        />

        <div className="relative flex h-[100dvh] flex-col p-6 sm:p-8">
          {/* Kop */}
          <div className="flex items-center justify-between">
            <img src="/images/logo.png" alt="VaMiPro" className="h-11 w-auto" />
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-14 w-14 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white -mr-2"
              aria-label="Menu sluiten"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigatie */}
          <nav className="mt-8 flex flex-1 flex-col overflow-y-auto">
            <p
              className={`mb-4 text-xs uppercase tracking-[0.28em] text-white/40 ${item(0)}`}
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
                  className={`group flex items-center justify-between py-4 ${item(i)} ${it.big ? 'text-3xl font-semibold text-white' : 'text-2xl text-white/85'}`}
                  style={{ transitionDelay: `${isOpen ? 110 + i * 45 : 0}ms` }}
                >
                  <span className="transition-colors group-hover:text-accent">{it.label}</span>
                  <ArrowRight size={20} className="text-white/25 transition-all group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              ))}
            </div>

            {/* Info onderaan */}
            <div className="mt-auto pt-8">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/50">
                {info.map((it, i) => (
                  <Link
                    key={it.href}
                    prefetch
                    href={it.href}
                    onClick={() => setIsOpen(false)}
                    className={`hover:text-white ${item(i)}`}
                    style={{ transitionDelay: `${isOpen ? 110 + (primary.length + i) * 45 : 0}ms` }}
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
