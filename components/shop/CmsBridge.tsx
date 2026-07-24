'use client';

import { useEffect } from 'react';

/**
 * Brug tussen de admin-voorvertoning (iframe-ouder) en de live site.
 * Alleen actief wanneer de URL `?cms=1` bevat — anders doet dit component niets
 * en registreert het geen listeners, zodat de publieke site onaangeroerd blijft.
 *
 * Protocol (postMessage):
 *  - Site → ouder: { type: 'cms-click', key }        (klik op bewerkbare tekst)
 *  - Site → ouder: { type: 'cms-image-click', key }   (klik op bewerkbare afbeelding)
 *  - Ouder → site: { type: 'cms-update', key, value }       (live tekst bijwerken)
 *  - Ouder → site: { type: 'cms-image-update', key, url }   (live afbeelding bijwerken;
 *      lege url → herstel de originele afbeelding)
 */
export default function CmsBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const active = new URLSearchParams(window.location.search).get('cms') === '1';
    if (!active) return;

    // Hover-outline + pointer-cursor voor bewerkbare elementen (tekst én afbeelding).
    const style = document.createElement('style');
    style.setAttribute('data-cms-style', '1');
    style.textContent = `
      [data-cms-key],[data-cms-image]{cursor:pointer;transition:outline-color .12s ease;}
      [data-cms-key]:hover,[data-cms-image]:hover{outline:2px dashed #3b82f6 !important;outline-offset:2px;}
      [data-cms-key].cms-selected,[data-cms-image].cms-selected{outline:2px solid #2563eb !important;outline-offset:2px;}
    `;
    document.head.appendChild(style);

    // Onthoud de originele src van elke bewerkbare afbeelding (voor herstel bij wissen).
    document.querySelectorAll<HTMLImageElement>('[data-cms-image]').forEach((img) => {
      if (img.dataset.cmsOriginalSrc == null) img.dataset.cmsOriginalSrc = img.getAttribute('src') ?? '';
    });

    const findEl = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest('[data-cms-key],[data-cms-image]');
    };

    const onClick = (e: MouseEvent) => {
      const el = findEl(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.cms-selected').forEach((n) => n.classList.remove('cms-selected'));
      el.classList.add('cms-selected');

      const imageKey = el.getAttribute('data-cms-image');
      if (imageKey) {
        window.parent?.postMessage({ type: 'cms-image-click', key: imageKey }, '*');
        return;
      }
      const key = el.getAttribute('data-cms-key');
      if (!key) return;
      window.parent?.postMessage({ type: 'cms-click', key }, '*');
    };

    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data.key !== 'string') return;

      if (data.type === 'cms-update') {
        document.querySelectorAll<HTMLElement>(`[data-cms-key="${data.key}"]`)
          .forEach((el) => { el.textContent = String(data.value ?? ''); });
        return;
      }

      if (data.type === 'cms-image-update') {
        const url = typeof data.url === 'string' ? data.url : '';
        document.querySelectorAll<HTMLImageElement>(`[data-cms-image="${data.key}"]`)
          .forEach((img) => {
            img.src = url || (img.dataset.cmsOriginalSrc ?? '');
          });
        return;
      }
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
