"use server";

import { createServiceClient } from '@/lib/supabase/server';

export async function liveSearch(query: string) {
  if (!query || query.trim().length < 2) {
    return { categories: [], products: [] };
  }
  
  const term = `%${query.trim()}%`;
  const supabase = createServiceClient();

  // Search categories by name
  const catPromise = supabase
    .from('categories')
    .select('id, name, slug')
    .ilike('name', term)
    .limit(3);

  // Search products by name OR short_description
  const prodPromise = supabase
    .from('products')
    .select('id, name, slug, price_cents, cloudinary_images')
    .or(`name.ilike.${term},short_description.ilike.${term}`)
    .is('is_archived', false)
    .limit(5);

  const [catRes, prodRes] = await Promise.all([catPromise, prodPromise]);

  return {
    categories: catRes.data || [],
    products: prodRes.data || [],
  };
}
