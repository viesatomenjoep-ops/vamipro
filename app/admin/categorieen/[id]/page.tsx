import { createServiceClient } from '@/lib/supabase/server';
import CategoryForm from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

export default async function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  
  const { data: category } = await supabase.from('categories').select('*').eq('id', id).single();
  if (!category) return notFound();

  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).neq('id', id).order('sort_order');

  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Categorie bewerken</h1></div>
      <CategoryForm category={category} parents={categories || []} />
    </div>
  );
}
