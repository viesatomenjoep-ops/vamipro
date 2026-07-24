'use client';

import { useEffect } from 'react';

/**
 * Brug tussen de admin-voorvertoning (iframe-ouder) en de live site.
 * Alleen actief wanneer de URL `?cms=1` bevat — anders doet dit component niets
 * en registreert het geen listeners, zodat de publieke site onaangeroerd blijft.
 *
 * Protocol (postMessage):
 *  Site → ouder:
 *   - { type: 'cms-click', key }             (klik op bewerkbare tekst)
 *   - { type: 'cms-image-click', key }        (klik op bewerkbare afbeelding, bv. hero)
 *   - { type: 'cms-cat-click', id }           (klik op een categorie-tegel)
 *   - { type: 'cms-product-click', id }       (klik op een productfoto)
 *  Ouder → site:
 *   - { type: 'cms-update', key, value }               (live tekst bijwerken)
 *   - { type: 'cms-image-update', key, url }            (live afbeelding bijwerken; leeg → origineel)
 *   - { type: 'cms-cat-text', id, field, value }        (categorie 'name' of 'desc' bijwerken)
 *   - { type: 'cms-cat-image', id, url }                (categorie-afbeelding; leeg → origineel)
 *   - { type: 'cms-product-image', id, url }            (productfoto; leeg → origineel)
 *   - { type: 'cms-product-price', id, value }           (productprijs live bijwerken)
 */
export default function CmsBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const active = new URLSearchParams(window.location.search).get('cms') === '1';
    if (!active) return;

    // Hover-outline + pointer-cursor voor bewerkbare elementen (tekst, afbeelding, tegel, productfoto).
    const style = document.createElement('style');
    style.setAttribute('data-cms-style', '1');
    style.textContent = `
      [data-cms-key],[data-cms-image],[data-cms-cat],[data-cms-product],[data-cms-product-price]{cursor:pointer;transition:outline-color .12s ease;}
      [data-cms-key]:hover,[data-cms-image]:hover,[data-cms-cat]:hover,[data-cms-product]:hover,[data-cms-product-price]:hover{outline:2px dashed #3b82f6 !important;outline-offset:2px;}
      [data-cms-key].cms-selected,[data-cms-image].cms-selected,[data-cms-cat].cms-selected,[data-cms-product].cms-selected,[data-cms-product-price].cms-selected{outline:2px solid #2563eb !important;outline-offset:2px;}
    `;
    document.head.appendChild(style);

    // Onthoud de originele src van elke bewerkbare afbeelding (voor herstel bij wissen).
    document
      .querySelectorAll<HTMLImageElement>('[data-cms-image],[data-cms-cat] [data-cms-cat-img],[data-cms-product]')
      .forEach((img) => {
        if (img.dataset.cmsOriginalSrc == null) img.dataset.cmsOriginalSrc = img.getAttribute('src') ?? '';
      });

    const findEl = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest('[data-cms-key],[data-cms-image],[data-cms-cat],[data-cms-product],[data-cms-product-price]');
    };

    const select = (el: HTMLElement) => {
      document.querySelectorAll('.cms-selected').forEach((n) => n.classList.remove('cms-selected'));
      el.classList.add('cms-selected');
    };

    const onClick = (e: MouseEvent) => {
      const el = findEl(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      select(el);

      // Volgorde: prijs > product > categorie > afbeelding (hero) > tekst.
      const priceId = el.getAttribute('data-cms-product-price');
      if (priceId) {
        window.parent?.postMessage({ type: 'cms-product-click', id: priceId }, '*');
        return;
      }
      const productId = el.getAttribute('data-cms-product');
      if (productId) {
        window.parent?.postMessage({ type: 'cms-product-click', id: productId }, '*');
        return;
      }
      const catId = el.getAttribute('data-cms-cat');
      if (catId) {
        window.parent?.postMessage({ type: 'cms-cat-click', id: catId }, '*');
        return;
      }
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
      if (!data || typeof data.type !== 'string') return;

      if (data.type === 'cms-update' && typeof data.key === 'string') {
        document.querySelectorAll<HTMLElement>(`[data-cms-key="${data.key}"]`)
          .forEach((el) => { el.textContent = String(data.value ?? ''); });
        return;
      }

      if (data.type === 'cms-image-update' && typeof data.key === 'string') {
        const url = typeof data.url === 'string' ? data.url : '';
        document.querySelectorAll<HTMLImageElement>(`[data-cms-image="${data.key}"]`)
          .forEach((img) => { img.src = url || (img.dataset.cmsOriginalSrc ?? ''); });
        return;
      }

      if (data.type === 'cms-cat-text' && typeof data.id === 'string') {
        const field = data.field === 'name' ? 'name' : 'desc';
        const value = String(data.value ?? '');
        document
          .querySelectorAll<HTMLElement>(`[data-cms-cat="${data.id}"] [data-cms-cat-field="${field}"]`)
          .forEach((el) => { el.textContent = value; });
        // Best-effort: werk ook het volgnummer-label (.t-idx) bij bij een naamwijziging.
        if (field === 'name') {
          document.querySelectorAll<HTMLElement>(`[data-cms-cat="${data.id}"] .t-idx`).forEach((el) => {
            const prefix = (el.textContent || '').split('—')[0];
            el.textContent = `${prefix}— ${value}`;
          });
        }
        return;
      }

      if (data.type === 'cms-cat-image' && typeof data.id === 'string') {
        const url = typeof data.url === 'string' ? data.url : '';
        document
          .querySelectorAll<HTMLImageElement>(`[data-cms-cat="${data.id}"] [data-cms-cat-img]`)
          .forEach((img) => { img.src = url || (img.dataset.cmsOriginalSrc ?? ''); });
        return;
      }

      if (data.type === 'cms-product-image' && typeof data.id === 'string') {
        const url = typeof data.url === 'string' ? data.url : '';
        document
          .querySelectorAll<HTMLImageElement>(`[data-cms-product="${data.id}"]`)
          .forEach((img) => { img.src = url || (img.dataset.cmsOriginalSrc ?? ''); });
        return;
      }

      if (data.type === 'cms-product-price' && typeof data.id === 'string') {
        const value = String(data.value ?? '');
        document
          .querySelectorAll<HTMLElement>(`[data-cms-product-price="${data.id}"]`)
          .forEach((el) => { el.textContent = value; });
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
