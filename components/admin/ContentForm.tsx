'use client';

import { useState } from 'react';
import { saveContent } from '@/app/admin/actions';
import { CONTENT_FIELDS } from '@/lib/content-fields';

export default function ContentForm({ content }: { content: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    // Vul elk veld voor met de opgeslagen tekst, of anders de huidige standaardtekst,
    // zodat de winkelier de bestaande tekst ziet staan en direct kan aanpassen.
    CONTENT_FIELDS.forEach((g) => g.items.forEach((f) => { init[f.key] = content[f.key] ?? f.def; }));
    return init;
  });
  const setVal = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

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
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-medium">{f.label}</label>
                {values[f.key] ? (
                  <button type="button" onClick={() => setVal(f.key, '')} className="text-xs text-red-400 hover:underline">Wis</button>
                ) : null}
              </div>
              {f.type === 'textarea' ? (
                <textarea name={f.key} value={values[f.key]} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.def} rows={3} className="input w-full" />
              ) : (
                <input name={f.key} value={values[f.key]} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.def} className="input w-full" />
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
      <p className="text-xs text-fg-faint">Klik "Wis" om een tekst te verwijderen — dan wordt automatisch de standaardtekst gebruikt.</p>
    </form>
  );
}
