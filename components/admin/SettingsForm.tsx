'use client';

import { useState } from 'react';
import { saveSettings } from '@/app/admin/actions';
import CloudinaryUpload from './CloudinaryUpload';

export default function SettingsForm({ settings }: { settings: any }) {
  const [logoUrl, setLogoUrl] = useState<string[]>(settings?.logo_url ? [settings.logo_url] : []);
  const [heroMediaUrl, setHeroMediaUrl] = useState<string[]>(settings?.hero_media_url ? [settings.hero_media_url] : []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('logo_url', logoUrl[0] || '');
    formData.append('hero_media_url', heroMediaUrl[0] || '');
    await saveSettings(formData);
    setLoading(false);
    alert('Instellingen opgeslagen! De website is direct bijgewerkt.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Colors section removed for performance/simplicity */}

      <div className="card space-y-4">
        <h3 className="font-medium">Logo</h3>
        <p className="text-sm text-fg-muted mb-2">Upload een transparante PNG. (Als je dit leeg laat, wordt de tekst VAMI.PRO getoond).</p>
        <CloudinaryUpload value={logoUrl} onChange={setLogoUrl} multiple={false} />
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium">Homepage Header (Hero)</h3>
        <p className="text-sm text-fg-muted mb-2">Upload een grote foto of video voor de voorpagina.</p>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mediatype</label>
          <select name="hero_media_type" defaultValue={settings?.hero_media_type || 'image'} className="input w-full">
            <option value="image">Foto (Afbeelding)</option>
            <option value="video">Video (MP4)</option>
          </select>
        </div>

        <CloudinaryUpload value={heroMediaUrl} onChange={setHeroMediaUrl} multiple={false} />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? 'Bezig met opslaan...' : 'Design opslaan'}
      </button>
    </form>
  );
}
