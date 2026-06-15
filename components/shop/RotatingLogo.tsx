'use client';

import { useEffect, useState } from 'react';

export default function RotatingLogo() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust the divisor to control the speed of the rotation
      // e.g. window.scrollY / 4 means 1 degree of rotation per 4 pixels scrolled
      setRotation(window.scrollY / 4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial rotation
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <img 
      src="/images/logo.svg" 
      alt="Fami Pro Logo" 
      className="h-[72px] md:h-[84px] w-auto object-contain drop-shadow-sm"
      style={{ 
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s ease-out', // Smooth out the rotation slightly
        willChange: 'transform' // Optimize performance
      }} 
    />
  );
}
