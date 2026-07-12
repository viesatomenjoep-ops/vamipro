'use client';
import { useEffect, useRef } from 'react';

/** Groot outlined getal dat naar `to` telt zodra het in beeld komt en zachtjes meedrijft met scroll. */
export default function GiantCounter({ to = 1200, className = '' }: { to?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = String(to); return; }
    el.textContent = '0';
    let counted = false, raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        counted = true;
        const start = performance.now(), dur = 2000;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 4))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: .3 });
    io.observe(el);
    const drift = () => {
      const r = el.parentElement!.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
      el.style.transform = `translateY(-50%) translateX(${(p * 6).toFixed(2)}%)`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(drift); };
    addEventListener('scroll', onScroll, { passive: true });
    drift();
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [to]);
  return <div ref={ref} className={`giant-num ${className}`} aria-hidden="true" />;
}
