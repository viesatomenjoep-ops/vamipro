import { createServiceClient } from '@/lib/supabase/server';
import PreviewEditor from '@/components/admin/PreviewEditor';

export type PreviewCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cloudinary_image: string | null;
};

export type PreviewProduct = {
  id: string;
  name: string;
  cloudinary_images: string[] | null;
};

export default async function PreviewPage() {
  const supabase = createServiceClient();

  const { data: contentRows } = await supabase.from('site_content').select('key, value');
  const content: Record<string, string> = {};
  (contentRows ?? []).forEach((r: any) => { content[r.key] = r.value; });

  // Top-level categorieën (dezelfde die op de homepage-tegels staan).
  const { data: catRows } = await supabase.from('categories')
    .select('id, name, slug, description, cloudinary_image')
    .is('parent_id', null).order('sort_order');
  const categories: PreviewCategory[] = (catRows ?? []) as PreviewCategory[];

  // Producten die op de homepage voorkomen: featured + droogdoek + pakket.
  const { data: featured } = await supabase.from('products')
    .select('id, name, cloudinary_images')
    .eq('is_active', true).eq('is_featured', true).limit(8);

  let { data: towel } = await supabase.from('products').select('id, name, cloudinary_images')
    .eq('slug', 'vami-drying-towel-xl').maybeSingle();
  if (!towel) {
    const { data: alt } = await supabase.from('products').select('id, name, cloudinary_images')
      .eq('slug', 'drooghandoek-xxl-1200-gsm').maybeSingle();
    towel = alt;
  }
  const { data: pakket } = await supabase.from('products').select('id, name, cloudinary_images')
    .eq('slug', 'volledig-pakket-xxl').maybeSingle();

  const byId = new Map<string, PreviewProduct>();
  [...(featured ?? []), towel, pakket].forEach((p: any) => {
    if (p && p.id && !byId.has(p.id)) {
      byId.set(p.id, { id: p.id, name: p.name, cloudinary_images: p.cloudinary_images ?? null });
    }
  });
  const products: PreviewProduct[] = Array.from(byId.values());

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Voorvertoning</h1>
      <p className="text-fg-muted mb-6 text-sm">Klik in de live voorvertoning op een tekst, categorie of productfoto om die direct te bewerken. Wijzigingen zie je meteen; klik op Opslaan om ze op te slaan.</p>
      <PreviewEditor content={content} categories={categories} products={products} />
    </div>
  );
}
