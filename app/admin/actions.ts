'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveProduct(formData: FormData, productId?: string) {
  const supabase = createServiceClient();
  
  const payload = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    sku: formData.get('sku') as string,
    short_description: formData.get('short_description') as string,
    description: formData.get('description') as string,
    brand: formData.get('brand') as string,
    price_cents: Math.round(parseFloat(formData.get('price') as string || '0') * 100),
    stock: parseInt(formData.get('stock') as string || '0', 10),
    weight_grams: parseInt(formData.get('weight_grams') as string || '0', 10),
    is_active: formData.get('is_active') === 'true',
    is_featured: formData.get('is_featured') === 'true',
    category_id: formData.get('category_id') as string,
  };

  const imagesStr = formData.get('cloudinary_images') as string;
  const images = imagesStr ? imagesStr.split(',').filter(Boolean) : [];

  if (productId) {
    const { error } = await supabase.from('products').update({ ...payload, cloudinary_images: images }).eq('id', productId);
    if (error) console.error("Error updating product:", error);
  } else {
    const { error } = await supabase.from('products').insert({ ...payload, cloudinary_images: images });
    if (error) console.error("Error inserting product:", error);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/producten');
}

export async function saveSettings(formData: FormData) {
  const supabase = createServiceClient();
  
  const payload = {
    logo_url: formData.get('logo_url') as string,
    hero_media_url: formData.get('hero_media_url') as string,
    hero_media_type: formData.get('hero_media_type') as string || 'image',
  };

  await supabase.from('store_settings').update(payload).eq('id', 1);

  revalidatePath('/', 'layout');
}

export async function saveCategory(formData: FormData, categoryId?: string) {
  const supabase = createServiceClient();
  
  const payload = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    sort_order: parseInt(formData.get('sort_order') as string, 10),
    parent_id: formData.get('parent_id') as string || null,
  };

  if (categoryId) {
    await supabase.from('categories').update(payload).eq('id', categoryId);
  } else {
    await supabase.from('categories').insert(payload);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/categorieen');
}
