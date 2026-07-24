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
          <label className="block text-sm font-medium mb-1">Verzendkosten (€)</label>
          <input name="shipping_cost_eur" defaultValue={content.shipping_cost_eur ?? ''} placeholder="6,95" className="input w-full" />
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

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Bezig met opslaan...' : 'Instellingen opslaan'}
        </button>
        {saved && <span className="text-sm text-accent">Opgeslagen ✓ — de website is direct bijgewerkt.</span>}
      </div>
      <p className="text-xs text-fg-faint">Laat een veld leeg om de standaardwaarde te gebruiken (verzending € 6,95, gratis vanaf € 70, code VAMIPRO10, 10%).</p>
    </form>
  );
}
