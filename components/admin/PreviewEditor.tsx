'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { saveContent, updateCategoryInline, setProductImages, setProductPrice } from '@/app/admin/actions';
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
 *   - { type: 'cms-product-price', id, value }           → live productprijs tonen
 */
// Cents → invoerveld-tekst met komma (bv. 1250 → "12,50").
function centsToEuroInput(cents: number): string {
  return (Math.max(0, Math.round(cents)) / 100).toFixed(2).replace('.', ',');
}

// Invoerveld-tekst (euro's, komma of punt) → cents (>= 0).
function euroInputToCents(input: string): number {
  const normalized = (input || '').replace(/[^\d,.-]/g, '').replace(',', '.');
  const euros = parseFloat(normalized);
  if (!isFinite(euros)) return 0;
  return Math.max(0, Math.round(euros * 100));
}

// Cents → getoonde prijs op de site (bv. 1250 → "€ 12,50").
function centsToEuroLabel(cents: number): string {
  return `€ ${(Math.max(0, Math.round(cents)) / 100).toFixed(2).replace('.', ',')}`;
}

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

  // Welke groepen zijn opengeklapt (standaard: alles dicht → schone, scanbare lijst).
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { __images: false, __categories: false, __products: false };
    CONTENT_FIELDS.forEach((g) => { init[g.group] = false; });
    return init;
  });

  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // Zoekterm voor het snel vinden van een veld (case-insensitive).
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const searching = query.length > 0;

  // Platte lijst met tekstvelden die matchen op label OF groepsnaam.
  const matchingFields = searching
    ? CONTENT_FIELDS.flatMap((g) =>
        g.items
          .filter(
            (f) =>
              f.label.toLowerCase().includes(query) ||
              g.group.toLowerCase().includes(query),
          )
          .map((f) => ({ field: f, group: g.group })),
      )
    : [];

  const titleMatches = (title: string) => title.toLowerCase().includes(query);

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
  // Volledige afbeeldingenset per product (Cloudinary public ids).
  const [prods, setProds] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    products.forEach((p) => {
      init[p.id] = Array.isArray(p.cloudinary_images) ? [...p.cloudinary_images] : [];
    });
    return init;
  });
  // Prijs per product als bewerkbare euro-tekst (bv. "12,50").
  const [prodPrices, setProdPrices] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    products.forEach((p) => { init[p.id] = centsToEuroInput(p.price_cents ?? 0); });
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

  const postProductPrice = (id: string, value: string) =>
    post({ type: 'cms-product-price', id, value });

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
  const flashProdSaved = (id: string) => {
    setProdSaved((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => setProdSaved((prev) => ({ ...prev, [id]: false })), 2500);
  };

  // Volledige afbeeldingenset opslaan; eerste foto live tonen (of leeg → standaard).
  const setProdImages = async (id: string, ids: string[]) => {
    const next = ids.filter(Boolean);
    setProds((prev) => ({ ...prev, [id]: next }));
    postProductImage(id, next[0] ? cldUrl(next[0], { w: 800, h: 800 }) : '');
    await setProductImages(id, next);
    flashProdSaved(id);
  };

  const setProdPriceInput = (id: string, value: string) =>
    setProdPrices((prev) => ({ ...prev, [id]: value }));

  // Prijs opslaan bij blur: parse euro's → cents, live label bijwerken.
  const commitProdPrice = async (id: string) => {
    const cents = euroInputToCents(prodPrices[id] ?? '');
    setProdPrices((prev) => ({ ...prev, [id]: centsToEuroInput(cents) }));
    postProductPrice(id, centsToEuroLabel(cents));
    await setProductPrice(id, cents);
    flashProdSaved(id);
  };

  // ── Highlight helpers ─────────────────────────────────────────────────────
  const highlightHeroCard = () => {
    // Zoekmodus verlaten zodat de normale (uitgeklapte) sectie weer gerenderd wordt.
    setSearch('');
    setOpenGroups((prev) => ({ ...prev, __images: true }));
    window.setTimeout(() => {
      const el = heroCardRef.current;
      if (!el) return;
      el.scrollIntoView({ block: 'center' });
      el.classList.add('ring-2', 'ring-accent');
      window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent'), 1500);
    }, 0);
  };

  const highlightBlock = (elId: string, group: string) => {
    setSearch('');
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
        // Zoekmodus verlaten en de groep waarin dit veld staat openklappen.
        setSearch('');
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

  // Eén tekstveld (label + "Wis" + input/textarea). Wordt hergebruikt in de
  // gegroepeerde weergave én de platte zoekresultatenlijst.
  const renderField = (
    f: { key: string; label: string; type?: 'text' | 'textarea'; def: string },
    groupCaption?: string,
  ) => (
    <div key={f.key}>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium" htmlFor={'cms-field-' + f.key}>{f.label}</label>
        {values[f.key] ? (
          <button type="button" onClick={() => { if (confirm('Weet je zeker dat je deze tekst wilt wissen? De standaardtekst wordt dan weer gebruikt.')) setVal(f.key, ''); }} className="text-xs text-red-400 hover:underline">Wis</button>
        ) : null}
      </div>
      {groupCaption && <p className="mb-1 text-xs text-fg-faint">{groupCaption}</p>}
      {f.type === 'textarea' ? (
        <textarea id={'cms-field-' + f.key} value={values[f.key] ?? ''} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.def} rows={3} className="input w-full" />
      ) : (
        <input id={'cms-field-' + f.key} value={values[f.key] ?? ''} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.def} className="input w-full" />
      )}
    </div>
  );

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
        <p className="mt-2 text-xs text-fg-faint">Klik in de voorvertoning op een tekst, categorie-tegel, productfoto of prijs om die te bewerken.</p>
      </div>

      <div className="space-y-4">
        {/* Sticky kop: instructie + opslaan-balk + zoekbalk */}
        <div className="sticky top-0 z-10 -mx-1 space-y-3 rounded-lg border hairline bg-bg/90 px-4 py-3 backdrop-blur">
          <p className="text-xs text-fg-muted">
            Klik links in de voorvertoning op een tekst, foto of prijs om het juiste veld te openen — of zoek hieronder.
          </p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleSave} disabled={loading} className="btn btn-primary">
              {loading ? 'Bezig met opslaan...' : 'Opslaan'}
            </button>
            {saved && <span className="text-sm text-accent">Opgeslagen ✓ — de website is bijgewerkt.</span>}
          </div>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek een tekstveld…"
              aria-label="Zoek een tekstveld"
              className="input w-full pl-9 pr-9"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Zoekopdracht wissen"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-fg-faint hover:text-fg"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {searching ? (
          /* ── Zoekresultaten: platte lijst met matchende tekstvelden ── */
          <div className="card space-y-4">
            <p className="text-xs text-fg-muted">
              {matchingFields.length === 0
                ? `Geen tekstvelden gevonden voor “${search.trim()}”.`
                : `${matchingFields.length} tekstveld${matchingFields.length === 1 ? '' : 'en'} gevonden.`}
            </p>
            {matchingFields.map(({ field, group }) => renderField(field, group))}
          </div>
        ) : null}

        {/* Afbeeldingen */}
        {(!searching || titleMatches('Afbeeldingen')) && (
        <details open={openGroups.__images} className="card !p-0 overflow-hidden">
          <summary
            onClick={(e) => { e.preventDefault(); toggleGroup('__images'); }}
            className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
          >
            <span className="flex items-center gap-2">
              Afbeeldingen
              <span className="text-xs font-normal text-fg-faint">1</span>
            </span>
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
        )}

        {/* Categorieën */}
        {catList.length > 0 && (!searching || titleMatches('Categorieën')) && (
          <details open={openGroups.__categories} className="card !p-0 overflow-hidden">
            <summary
              onClick={(e) => { e.preventDefault(); toggleGroup('__categories'); }}
              className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
            >
              <span className="flex items-center gap-2">
                Categorieën
                <span className="text-xs font-normal text-fg-faint">{catList.length}</span>
              </span>
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

        {/* Producten */}
        {prodList.length > 0 && (!searching || titleMatches('Producten')) && (
          <details open={openGroups.__products} className="card !p-0 overflow-hidden">
            <summary
              onClick={(e) => { e.preventDefault(); toggleGroup('__products'); }}
              className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
            >
              <span className="flex items-center gap-2">
                Producten
                <span className="text-xs font-normal text-fg-faint">{prodList.length}</span>
              </span>
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

                    <div className="mb-4">
                      <label className="mb-1 block text-sm font-medium">Prijs (€)</label>
                      <input
                        value={prodPrices[p.id] ?? ''}
                        onChange={(e) => setProdPriceInput(p.id, e.target.value)}
                        onBlur={() => commitProdPrice(p.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        inputMode="decimal"
                        className="input w-40"
                      />
                      <p className="mt-1 text-xs text-fg-faint">Opslaan gebeurt zodra je het veld verlaat.</p>
                    </div>

                    <label className="mb-1 block text-sm font-medium">Afbeeldingen</label>
                    <p className="mb-3 text-xs text-fg-faint">Voeg foto's toe of verwijder ze. De eerste foto is de uitgelichte foto. Opslaan gebeurt direct.</p>
                    <CloudinaryUpload value={prods[p.id] ?? []} onChange={(ids) => setProdImages(p.id, ids)} multiple />
                  </div>
                ))}
              </div>
            )}
          </details>
        )}

        {/* Teksten per sectie — tijdens het zoeken vervangen door de platte lijst hierboven. */}
        {!searching && CONTENT_FIELDS.map((group) => {
          const open = !!openGroups[group.group];
          return (
            <details key={group.group} open={open} className="card !p-0 overflow-hidden">
              <summary
                onClick={(e) => { e.preventDefault(); toggleGroup(group.group); }}
                className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium select-none"
              >
                <span className="flex items-center gap-2">
                  {group.group}
                  <span className="text-xs font-normal text-fg-faint">{group.items.length}</span>
                </span>
                <ChevronDown size={18} className={`text-fg-faint transition-transform ${open ? 'rotate-180' : ''}`} />
              </summary>
              {open && (
                <div className="space-y-4 border-t hairline px-5 py-4">
                  {group.items.map((f) => renderField(f))}
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
