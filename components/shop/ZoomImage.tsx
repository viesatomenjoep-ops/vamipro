"use client";

import React, { useState, useRef } from "react";
import { cldUrl } from "@/lib/cloudinary";

interface ZoomImageProps {
  image: any;
  alt: string;
}

export default function ZoomImage({ image, alt }: ZoomImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Bereken het percentage van de muis/vinger positie in de container
    let x = ((clientX - left) / width) * 100;
    let y = ((clientY - top) / height) * 100;

    // Houd binnen de randen
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setPosition({ x, y });
  };

  const handleEnter = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsZoomed(true);
    handleMove(e); // Zet direct de juiste startpositie
  };

  const handleLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-crosshair touch-none rounded-2xl"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      onTouchMove={handleMove}
    >
      <img
        src={cldUrl(image, { w: 1000 })}
        alt={alt}
        className="w-full h-full object-contain transition-transform duration-300 ease-out"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isZoomed ? "scale(2.5)" : "scale(1)"
        }}
      />
      {/* Subtiele hint (optioneel, nu weggelaten voor strak design) */}
    </div>
  );
}
