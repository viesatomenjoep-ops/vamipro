import { createServiceClient } from '@/lib/supabase/server';
import CategoryForm from '@/components/admin/CategoryForm';

export default async function NewCategory() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Nieuwe categorie toevoegen</h1></div>
      <CategoryForm parents={categories || []} />
    </div>
  );
}
