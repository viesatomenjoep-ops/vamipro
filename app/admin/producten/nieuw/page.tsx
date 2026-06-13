import { createServiceClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProduct() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Nieuw product toevoegen</h1></div>
      <ProductForm categories={categories || []} />
    </div>
  );
}
