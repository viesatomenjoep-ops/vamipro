'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCarousel({ categories }: { categories: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative w-full group py-4">
      {canScrollLeft && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 z-10 bg-panel/80 backdrop-blur border hairline w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2 px-4 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((c, i) => (
          <Link 
            key={c.slug} 
            href={`/categorie/${c.slug}`}
            className="flex-shrink-0 snap-start w-[240px] sm:w-[280px] md:w-[320px] bg-panel border hairline p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:bg-panel-2 hover:-translate-y-2 hover:shadow-xl group/card relative overflow-hidden"
          >
            {/* Subtle gradient background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <span className="font-display text-xs md:text-sm text-accent transition-transform duration-300 group-hover/card:scale-110 group-hover/card:translate-x-1 inline-block">
                0{i + 1}
              </span>
              <div className="mt-6 md:mt-8">
                <h3 className="font-display text-xl md:text-2xl font-medium transition-colors duration-300 group-hover/card:text-accent-bright">
                  {c.name}
                </h3>
                {c.description && (
                  <p className="mt-2 md:mt-3 text-sm md:text-base text-fg-muted line-clamp-2">
                    {c.description}
                  </p>
                )}
              </div>
            </div>
            
            <span className="relative z-10 mt-6 md:mt-8 inline-block text-sm font-medium text-fg-faint transition-all duration-300 group-hover/card:text-accent group-hover/card:translate-x-2">
              Bekijk categorie →
            </span>
          </Link>
        ))}
      </div>

      {canScrollRight && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 z-10 bg-panel/80 backdrop-blur border hairline w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </div>
  );
}
