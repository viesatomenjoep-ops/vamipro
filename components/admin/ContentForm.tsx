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
  {
    group: 'Statistiek-balk (onder de hero)',
    items: [
      { key: 'stat_1_label', label: 'Statistiek 1 — label', def: 'Dikste droogdoek' },
      { key: 'stat_2_label', label: 'Statistiek 2 — label', def: 'Gratis verzending' },
      { key: 'stat_3_label', label: 'Statistiek 3 — label', def: 'Dagen bedenktijd' },
      { key: 'stat_4_label', label: 'Statistiek 4 — label', def: 'Besteld = vandaag verzonden' },
    ],
  },
  {
    group: 'Collectie-sectie',
    items: [
      { key: 'collection_eyebrow', label: 'Klein label', def: 'De collectie' },
      { key: 'collection_title', label: 'Titel — regel 1', def: 'Kies je categorie.' },
      { key: 'collection_subtitle', label: 'Titel — regel 2', def: 'Direct naar de juiste tools.' },
    ],
  },
  {
    group: 'Droogdoek-sectie',
    items: [
      { key: 'towel_badge', label: 'Badge', def: 'Bestseller' },
      { key: 'towel_title_1', label: 'Titel — regel 1', def: 'De dikste droogdoek' },
      { key: 'towel_title_2', label: 'Titel — regel 2', def: 'die we verkopen.' },
      { key: 'towel_intro', label: 'Introtekst', type: 'textarea', def: '1200 gram per vierkante meter twisted-loop microvezel. Eén doek, één auto, nul strepen — zonder ooit de lak te raken.' },
      { key: 'towel_bullet_1', label: 'Kenmerk 1', def: 'droogt een hele auto in één keer' },
      { key: 'towel_bullet_2', label: 'Kenmerk 2', def: 'voor alle lakken en coatings' },
      { key: 'towel_bullet_3', label: 'Kenmerk 3', def: 'en honderden keren wasbaar' },
      { key: 'towel_button', label: 'Knop — tekst', def: 'Shop de droogdoek' },
    ],
  },
  {
    group: 'XXL-pakket-sectie',
    items: [
      { key: 'xxl_title', label: 'Titel', def: 'Showroom pakket XXL' },
      { key: 'xxl_intro', label: 'Introtekst', type: 'textarea', def: 'Alles wat je nodig hebt voor de perfecte wasbeurt en detailing — in één doos. Inclusief droogdoek, washandschoen, emmer met grit guard en meer.' },
      { key: 'xxl_button', label: 'Knop — tekst', def: 'Profiteer nu' },
    ],
  },
  {
    group: 'Het ritueel',
    items: [
      { key: 'ritual_eyebrow', label: 'Klein label', def: 'Het ritueel' },
      { key: 'ritual_title_1', label: 'Titel — regel 1', def: 'Drie fases.' },
      { key: 'ritual_title_2', label: 'Titel — regel 2', def: 'Eén showroomresultaat.' },
      { key: 'ritual_1_title', label: 'Fase 1 — titel', def: 'Wassen' },
      { key: 'ritual_1_text', label: 'Fase 1 — tekst', type: 'textarea', def: 'Snow foam weekt het vuil los, de grit guard houdt je washandschoen schoon. Contactloos waar het kan, veilig waar het moet.' },
      { key: 'ritual_2_title', label: 'Fase 2 — titel', def: 'Drogen' },
      { key: 'ritual_2_text', label: 'Fase 2 — tekst', type: 'textarea', def: 'De 1200 GSM droogdoek neemt alles in één beweging op. Geen strepen, geen swirls — de lak blijft onaangeraakt.' },
      { key: 'ritual_3_title', label: 'Fase 3 — titel', def: 'Detailen' },
      { key: 'ritual_3_text', label: 'Fase 3 — tekst', type: 'textarea', def: 'Borstels, sponzen en microvezel voor velgen, naden en interieur. De details maken het verschil tussen schoon en showroom.' },
    ],
  },
  {
    group: 'Bannertekst (foto-sectie)',
    items: [
      { key: 'gallery_eyebrow', label: 'Klein label', def: 'Professional grade' },
      { key: 'gallery_title', label: 'Titel', type: 'textarea', def: 'Alles voor de perfecte wasbeurt.' },
    ],
  },
  {
    group: 'Aanbeveling / review',
    items: [
      { key: 'testimonial_quote', label: 'Quote', type: 'textarea', def: 'Mijn zwarte lak heeft nog nooit zo diep gestaan. De droogdoek alleen al is z’n geld dubbel waard.' },
      { key: 'testimonial_author', label: 'Naam', def: 'Mark V.' },
      { key: 'testimonial_detail', label: 'Detail (auto · plaats)', def: 'BMW M4 · Antwerpen' },
    ],
  },
  {
    group: 'Slot-CTA (onderaan)',
    items: [
      { key: 'final_eyebrow', label: 'Klein label', def: 'Klaar om te beginnen?' },
      { key: 'final_title_1', label: 'Titel — regel 1', def: 'Showroomglans' },
      { key: 'final_title_2', label: 'Titel — regel 2 (accent)', def: 'begint hier.' },
      { key: 'final_text', label: 'Tekst', type: 'textarea', def: 'Voor 16:00 besteld, vandaag verzonden. Gratis verzending vanaf € 70 in NL & BE.' },
      { key: 'final_button', label: 'Knop — tekst', def: 'Shop de collectie' },
    ],
  },
  {
    group: 'Footer & contact',
    items: [
      { key: 'footer_tagline', label: 'Footer-slogan', type: 'textarea', def: 'Professionele detailingproducten voor een showroomresultaat. Geleverd in NL en BE.' },
      { key: 'contact_phone', label: 'Telefoonnummer (leeg = verbergen)', def: '' },
    ],
  },
];

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
