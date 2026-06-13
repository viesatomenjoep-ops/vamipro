import { createServiceClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
  if (!product) return notFound();

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Product bewerken</h1></div>
      <ProductForm product={product} categories={categories || []} />
    </div>
  );
}
