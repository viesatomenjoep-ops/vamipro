'use client';

import { useState } from 'react';
import { saveContent } from '@/app/admin/actions';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

export default function ShopSettingsForm({ content }: { content: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState<string[]>(content.hero_image ? [content.hero_image] : []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    formData.set('hero_image', image[0] || '');
    await saveContent(formData);
    setLoading(false);
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="card space-y-4">
        <h3 className="font-medium">Hero-afbeelding (bovenaan de homepage)</h3>
        <p className="text-xs text-fg-faint">Laat leeg om de standaardfoto te gebruiken. De foto wordt automatisch bijgesneden.</p>
        <CloudinaryUpload value={image} onChange={setImage} multiple={false} />
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium">Verzending</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Verzendkosten Nederland (€)</label>
          <input name="shipping_cost_eur" defaultValue={content.shipping_cost_eur ?? ''} placeholder="7,95" className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Verzendkosten België (€)</label>
          <input name="shipping_cost_be_eur" defaultValue={content.shipping_cost_be_eur ?? ''} placeholder="11,95" className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gratis verzending vanaf (€)</label>
          <input name="free_shipping_eur" defaultValue={content.free_shipping_eur ?? ''} placeholder="70" className="input w-full" />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium">Kortingscode</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Kortingscode</label>
          <input name="discount_code" defaultValue={content.discount_code ?? ''} placeholder="VAMIPRO10" className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kortingspercentage (%)</label>
          <input name="discount_percent" defaultValue={content.discount_percent ?? ''} placeholder="10" className="input w-full" />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium">Testcode (€ 0,01)</h3>
        <p className="text-xs text-fg-faint">
          Vul een code in om een testbestelling te doen: het totaal wordt <b>€ 0,01</b> met <b>gratis verzending</b>
          (Mollie accepteert geen € 0). Zo test je de hele keten via Mollie voor 1 cent. Laat leeg om uit te schakelen —
          en wis de code weer na het testen zodat klanten 'm niet kunnen gebruiken.
        </p>
        <div>
          <label className="block text-sm font-medium mb-1">Testcode</label>
          <input name="one_cent_code" defaultValue={content.one_cent_code ?? ''} placeholder="bijv. TEST1CENT" className="input w-full" />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium">Google reviews</h3>
        <p className="text-xs text-fg-faint">
          Plak hier je <b>Google review-link</b> (in je Google Bedrijfsprofiel → "Meer reviews krijgen" → link kopiëren).
          Klanten krijgen dan automatisch een knop "Laat een review achter" in de bevestigings- én verzendmail.
          Laat leeg om het review-verzoek uit te schakelen.
        </p>
        <div>
          <label className="block text-sm font-medium mb-1">Google review-link</label>
          <input name="google_review_url" defaultValue={content.google_review_url ?? ''} placeholder="https://g.page/r/…  of  https://search.google.com/local/writereview?placeid=…" className="input w-full" />
        </div>
        <div className="border-t hairline pt-4">
          <label className="block text-sm font-medium mb-1">Automatische opvolg-review-mail — na hoeveel dagen?</label>
          <p className="text-xs text-fg-faint mb-2">
            Elke klant krijgt <b>één keer</b> automatisch een extra mailtje met het verzoek om een 5-sterren Google-review,
            een aantal dagen ná de bestelling (als het pakket binnen is). Standaard <b>4 dagen</b>. Werkt alleen als hierboven een review-link staat.
          </p>
          <input name="review_request_delay_days" type="number" min={0} defaultValue={content.review_request_delay_days ?? ''} placeholder="4" className="input w-40" />
        </div>
        <div className="border-t hairline pt-4">
          <label className="block text-sm font-medium mb-1">Google-reviews op de site tonen — Place ID</label>
          <p className="text-xs text-fg-faint mb-2">
            Vul je <b>Google Place ID</b> in om je échte Google-reviews automatisch op de homepage te tonen.
            Vind 'm via de <b>Place ID Finder</b> van Google. Werkt alleen als in Vercel ook de env-variabele
            <b> GOOGLE_PLACES_API_KEY</b> is ingesteld. Laat leeg om zelf-beheerde reviews te tonen.
          </p>
          <input name="google_place_id" defaultValue={content.google_place_id ?? ''} placeholder="ChIJ…" className="input w-full" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Bezig met opslaan...' : 'Instellingen opslaan'}
        </button>
        {saved && <span className="text-sm text-accent">Opgeslagen ✓ — de website is direct bijgewerkt.</span>}
      </div>
      <p className="text-xs text-fg-faint">Laat een veld leeg om de standaardwaarde te gebruiken (verzending NL € 7,95 / BE € 11,95, gratis vanaf € 70, code VAMIPRO10, 10%).</p>
    </form>
  );
}
