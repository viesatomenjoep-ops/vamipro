'use client';

import { useState } from 'react';
import { saveCategory } from '@/app/admin/actions';

export default function CategoryForm({ category, parents }: { category?: any, parents: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await saveCategory(formData, category?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Naam</label>
          <input required name="name" defaultValue={category?.name} className="input w-full" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL - bijv. 'velgenreiniger')</label>
          <input required name="slug" defaultValue={category?.slug} className="input w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Onderverdelen onder (Hoofdcategorie)</label>
          <select name="parent_id" defaultValue={category?.parent_id || ''} className="input w-full">
            <option value="">-- Geen (Dit wordt een nieuwe hoofdcategorie) --</option>
            {parents.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="text-xs text-fg-faint mt-1">Selecteer een hoofdcategorie als dit een subcategorie is.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Volgorde (Sort Order)</label>
            <input required type="number" name="sort_order" defaultValue={category?.sort_order ?? 0} className="input w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Korte omschrijving</label>
          <textarea name="description" defaultValue={category?.description} rows={3} className="input w-full" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? 'Bezig met opslaan...' : 'Categorie opslaan'}
      </button>
    </form>
  );
}
