'use client';

import { useEffect, useRef, useState } from 'react';
import { saveContent } from '@/app/admin/actions';
import { CONTENT_FIELDS } from '@/lib/content-fields';

/**
 * Live-voorvertoning met klik-om-te-bewerken.
 *
 * Protocol (postMessage):
 *  - iframe (site) → editor: { type: 'cms-click', key }  → veld focussen/markeren
 *  - editor → iframe (site): { type: 'cms-update', key, value }  → live tekst tonen
 */
export default function PreviewEditor({ content }: { content: Record<string, string> }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const postUpdate = (key: string, value: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'cms-update', key, value: value || defFor(key) },
      '*',
    );
  };

  const setVal = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    postUpdate(key, value);
  };

  // Luister naar klikken vanuit de iframe → focus + markeer het bijbehorende veld.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.type !== 'cms-click' || typeof data.key !== 'string') return;
      const el = document.getElementById('cms-field-' + data.key);
      if (!el) return;
      el.scrollIntoView({ block: 'center' });
      (el as HTMLElement).focus();
      el.classList.add('ring-2', 'ring-accent');
      window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent'), 1500);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Bij (her)laden van de iframe: duw de huidige (mogelijk onopgeslagen) waarden erin.
  const pushAllToIframe = () => {
    CONTENT_FIELDS.forEach((g) => g.items.forEach((f) => postUpdate(f.key, values[f.key] ?? '')));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    const fd = new FormData();
    CONTENT_FIELDS.forEach((g) => g.items.forEach((f) => fd.append(f.key, values[f.key] ?? '')));
    await saveContent(fd);
    setLoading(false);
    setSaved(true);
    // Herlaad de preview zodat de opgeslagen tekst uit de database wordt getoond.
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
        <p className="mt-2 text-xs text-fg-faint">Klik in de voorvertoning op een tekst om het bijbehorende veld te openen.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSave} disabled={loading} className="btn btn-primary">
            {loading ? 'Bezig met opslaan...' : 'Opslaan'}
          </button>
          {saved && <span className="text-sm text-accent">Opgeslagen ✓ — de website is bijgewerkt.</span>}
        </div>

        {CONTENT_FIELDS.map((group) => (
          <div key={group.group} className="card space-y-4">
            <h3 className="font-medium">{group.group}</h3>
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
        ))}

        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSave} disabled={loading} className="btn btn-primary">
            {loading ? 'Bezig met opslaan...' : 'Opslaan'}
          </button>
          {saved && <span className="text-sm text-accent">Opgeslagen ✓ — de website is bijgewerkt.</span>}
        </div>
      </div>
    </div>
  );
}
