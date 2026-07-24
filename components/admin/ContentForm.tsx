'use client';

import { useState } from 'react';
import { saveContent } from '@/app/admin/actions';

// Bewerkbare teksten, gegroepeerd per sectie. Nieuwe teksten toevoegen = hier een
// regel bijzetten en op de betreffende pagina `t('<key>', '<standaard>')` gebruiken.
const CONTENT_FIELDS: { group: string; items: { key: string; label: string; type?: 'text' | 'textarea'; def: string }[] }[] = [
  {
    group: 'Hero (bovenaan de homepage)',
    items: [
      { key: 'hero_eyebrow', label: 'Klein label boven de titel', def: 'Car detailing · NL & BE' },
      { key: 'hero_title_1', label: 'Titel — regel 1', def: 'Ultieme glans' },
      { key: 'hero_title_2', label: 'Titel — regel 2', def: '& bescherming voor' },
      { key: 'hero_title_3', label: 'Titel — regel 3 (accent)', def: 'de échte liefhebber.' },
      { key: 'hero_subtitle', label: 'Ondertitel', type: 'textarea', def: 'Professionele detailingproducten — van veilig wassen tot showroomglans. Ontwikkeld voor liefhebbers en pro’s.' },
      { key: 'hero_cta_primary', label: 'Knop 1 — tekst', def: 'Shop de collectie' },
      { key: 'hero_cta_secondary', label: 'Knop 2 — tekst', def: 'Bekijk categorieën' },
    ],
  },
];

export default function ContentForm({ content }: { content: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await saveContent(new FormData(e.currentTarget));
    setLoading(false);
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {CONTENT_FIELDS.map((group) => (
        <div key={group.group} className="card space-y-4">
          <h3 className="font-medium">{group.group}</h3>
          {group.items.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea name={f.key} defaultValue={content[f.key] ?? ''} placeholder={f.def} rows={3} className="input w-full" />
              ) : (
                <input name={f.key} defaultValue={content[f.key] ?? ''} placeholder={f.def} className="input w-full" />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Bezig met opslaan...' : 'Teksten opslaan'}
        </button>
        {saved && <span className="text-sm text-accent">Opgeslagen ✓ — de website is direct bijgewerkt.</span>}
      </div>
      <p className="text-xs text-fg-faint">Laat een veld leeg om de standaardtekst (grijs getoond) te gebruiken.</p>
    </form>
  );
}
