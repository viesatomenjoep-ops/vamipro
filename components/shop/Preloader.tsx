'use client';
import { useEffect, useRef, useState } from 'react';

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [done, setDone] = useState(false);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setGone(true); return; }
    // Alleen bij eerste bezoek in deze sessie
    if (sessionStorage.getItem('vp-loaded')) { setGone(true); return; }
    const start = performance.now();
    const dur = 1250;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const v = Math.round(eased * 100);
      if (numRef.current) numRef.current.textContent = String(v).padStart(2, '0');
      if (barRef.current) barRef.current.style.width = v + '%';
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem('vp-loaded', '1');
        setTimeout(() => setDone(true), 150);
        setTimeout(() => setGone(true), 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  return (
    <div id="vp-preloader" className={done ? 'done' : ''} aria-hidden="true">
      <img src="/images/logo-clean.png" alt="" style={{ height: 68, width: 'auto' }} />
      <div className="pl-bar"><i ref={barRef as any} /></div>
      <div className="pl-count"><span ref={numRef}>00</span> %</div>
    </div>
  );
}
