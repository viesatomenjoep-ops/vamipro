'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(text: string) {
  return (text || '').toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function saveContent(formData: FormData) {
  const supabase = createServiceClient();
  const rows: { key: string; value: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') rows.push({ key, value });
  }
  if (rows.length) {
    await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
  }
  revalidatePath('/', 'layout');
}

export async function deleteCategory(categoryId: string) {
  const supabase = createServiceClient();
  // Producten worden automatisch losgekoppeld (on delete set null); subcategorieën
  // worden mee verwijderd (on delete cascade) — dat regelt de database.
  await supabase.from('categories').delete().eq('id', categoryId);
  revalidatePath('/', 'layout');
  revalidatePath('/admin/categorieen');
}

export async function deleteInvoice(orderId: string, invoiceNumber: string) {
  const supabase = createServiceClient();
  // Verwijder de PDF uit opslag en haal het factuurnummer van de bestelling af,
  // zodat 'ie uit de facturenlijst verdwijnt. De bestelling zelf blijft bestaan.
  if (invoiceNumber) {
    try { await supabase.storage.from('invoices').remove([`${invoiceNumber}.pdf`]); } catch { /* negeer */ }
  }
  await supabase.from('orders').update({ invoice_number: null, invoice_pdf_url: null }).eq('id', orderId);
  revalidatePath('/admin/facturen');
}

export async function deleteProduct(productId: string) {
  const supabase = createServiceClient();
  // Ontkoppel het product van bestaande bestellingen (die houden een snapshot van
  // naam/prijs), zodat de bestelhistorie behouden blijft en het verwijderen niet faalt.
  await supabase.from('order_items').update({ product_id: null }).eq('product_id', productId);
  await supabase.from('products').delete().eq('id', productId);
  revalidatePath('/admin/producten');
  revalidatePath('/', 'layout');
}

export async function saveProduct(formData: FormData, productId?: string) {
  const supabase = createServiceClient();
  
  const payload = {
    name: formData.get('name') as string,
    slug: slugify(formData.get('slug') as string || formData.get('name') as string),
    sku: formData.get('sku') as string,
    short_description: formData.get('short_description') as string,
    description: formData.get('description') as string,
    brand: formData.get('brand') as string,
    price_cents: Math.round(parseFloat(formData.get('price') as string || '0') * 100),
    compare_at_price_cents: formData.get('compare_at_price') ? Math.round(parseFloat(formData.get('compare_at_price') as string) * 100) : null,
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

export async function updateCategoryInline(
  id: string,
  data: { name?: string; description?: string; cloudinary_image?: string | null },
) {
  const supabase = createServiceClient();
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.cloudinary_image !== undefined) payload.cloudinary_image = data.cloudinary_image;
  if (Object.keys(payload).length === 0) return;
  await supabase.from('categories').update(payload).eq('id', id);
  revalidatePath('/', 'layout');
}

export async function setProductImage(productId: string, publicId: string) {
  const supabase = createServiceClient();
  const { data: product } = await supabase
    .from('products').select('cloudinary_images').eq('id', productId).maybeSingle();
  const existing: string[] = Array.isArray(product?.cloudinary_images)
    ? [...product!.cloudinary_images]
    : [];
  const next = existing.length ? [publicId, ...existing.slice(1)] : [publicId];
  await supabase.from('products').update({ cloudinary_images: next }).eq('id', productId);
  revalidatePath('/', 'layout');
}

export async function setProductImages(productId: string, publicIds: string[]) {
  const supabase = createServiceClient();
  const next = Array.isArray(publicIds) ? publicIds.filter(Boolean) : [];
  await supabase.from('products').update({ cloudinary_images: next }).eq('id', productId);
  revalidatePath('/', 'layout');
}

export async function setProductPrice(productId: string, priceCents: number) {
  const supabase = createServiceClient();
  const cents = Math.max(0, Math.round(Number(priceCents) || 0));
  await supabase.from('products').update({ price_cents: cents }).eq('id', productId);
  revalidatePath('/', 'layout');
}

export async function setProductName(productId: string, name: string) {
  const supabase = createServiceClient();
  const clean = (name ?? '').trim();
  if (!clean) return; // lege naam negeren
  await supabase.from('products').update({ name: clean }).eq('id', productId);
  revalidatePath('/', 'layout');
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

export async function saveReview(formData: FormData, reviewId?: string) {
  const supabase = createServiceClient();

  const rating = Math.min(5, Math.max(1, parseInt(formData.get('rating') as string || '5', 10) || 5));

  const payload = {
    author: formData.get('author') as string,
    rating,
    body: formData.get('body') as string,
    source: (formData.get('source') as string) || 'Google',
    location: (formData.get('location') as string) || null,
    is_active: formData.get('is_active') === 'true',
    sort_order: parseInt(formData.get('sort_order') as string || '0', 10) || 0,
  };

  if (reviewId) {
    const { error } = await supabase.from('reviews').update(payload).eq('id', reviewId);
    if (error) console.error('Error updating review:', error);
  } else {
    const { error } = await supabase.from('reviews').insert(payload);
    if (error) console.error('Error inserting review:', error);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/reviews');
}

export async function deleteReview(reviewId: string) {
  const supabase = createServiceClient();
  await supabase.from('reviews').delete().eq('id', reviewId);
  revalidatePath('/', 'layout');
  revalidatePath('/admin/reviews');
}

export async function saveCategory(formData: FormData, categoryId?: string) {
  const supabase = createServiceClient();
  
  const payload = {
    name: formData.get('name') as string,
    slug: slugify(formData.get('slug') as string || formData.get('name') as string),
    description: formData.get('description') as string,
    sort_order: parseInt(formData.get('sort_order') as string, 10),
    parent_id: formData.get('parent_id') as string || null,
    cloudinary_image: (formData.get('cloudinary_image') as string) || null,
  };

  if (categoryId) {
    await supabase.from('categories').update(payload).eq('id', categoryId);
  } else {
    await supabase.from('categories').insert(payload);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/categorieen');
}
