'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Sofa, Car, Droplets, Hand, Wrench, Tags } from 'lucide-react';

export default function CategoryCarousel() {
  const pathname = usePathname();

  const categories = [
    { name: 'Shop', slug: 'producten', icon: Store, isPath: true },
    { name: 'Interieur', slug: 'interieur', icon: Sofa },
    { name: 'Exterieur', slug: 'exterieur', icon: Car },
    { name: 'Droogdoeken', slug: 'droogdoeken', icon: Droplets },
    { name: 'Washandschoenen', slug: 'washandschoenen', icon: Hand },
    { name: 'Accessoires', slug: 'accessoires', icon: Wrench },
    { name: 'Combinatiedeals', slug: 'combinatiedeals', icon: Tags },
  ];

  return (
    <div className="w-full bg-panel border-b hairline">
      <div className="wrap py-3 md:py-4">
        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1">
          {categories.map((c) => {
            const href = c.isPath ? `/${c.slug}` : `/categorie/${c.slug}`;
            const isActive = pathname === href;
            const Icon = c.icon;
            
            return (
              <Link 
                key={c.slug} 
                href={href}
                className={`flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-full border hairline transition-all duration-300 ${
                  isActive 
                    ? 'bg-accent/10 border-accent/30 text-accent-bright' 
                    : 'bg-panel-2 hover:bg-panel-3 hover:-translate-y-0.5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'text-fg-muted'} />
                <span className="text-sm font-medium whitespace-nowrap">
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
