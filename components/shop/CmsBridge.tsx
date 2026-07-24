'use client';

import { useEffect } from 'react';

/**
 * Brug tussen de admin-voorvertoning (iframe-ouder) en de live site.
 * Alleen actief wanneer de URL `?cms=1` bevat — anders doet dit component niets
 * en registreert het geen listeners, zodat de publieke site onaangeroerd blijft.
 *
 * Protocol (postMessage):
 *  - Site → ouder: { type: 'cms-click', key }   (bij klik op een bewerkbaar element)
 *  - Ouder → site: { type: 'cms-update', key, value }  (live tekst bijwerken)
 */
export default function CmsBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const active = new URLSearchParams(window.location.search).get('cms') === '1';
    if (!active) return;

    // Hover-outline + pointer-cursor voor bewerkbare elementen.
    const style = document.createElement('style');
    style.setAttribute('data-cms-style', '1');
    style.textContent = `
      [data-cms-key]{cursor:pointer;transition:outline-color .12s ease;}
      [data-cms-key]:hover{outline:2px dashed #3b82f6 !important;outline-offset:2px;}
      [data-cms-key].cms-selected{outline:2px solid #2563eb !important;outline-offset:2px;}
    `;
    document.head.appendChild(style);

    const findEl = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest('[data-cms-key]');
    };

    const onClick = (e: MouseEvent) => {
      const el = findEl(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const key = el.getAttribute('data-cms-key');
      if (!key) return;
      document.querySelectorAll('[data-cms-key].cms-selected')
        .forEach((n) => n.classList.remove('cms-selected'));
      el.classList.add('cms-selected');
      window.parent?.postMessage({ type: 'cms-click', key }, '*');
    };

    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.type !== 'cms-update' || typeof data.key !== 'string') return;
      document.querySelectorAll<HTMLElement>(`[data-cms-key="${data.key}"]`)
        .forEach((el) => { el.textContent = String(data.value ?? ''); });
    };

    // Gebruik capture zodat we navigatie/klik van links en knoppen kunnen onderscheppen.
    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMessage);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('message', onMessage);
      style.remove();
    };
  }, []);

  return null;
}
