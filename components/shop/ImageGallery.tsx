'use client';

import { useState } from 'react';
import { cldUrl } from '@/lib/cloudinary';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ZoomImage from './ZoomImage';

export default function ImageGallery({ images, productName }: { images: string[], productName: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="card aspect-square overflow-hidden">
        <div className="grid h-full w-full place-items-center bg-panel-2">
          <span className="font-display text-sm uppercase tracking-[0.25em] text-fg-faint">Vami Pro</span>
        </div>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Image with Zoom */}
        <div 
          className="card aspect-square overflow-hidden bg-white/5 dark:bg-white/5"
          onClick={() => openLightbox(0)}
        >
          <div className="w-full h-full p-4 md:p-8">
            <ZoomImage image={images[0]} alt={productName} />
          </div>
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((img, i) => (
              <div 
                key={i} 
                className="card aspect-square overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => openLightbox(i)}
              >
                <img src={cldUrl(img, { w: 240 })} alt={`${productName} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 p-2"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          
          {images.length > 1 && (
            <button 
              className="absolute left-4 md:left-10 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft size={32} />
            </button>
          )}
          
          <img 
            src={cldUrl(images[currentIndex], { w: 2000 })} 
            alt={productName} 
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()} 
          />
          
          {images.length > 1 && (
            <button 
              className="absolute right-4 md:right-10 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight size={32} />
            </button>
          )}
          
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium bg-black/50 px-4 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
