'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductDescription({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // If text is short, just show it normally
  if (!text || text.length < 200) {
    return <p className="mt-6 leading-relaxed text-sm text-fg-muted whitespace-pre-wrap">{text}</p>;
  }

  // Otherwise, provide a read-more toggle
  return (
    <div className="mt-6">
      <div 
        className={`text-sm leading-relaxed text-fg-muted whitespace-pre-wrap overflow-hidden transition-all duration-300 relative ${
          isOpen ? '' : 'max-h-[120px]'
        }`}
      >
        {text}
        
        {/* Fading bottom edge when collapsed */}
        {!isOpen && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
        )}
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-bright transition-colors"
      >
        {isOpen ? 'Lees minder' : 'Lees meer'}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
}
