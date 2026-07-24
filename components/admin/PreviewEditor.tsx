'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { saveContent } from '@/app/admin/actions';
import { CONTENT_FIELDS } from '@/lib/content-fields';
import { cldUrl } from '@/lib/cloudinary';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

/**
 * Live-voorvertoning met klik-om-te-bewerken.
 *
 * Protocol (postMessage):
 *  - iframe (site) → editor: { type: 'cms-click', key }        → tekstveld focussen/markeren
 *  - iframe (site) → editor: { type: 'cms-image-click', key }  → afbeeldingskaart markeren
 *  - editor → iframe (site): { type: 'cms-update', key, value }        → live tekst tonen
 *  - editor → iframe (site): { type: 'cms-image-update', key, url }    → live afbeelding tonen
 *      (lege url → herstel de standaardafbeelding)
 */
export default function PreviewEditor({ content }: { content: Record<string, string> }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Welke groepen zijn opengeklapt (standaard alles dicht behalve de eerste secties).
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { __images: true };
    CONTENT_FIELDS.forEach((g, i) => { init[g.group] = i === 0; });
    return init;
  });

  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // Vind de standaardtekst voor een key (zodat lege velden de default tonen in de preview).
  const defFor = (key: string) => {
    for (const g of CONTENT_FIELDS) for (const f of g.items) if (f.key === key) return f.def;
    return '';
  };

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    CONTENT_FIELDS.forEach((g) => g.items.forEach((f) => { init[f.key] = content[f.key] ?? f.def; }));
    return init;
  });

  // Hero-afbeelding (Cloudinary public id in een array voor CloudinaryUpload).
  const [heroImage, setHeroImage] = useState<string[]>(
    content.hero_image ? [content.hero_image] : [],
  );

  const heroUrl = (publicId: string) => (publicId ? cldUrl(publicId, { w: 1920, h: 1080 }) : '');

  const postUpdate = (key: string, value: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'cms-update', key, value: value || defFor(key) },
      '*',
    );
  };

  const postImageUpdate = (key: string, url: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'cms-image-update', key, url },
      '*',
    );
  };

  const setVal = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    postUpdate(key, value);
  };

  const handleHeroChange = (ids: string[]) => {
    const publicId = ids[0] || '';
    setHeroImage(publicId ? [publicId] : []);
    postImageUpdate('hero_image', heroUrl(publicId));
  };

  const clearHero = () => {
    setHeroImage([]);
    postImageUpdate('hero_image', '');
  };

  const highlightHeroCard = () => {
    const el = heroCardRef.current;
    if (!el) return;
    setOpenGroups((prev) => ({ ...prev, __images: true }));
    el.scrollIntoView({ block: 'center' });
    el.classList.add('ring-2', 'ring-accent');
    window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent'), 1500);
  };

  // Luister naar klikken vanuit de iframe → focus/markeer het bijbehorende veld of kaart.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data.key !== 'string') return;

      if (data.type === 'cms-image-click' && data.key === 'hero_image') {
        highlightHeroCard();
        return;
      }

      if (data.type === 'cms-click') {
        // Zorg dat de groep waarin dit veld staat opengeklapt is.
        const group = CONTENT_FIELDS.find((g) => g.items.some((f) => f.key === data.key));
        if (group) setOpenGroups((prev) => ({ ...prev, [group.group]: true }));
        // Wacht een frame zodat het veld gerenderd is na het openklappen.
        window.setTimeout(() => {
          const el = document.getElementById('cms-field-' + data.key);
          if (!el) return;
          el.scrollIntoView({ block: 'center' });
          (el as HTMLElement).focus();
          el.classList.add('ring-2', 'ring-accent');
          window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent'), 1500);
        }, 0);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Bij (her)laden van de iframe: duw de huidige (mogelijk onopgeslagen) waarden erin.
  const pushAllToIframe = () => {
    CONTENT_FIELDS.forEach((g) => g.items.forEach((f) => postUpdate(f.key, values[f.key] ?? '')));
    postImageUpdate('hero_image', heroUrl(heroImage[0] || ''));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    const fd = new FormData();
    CONTENT_FIELDS.forEach((g) => g.items.forEach((f) => fd.append(f.key, values[f.key] ?? '')));
    fd.set('hero_image', heroImage[0] || '');
    await saveContent(fd);
    setLoading(false);
    setSaved(true);
    // Herlaad de preview zodat de opgeslagen inhoud uit de database wordt getoond.
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <iframe
          ref={iframeRef}
          src="/?cms=1"
          onLoad={pushAllToIframe}
          className="w-full h-[80vh] rounded border hairline bg-white"
          title="Live voorvertoning"
        />
        <p className="mt-2 text-xs text-fg-faint">Klik in de voorvertoning op een tekst of de bovenste foto om die te bewerken.</p>
      </div>

      <div className="space-y-4">
        {/* Sticky opslaan-balk */}
        <div className="sticky top-0 z-10 -mx-1 flex items-center gap-3 rounded-lg border hairline bg-bg/90 px-4 py-3 backdrop-blur">
          <button type="button" onClick={handleSave} disabled={loading} className="btn btn-primary">
            {loading ? 'Bezig met opslaan...' : 'Opslaan'}
          </button>
          {saved && <span className="text-sm text-accent">Opgeslagen ✓ — de website is bijgewerkt.</span>}
        </div>

        {/* Afbeeldingen */}
        <details open={openGroups.__images} className="card !p-0 overflow-hidden">
          <summary
            onClick={(e) => { e.preventDefault(); toggleGroup('__images'); }}
            className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
          >
            <span>Afbeeldingen</span>
            <ChevronDown size={18} className={`text-fg-faint transition-transform ${openGroups.__images ? 'rotate-180' : ''}`} />
          </summary>
          {openGroups.__images && (
            <div className="space-y-4 border-t hairline px-5 py-4">
              <div ref={heroCardRef} className="rounded-lg border hairline p-4">
                <label className="block text-sm font-medium">Hero-afbeelding (bovenaan de homepage)</label>
                <p className="mt-1 mb-3 text-xs text-fg-faint">Laat leeg voor de standaard Audi-foto. De foto wordt bijgesneden naar breedbeeld.</p>
                <CloudinaryUpload value={heroImage} onChange={handleHeroChange} multiple={false} />
                {heroImage.length > 0 && (
                  <button type="button" onClick={clearHero} className="mt-3 text-xs text-red-400 hover:underline">
                    Verwijder huidige foto (terug naar standaard)
                  </button>
                )}
              </div>
            </div>
          )}
        </details>

        {/* Teksten per sectie */}
        {CONTENT_FIELDS.map((group) => {
          const open = !!openGroups[group.group];
          return (
            <details key={group.group} open={open} className="card !p-0 overflow-hidden">
              <summary
                onClick={(e) => { e.preventDefault(); toggleGroup(group.group); }}
                className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
              >
                <span>{group.group}</span>
                <ChevronDown size={18} className={`text-fg-faint transition-transform ${open ? 'rotate-180' : ''}`} />
              </summary>
              {open && (
                <div className="space-y-4 border-t hairline px-5 py-4">
                  {group.items.map((f) => (
                    <div key={f.key}>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="block text-sm font-medium" htmlFor={'cms-field-' + f.key}>{f.label}</label>
                        {values[f.key] ? (
                          <button type="button" onClick={() => setVal(f.key, '')} className="text-xs text-red-400 hover:underline">Wis</button>
                        ) : null}
                      </div>
                      {f.type === 'textarea' ? (
                        <textarea id={'cms-field-' + f.key} value={values[f.key] ?? ''} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.def} rows={3} className="input w-full" />
                      ) : (
                        <input id={'cms-field-' + f.key} value={values[f.key] ?? ''} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.def} className="input w-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
