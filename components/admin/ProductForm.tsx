'use client';

import { useState, useTransition } from 'react';
import { saveProduct } from '@/app/admin/actions';
import CloudinaryUpload from './CloudinaryUpload';

export default function ProductForm({ product, categories }: { product?: any, categories: any[] }) {
  const [images, setImages] = useState<string[]>(product?.cloudinary_images || []);
  const [isPending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    formData.append('cloudinary_images', images.join(','));
    startTransition(async () => {
      await saveProduct(formData, product?.id);
    });
  };

  return (
    <form action={handleAction} className="space-y-6 max-w-2xl">
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Naam</label>
          <input required name="name" defaultValue={product?.name} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug (URL)</label>
            <input required name="slug" defaultValue={product?.slug} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU (Artikelnummer)</label>
            <input required name="sku" defaultValue={product?.sku} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prijs (in euro)</label>
            <input required type="number" step="0.01" name="price" defaultValue={product ? (product.price_cents / 100).toFixed(2) : ''} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Oude Prijs (optioneel)</label>
            <input type="number" step="0.01" name="compare_at_price" defaultValue={product?.compare_at_price_cents ? (product.compare_at_price_cents / 100).toFixed(2) : ''} placeholder="bijv. 69.70" className="input w-full text-black bg-white px-3 py-2 rounded-md" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium mb-1">Categorie</label>
            <select required name="category_id" defaultValue={product?.category_id} className="input w-full text-black bg-white px-3 py-2 rounded-md">
              <option value="">Kies categorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Voorraad</label>
            <input required type="number" name="stock" defaultValue={product?.stock ?? 0} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Merk</label>
            <input name="brand" defaultValue={product?.brand ?? 'Vami Pro'} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gewicht (gram)</label>
            <input required type="number" name="weight_grams" defaultValue={product?.weight_grams ?? 500} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Korte omschrijving</label>
          <textarea name="short_description" defaultValue={product?.short_description} rows={2} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Volledige omschrijving</label>
          <textarea name="description" defaultValue={product?.description} rows={6} className="input w-full text-black bg-white px-3 py-2 rounded-md" />
        </div>
      </div>

      <div className="card space-y-4">
        <label className="block text-sm font-medium mb-1">Productfoto's</label>
        <CloudinaryUpload value={images} onChange={setImages} multiple />
      </div>

      <div className="card space-y-4 flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" value="true" defaultChecked={product ? product.is_active : true} className="rounded border-white/20 bg-transparent text-accent" />
          <span>Actief (zichtbaar in shop)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_featured" value="true" defaultChecked={product?.is_featured} className="rounded border-white/20 bg-transparent text-accent" />
          <span>Uitgelicht (Aanrader op homepage)</span>
        </label>
      </div>

      <button type="submit" disabled={isPending} className="btn btn-primary w-full">
        {isPending ? 'Bezig met opslaan...' : 'Product opslaan'}
      </button>
    </form>
  );
}
