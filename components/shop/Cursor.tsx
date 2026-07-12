'use client';
import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const dot = document.createElement('div'); dot.id = 'vp-cursor';
    const ring = document.createElement('div'); ring.id = 'vp-cursor-ring';
    document.body.append(dot, ring);
    let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      rx += (tx - rx) * .14; ry += (ty - ry) * .14;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: MouseEvent) => {
      const on = (e.target as HTMLElement).closest('a,button,[data-hover]');
      ring.style.width = on ? '56px' : '34px';
      ring.style.height = on ? '56px' : '34px';
      ring.style.borderColor = on ? 'rgba(79,140,255,.9)' : 'rgba(79,140,255,.5)';
    };
    addEventListener('mousemove', move, { passive: true });
    addEventListener('mouseover', over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move); removeEventListener('mouseover', over); dot.remove(); ring.remove(); };
  }, []);
  return null;
}
