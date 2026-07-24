'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { saveContent, updateCategoryInline, setProductImage } from '@/app/admin/actions';
import { CONTENT_FIELDS } from '@/lib/content-fields';
import { cldUrl } from '@/lib/cloudinary';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import type { PreviewCategory, PreviewProduct } from '@/app/admin/preview/page';

/**
 * Live-voorvertoning met klik-om-te-bewerken.
 *
 * Protocol (postMessage):
 *  iframe (site) → editor:
 *   - { type: 'cms-click', key }             → tekstveld focussen/markeren
 *   - { type: 'cms-image-click', key }        → hero-afbeeldingskaart markeren
 *   - { type: 'cms-cat-click', id }           → categorie-blok openen/markeren
 *   - { type: 'cms-product-click', id }       → productfoto-blok openen/markeren
 *  editor → iframe (site):
 *   - { type: 'cms-update', key, value }               → live tekst tonen
 *   - { type: 'cms-image-update', key, url }            → live hero-afbeelding tonen (leeg → standaard)
 *   - { type: 'cms-cat-text', id, field, value }        → live categorie-tekst tonen
 *   - { type: 'cms-cat-image', id, url }                → live categorie-afbeelding tonen (leeg → standaard)
 *   - { type: 'cms-product-image', id, url }            → live productfoto tonen (leeg → standaard)
 */
