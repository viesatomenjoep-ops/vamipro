'use client';

import { useState } from 'react';
import { saveReview } from '@/app/admin/actions';

export default function ReviewForm({ review }: { review?: any }) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<boolean>(review ? !!review.is_active : true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('is_active', active ? 'true' : 'false');
    await saveReview(formData, review?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Auteur</label>
          <input required name="author" defaultValue={review?.author} className="input w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Beoordeling</label>
          <select name="rating" defaultValue={String(review?.rating ?? 5)} className="input w-full">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Review-tekst</label>
          <textarea required name="body" defaultValue={review?.body} rows={4} className="input w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bron</label>
          <input name="source" defaultValue={review?.source ?? 'Google'} className="input w-full" />
          <p className="text-xs text-fg-faint mt-1">Bijv. Google, Trustpilot, Facebook…</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Plaats / auto (optioneel)</label>
          <input name="location" defaultValue={review?.location ?? ''} className="input w-full" placeholder="bijv. BMW M4 · Antwerpen" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Volgorde</label>
          <input type="number" name="sort_order" defaultValue={review?.sort_order ?? 0} className="input w-full" />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4"
          />
          Actief (tonen op de website)
        </label>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? 'Bezig met opslaan...' : 'Review opslaan'}
      </button>
    </form>
  );
}
