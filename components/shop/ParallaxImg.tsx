'use client';
import { useEffect, useRef } from 'react';

/** Subtiele scroll-parallax: schuift het kind-element verticaal o.b.v. sectiepositie. */
export default function ParallaxImg({ children, strength = 10, className = '' }: {
  children: React.ReactNode; strength?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current; if (!el) return;
    let raf = 0, active = false;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1..1
      el.style.transform = `translateY(${(-p * strength).toFixed(2)}%)`;
      raf = 0;
    };
    const onScroll = () => { if (active && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; if (active) onScroll(); });
    io.observe(el);
    addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [strength]);
  return <div ref={ref} className={className} style={{ willChange: 'transform' }}>{children}</div>;
}
