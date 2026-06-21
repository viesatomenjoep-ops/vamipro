"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { liveSearch } from "@/app/actions/search";
import { cldUrl } from "@/lib/cloudinary";

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default function LiveSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ categories: any[], products: any[] }>({ categories: [], products: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await liveSearch(query);
          setResults(res);
          setIsOpen(true);
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults({ categories: [], products: [] });
        setIsOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/producten?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-40">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-accent">
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </div>
        
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true) }}
          placeholder="Zoek naar producten..." 
          className="w-full bg-fg border-2 border-accent rounded-full py-4 pl-14 pr-32 text-bg placeholder:text-bg placeholder:opacity-60 focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all text-base md:text-sm font-medium shadow-2xl"
          required
        />
        
        <button 
          type="submit" 
          className="absolute right-2 top-2 bottom-2 bg-accent text-white rounded-full px-6 font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          Zoeken
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (results.categories.length > 0 || results.products.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-panel border border-line rounded-2xl shadow-xl overflow-hidden text-left divide-y divide-line z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          
          {results.categories.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs uppercase tracking-wider text-fg-faint font-semibold">Categorieën</p>
              {results.categories.map((c) => (
                <Link 
                  key={c.id} 
                  href={`/categorie/${c.slug}`}
                  onClick={handleLinkClick}
                  className="block px-3 py-2.5 rounded-lg hover:bg-panel-2 transition-colors font-medium text-fg"
                >
                  <Search size={14} className="inline mr-2 text-fg-muted" />
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {results.products.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs uppercase tracking-wider text-fg-faint font-semibold">Producten</p>
              {results.products.map((p) => {
                const img = p.cloudinary_images?.[0];
                return (
                  <Link 
                    key={p.id} 
                    href={`/producten/${p.slug}`}
                    onClick={handleLinkClick}
                    className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-panel-2 transition-colors"
                  >
                    <div className="w-12 h-12 bg-panel-2 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                      {img ? (
                        <img src={cldUrl(img, { w: 100 })} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] uppercase tracking-wider text-fg-faint">VaMi</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-fg truncate">{p.name}</h4>
                      <p className="text-xs text-accent font-semibold">{euro(p.price_cents)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="p-2 bg-panel-2/50">
            <button 
              onClick={handleSubmit}
              className="w-full text-center py-2.5 text-sm font-medium text-accent hover:text-accent-deep transition-colors"
            >
              Bekijk alle resultaten voor "{query}" &rarr;
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