export default function PreviewEditor({
  content,
  categories = [],
  products = [],
}: {
  content: Record<string, string>;
  categories?: PreviewCategory[];
  products?: PreviewProduct[];
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Welke groepen zijn opengeklapt (standaard alles dicht behalve de eerste secties).
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { __images: true, __categories: false, __products: false };
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

  // ── Categorieën ─────────────────────────────────────────────────────────
  type CatState = { name: string; description: string; image: string[]; dirty: boolean };
  const [cats, setCats] = useState<Record<string, CatState>>(() => {
    const init: Record<string, CatState> = {};
    categories.forEach((c) => {
      init[c.id] = {
        name: c.name ?? '',
        description: c.description ?? '',
        image: c.cloudinary_image ? [c.cloudinary_image] : [],
        dirty: false,
      };
    });
    return init;
  });
  const [catsSaving, setCatsSaving] = useState(false);
  const [catsSaved, setCatsSaved] = useState(false);

  // ── Producten ───────────────────────────────────────────────────────────
  const [prods, setProds] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    products.forEach((p) => {
      init[p.id] = p.cloudinary_images?.[0] ? [p.cloudinary_images[0]] : [];
    });
    return init;
  });
  const [prodSaved, setProdSaved] = useState<Record<string, boolean>>({});

  const heroUrl = (publicId: string) => (publicId ? cldUrl(publicId, { w: 1920, h: 1080 }) : '');

  // ── postMessage helpers ───────────────────────────────────────────────────
  const post = (msg: Record<string, unknown>) =>
    iframeRef.current?.contentWindow?.postMessage(msg, '*');

  const postUpdate = (key: string, value: string) =>
    post({ type: 'cms-update', key, value: value || defFor(key) });

  const postImageUpdate = (key: string, url: string) =>
    post({ type: 'cms-image-update', key, url });

  const postCatText = (id: string, field: 'name' | 'desc', value: string) =>
    post({ type: 'cms-cat-text', id, field, value });

  const postCatImage = (id: string, url: string) =>
    post({ type: 'cms-cat-image', id, url });

  const postProductImage = (id: string, url: string) =>
    post({ type: 'cms-product-image', id, url });

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

  // ── Categorie handlers ────────────────────────────────────────────────────
  const setCatField = (id: string, field: 'name' | 'description', value: string) => {
    setCats((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value, dirty: true } }));
    postCatText(id, field === 'name' ? 'name' : 'desc', value);
  };

  const setCatImage = (id: string, ids: string[]) => {
    const publicId = ids[0] || '';
    setCats((prev) => ({
      ...prev,
      [id]: { ...prev[id], image: publicId ? [publicId] : [], dirty: true },
    }));
    postCatImage(id, publicId ? cldUrl(publicId, { w: 1200 }) : '');
  };

  const saveCategories = async () => {
    setCatsSaving(true);
    setCatsSaved(false);
    const entries = Object.entries(cats).filter(([, s]) => s.dirty);
    for (const [id, s] of entries) {
      await updateCategoryInline(id, {
        name: s.name,
        description: s.description,
        cloudinary_image: s.image[0] || null,
      });
    }
    setCats((prev) => {
      const next = { ...prev };
      entries.forEach(([id]) => { next[id] = { ...next[id], dirty: false }; });
      return next;
    });
    setCatsSaving(false);
    setCatsSaved(true);
  };

  // ── Product handlers ──────────────────────────────────────────────────────
  const setProdImage = async (id: string, ids: string[]) => {
    const publicId = ids[0] || '';
    setProds((prev) => ({ ...prev, [id]: publicId ? [publicId] : [] }));
    if (!publicId) return;
    postProductImage(id, cldUrl(publicId, { w: 800, h: 800 }));
    await setProductImage(id, publicId);
    setProdSaved((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => setProdSaved((prev) => ({ ...prev, [id]: false })), 2500);
  };

  // ── Highlight helpers ─────────────────────────────────────────────────────
  const highlightHeroCard = () => {
    const el = heroCardRef.current;
    if (!el) return;
    setOpenGroups((prev) => ({ ...prev, __images: true }));
    el.scrollIntoView({ block: 'center' });
    el.classList.add('ring-2', 'ring-accent');
    window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent'), 1500);
  };

  const highlightBlock = (elId: string, group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: true }));
    window.setTimeout(() => {
      const el = document.getElementById(elId);
      if (!el) return;
      el.scrollIntoView({ block: 'center' });
      el.classList.add('ring-2', 'ring-accent');
      window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent'), 1500);
    }, 0);
  };

  // Luister naar klikken vanuit de iframe → focus/markeer het bijbehorende veld of blok.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data.type !== 'string') return;

      if (data.type === 'cms-cat-click' && typeof data.id === 'string') {
        highlightBlock('cms-cat-' + data.id, '__categories');
        return;
      }
      if (data.type === 'cms-product-click' && typeof data.id === 'string') {
        highlightBlock('cms-product-' + data.id, '__products');
        return;
      }

      if (typeof data.key !== 'string') return;

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
    Object.entries(cats).forEach(([id, s]) => {
      if (!s.dirty) return;
      postCatText(id, 'name', s.name);
      postCatText(id, 'desc', s.description);
      postCatImage(id, s.image[0] ? cldUrl(s.image[0], { w: 1200 }) : '');
    });
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

  const catList = categories;
  const prodList = products;

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
        <p className="mt-2 text-xs text-fg-faint">Klik in de voorvertoning op een tekst, categorie-tegel of productfoto om die te bewerken.</p>
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

        {/* Categorieën */}
        {catList.length > 0 && (
          <details open={openGroups.__categories} className="card !p-0 overflow-hidden">
            <summary
              onClick={(e) => { e.preventDefault(); toggleGroup('__categories'); }}
              className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
            >
              <span>Categorieën</span>
              <ChevronDown size={18} className={`text-fg-faint transition-transform ${openGroups.__categories ? 'rotate-180' : ''}`} />
            </summary>
            {openGroups.__categories && (
              <div className="space-y-4 border-t hairline px-5 py-4">
                {catList.map((c) => {
                  const s = cats[c.id];
                  if (!s) return null;
                  return (
                    <div key={c.id} id={'cms-cat-' + c.id} className="rounded-lg border hairline p-4">
                      <div className="mb-3">
                        <label className="mb-1 block text-sm font-medium">Naam</label>
                        <input
                          value={s.name}
                          onChange={(e) => setCatField(c.id, 'name', e.target.value)}
                          className="input w-full"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="mb-1 block text-sm font-medium">Beschrijving</label>
                        <textarea
                          value={s.description}
                          onChange={(e) => setCatField(c.id, 'description', e.target.value)}
                          rows={3}
                          className="input w-full"
                        />
                      </div>
                      <label className="mb-1 block text-sm font-medium">Afbeelding</label>
                      <CloudinaryUpload value={s.image} onChange={(ids) => setCatImage(c.id, ids)} multiple={false} />
                      {s.image.length > 0 && (
                        <button type="button" onClick={() => setCatImage(c.id, [])} className="mt-3 text-xs text-red-400 hover:underline">
                          Verwijder foto (terug naar standaard)
                        </button>
                      )}
                    </div>
                  );
                })}
                <div className="flex items-center gap-3">
                  <button type="button" onClick={saveCategories} disabled={catsSaving} className="btn btn-primary">
                    {catsSaving ? 'Bezig met opslaan...' : 'Categorieën opslaan'}
                  </button>
                  {catsSaved && <span className="text-sm text-accent">Opgeslagen ✓</span>}
                </div>
              </div>
            )}
          </details>
        )}

        {/* Productfoto's */}
        {prodList.length > 0 && (
          <details open={openGroups.__products} className="card !p-0 overflow-hidden">
            <summary
              onClick={(e) => { e.preventDefault(); toggleGroup('__products'); }}
              className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
            >
              <span>Productfoto's</span>
              <ChevronDown size={18} className={`text-fg-faint transition-transform ${openGroups.__products ? 'rotate-180' : ''}`} />
            </summary>
            {openGroups.__products && (
              <div className="space-y-4 border-t hairline px-5 py-4">
                {prodList.map((p) => (
                  <div key={p.id} id={'cms-product-' + p.id} className="rounded-lg border hairline p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium">{p.name}</label>
                      {prodSaved[p.id] && <span className="text-xs text-accent">opgeslagen ✓</span>}
                    </div>
                    <p className="mb-3 text-xs text-fg-faint">Wijzig de eerste (uitgelichte) foto. Opslaan gebeurt direct.</p>
                    <CloudinaryUpload value={prods[p.id] ?? []} onChange={(ids) => setProdImage(p.id, ids)} multiple={false} />
                  </div>
                ))}
              </div>
            )}
          </details>
        )}

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
                          <button type="button" onClick={() => { if (confirm('Weet je zeker dat je deze tekst wilt wissen? De standaardtekst wordt dan weer gebruikt.')) setVal(f.key, ''); }} className="text-xs text-red-400 hover:underline">Wis</button>
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
